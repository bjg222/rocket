<?php

class GetPriorityHandler extends Handler {

	protected $post = array(array('name'=>'id', 'type'=>'int'));

	public static $cmds = array('getpriorities', 'getpriority', 'priorities', 'priority');

	public function execute() {
		if (!is_null($this->vars['id'])) {
			$query = 'SELECT * FROM priorities WHERE id=?';
			$vars = array(array('i'=>$this->vars['id']));
			$rows = $this->db->pquery($query, $vars);
			return $rows;
		} else {
			$query = 'SELECT * FROM priorities ORDER BY ordinal ASC';
			$rows = $this->db->pquery($query);
			return $rows;
		}
		return array();
	}

}