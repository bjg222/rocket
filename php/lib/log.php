<?php

class Log {

	public static $lvls = array('', 'e', 'w', 'i', 'd', 'v');

	private static $msgs = array();

	public static function e($tag, $msg) { self::l(1, $tag, $msg); }
	public static function w($tag, $msg) { self::l(2, $tag, $msg); }
	public static function i($tag, $msg) { self::l(3, $tag, $msg); }
	public static function d($tag, $msg) { self::l(4, $tag, $msg); }
	public static function v($tag, $msg) { self::l(5, $tag, $msg); }

	private static function l($lvl, $tag, $msg) {
		self::$msgs[] = new LogMessage($lvl, $tag, $msg);
	}

	public static function hasMessages() {
		return (count(self::$msgs) > 0);
	}

	public static function output($lvl, $html = TRUE, $array = FALSE, $echo = FALSE) {
		if (!self::hasMessages())
			return '';
		if (!is_numeric($lvl)) {
			switch(strtolower($lvl[0])) {
				case 'v':	$lvl = 5;	break;
				case 'd':	$lvl = 4;	break;
				case 'i':	$lvl = 3;	break;
				case 'w':	$lvl = 2;	break;
				case 'e':	$lvl = 1;	break;
				default:	$lvl = 0;	break;
			}
		}
		$out = array();
		foreach(self::$msgs as $msg) {
			if ($msg->lvl <= $lvl)
				$out[] = $msg->output($html);
		}
		if (!$array)
			$out = implode(PHP_EOL, $out);
		if ($echo)
			echo $out;
		else
			return $out;
	}
}

class LogMessage {

	public $lvl;

	private $tag;
	private $msg;
	private $trace;

	public function __construct($lvl, $tag, $msg) {
		$this->lvl = $lvl;
		$this->tag = $tag;
		$this->msg = $msg;
		$trace = debug_backtrace(FALSE);
		foreach ($trace as $call) {
			if ($call['file'] != 'log.php')
				$this->trace[] = array('function' => $call['function'], 'file' => $call['file'], 'line' => $call['line']);
		}
	}

	public function output($html = TRUE, $echo = FALSE) {
		if ($html)
			$out = '<b>(' . Log::$lvls[$this->lvl] . ') ' . $this->tag . ':</b> ' . htmlentities($this->msg) . '<br />';
		else
			$out = '(' . Log::$lvls[$this->lvl] . ') ' . $this->tag . ': ' . $this->msg;
		if ($echo)
			echo $out;
		else
			return $out;
	}

}

?>