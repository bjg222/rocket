<?php

class RemoveTaskHandler extends Handler {

	protected $post = array(array('name'=>'id', 'type'=>'int'));

	public static $cmds = array('deletetask', 'delete', 'removetask', 'remove');

	public function execute() {
		if (!is_null($this->vars['id'])) {
			$query = 'DELETE FROM tasks WHERE id=?';
			$vars = array(array('i'=>$this->vars['id']));
			$rows = $this->db->pquery($query, $vars);
			return $rows;
		}
		return FALSE;
	}

}