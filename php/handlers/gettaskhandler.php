<?php

class GetTaskHandler extends Handler {

	protected $post = array(array('name'=>'id', 'type'=>'int'),
							array('name'=>'page', 'type'=>'int'),
							array('name'=>'pagesize', 'type'=>'int'),
							array('name'=>'all', 'type'=>'bool'));

	public static $cmds = array('gettasks', 'gettask', 'get');

	public function execute() {
		if (!is_null($this->vars['id'])) {
			$query = 'SELECT t.id as id, added, edited, completed, done, title, p.textval as priority, due, notes ' .
					'FROM tasks t LEFT JOIN priorities p ON t.priority=p.id WHERE t.id=?';
			$vars = array(array('i'=>$this->vars['id']));
			$rows = $this->db->pquery($query, $vars);
			return $rows;
		} elseif ($this->vars['all']) {
			$query = 'SELECT t.id as id, added, edited, completed, done, title, p.textval as priority, due, notes ' .
					'FROM tasks t LEFT JOIN priorities p ON t.priority=p.id ORDER BY p.ordinal ASC, t.done ASC, -t.due DESC, t.added ASC';
			$rows = $this->db->pquery($query);
			return $rows;
		} else {
			$page = ($this->vars['page'] && $this->vars['page'] > 0 ? $this->vars['page'] : 1);
			$pagesize = ($this->vars['pagesize'] && $this->vars['pagesize'] > 0 ? $this->vars['pagesize'] : 10);
			$start = ($page - 1) * $pagesize;
			$query = 'SELECT t.id as id, added, edited, completed, done, title, p.textval as priority, due, notes ' .
					'FROM tasks t LEFT JOIN priorities p ON t.priority=p.id ORDER BY p.ordinal ASC, t.done ASC, -t.due DESC, t.added ASC LIMIT ?, ?';
			$vars = array(array('i'=>$start),array('i'=>$pagesize));
			$rows = $this->db->pquery($query, $vars);
			return $rows;
		}
		return array();
	}

}