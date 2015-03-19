<?php

class CompleteTaskHandler extends Handler {

	protected $post = array(array('name'=>'id', 'type'=>'int'),
							array('name'=>'done', 'type'=>'bool'));

	public static $cmds = array('completetask', 'complete');

	public function execute() {
		if (!is_null($this->vars['id'])) {
			$done = (is_null($this->vars['done']) || $this->vars['done'] ? 'TRUE' : 'FALSE');
			$comp = ($done == 'TRUE' ? 'CURRENT_TIMESTAMP' : 'NULL');
			$query = 'UPDATE tasks SET completed=' . $comp . ', done=' . $done . ' WHERE id=?';
			$vars = array(array('i'=>$this->vars['id']));
			$rows = $this->db->pquery($query, $vars);
			return $rows;
		}
		return FALSE;
	}

}