<?php

class DB {

	private $mysqli;

	private $stmt;

	public function __construct($host, $db, $user, $pw, $port=NULL) {
		if (!is_null($port))
			$mysqli = new MySQLi($host, $user, $pw, $db, $port);
		else
			$mysqli = new MySQLi($host, $user, $pw, $db);
		if (!$mysqli || $mysqli->connect_error) throw new Exception('Failed to connect to MySQL: ' . $mysqli->connect_error . ' (' . $mysql->connect_errno . ')');
		$this->mysqli = $mysqli;
	}

	public function __destruct() {
		$this->mysqli->close();
		unset($this->mysqli);
	}

	public function __clone() {
		throw new Exception('Database cannot be cloned');
	}

	public function __wakeup() {
		throw new Exception('Database cannot be unserialized.');
	}

	public function escape($s) {
		if (!isset($this->mysqli))
			throw new Exception('Database not connected');
		return $this->mysqli->real_escape_string($s);
	}

	public function errors() {
		if (!isset($this->mysqli))
			throw new Exception('Database not connected');
		$err = $this->mysqli->error;
		Log::d('DB->errors', printvarr($err));
// 		if (is_array($err)) {
// 			$errtext = '';
// 			foreach ($err as $e)
// 				$errtext .= $e['error'] . '; ';
// 			$err = substr($errtext, 0, -2);
// 		}
// 		Log::d('DB->errors', printvarr($err));
		return $err;
	}

	public function last_insert_id() {
		if (!isset($this->mysqli))
			throw new Exception('Database not connected');
		$id = $this->mysqli->insert_id;
		Log::d('DB->errors', printvarr($id));
		return $id;
	}

	public function query($q) {
		if (!isset($this->mysqli))
			throw new Exception('Failed to execute query, database not connected');
		$res = $this->mysqli->query($q);
		if (!($res instanceof MySQLi_Result)) {
			if ($res) {
				Log::d('DB->query', $q . ' ===> ' . $this->mysqli->affected_rows);
				return $this->mysqli->affected_rows;
			}
			Log::d('DB->query', $q . ' ===> FALSE');
			return $res;
		}
		$rows = array();
		while ($row = $res->fetch_array(MYSQLI_ASSOC))
			$rows[] = $row;
		$res->close();
		Log::d('DB->query', $q . '   ===>   ' . sizeof($rows));
		return ($rows);
	}

	private function prepare($q) {
		if (!isset($this->mysqli))
			throw new Exception('Failed to execute query, database not connected');
		if (!is_null($this->stmt))
			throw new Exception('Existing prepared statement must be closed');
		$stmt = $this->mysqli->prepare($q);
		Log::d('DB->prepare', $q . '  ' . printvarr($stmt));
		if (!$stmt) {
			$this->stmt = NULL;
			return FALSE;
		}
		$this->stmt = $stmt;
		return TRUE;
	}

	private function bind($types, $values) {
		if (is_null($this->stmt))
			throw new Exception('No prepared statement');
		if (count($types) != count($values))
			throw new Exception('Different number of types and values');
		if (count($values) == 0)
			return;
		$t = implode('', $types);
		$a = array();
		$a[] = & $t;
		for ($v = 0; $v < count($values); $v ++)
			$a[] = & $values[$v];
		$ret = call_user_func_array(array($this->stmt, 'bind_param'), $a);
		Log::d('DB->bind',  printvarr($types) . ': ' . printvarr($values) . '  ' . printvarr($ret));
		return $ret;
	}

	private function execute() {
		if (is_null($this->stmt))
			throw new Exception('No prepared statement');
		$ret = $this->stmt->execute();
		Log::d('DB->execute', printvarr($ret));
		return $ret;
	}

	private function getresults() {
		if (is_null($this->stmt))
			throw new Exception('No prepared statement');
		$res = $this->stmt->get_result();
		if ($res instanceof MySQLi_Result) {
			$ret = $res->fetch_all(MYSQLI_ASSOC);
			$res->close();
		} else
			$ret = $res;
		Log::d('DB->getresults', printvarr($ret));
		return $ret;
	}

	private function getnumrows() {
		if (is_null($this->stmt))
			throw new Exception('No prepared statement');
		$ret = $this->stmt->affected_rows;
		Log::d('DB->getnumrows', printvarr($ret));
		return $ret;
	}

	private function geterrors() {
		if (is_null($this->stmt))
			throw new Exception('No prepared statement');
		$err = $this->stmt->error_list;
		Log::d('DB->geterrors', printvarr($err));
		if (is_array($err)) {
			$errtext = '';
			foreach ($err as $e)
				$errtext .= $e['error'] . '; ';
			$err = substr($errtext, 0, -2);
		}
		Log::d('DB->geterrors', printvarr($err));
		return $err;
	}

	private function close() {
		if (is_null($this->stmt))
			throw new Exception('No prepared statement');
		$ret = $this->stmt->close();
		$this->stmt = NULL;
		Log::d('DB->close', printvarr($ret));
		return $ret;
	}

	public function pquery($q, $arr=array()) {
		if ($this->prepare($q)) {
			$types = array();
			$values = array();
			foreach ((array)$arr as $a) {
				if (count($a) > 1) {
					$types[] = $a['type'];
					$values[] = $a['value'];
				} else {
					$types[] = key($a);
					$values[] = current($a);
				}
			}
			if (($this->bind($types, $values)) === FALSE) {
				$res = $this->geterrors();
				$this->close();
				return $res;
			}
			if (($this->execute()) === FALSE) {
				$res = $this->geterrors();
				$this->close();
				return $res;
			}
			if (($res = $this->getresults()) === FALSE && ($res = $this->getnumrows()) === FALSE)
				$res = $this->geterrors();
			$this->close();
			return $res;
		} else
			return $this->errors();
	}
}

?>