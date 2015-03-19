<?php

class EditTaskHandler extends Handler {

	protected $post = array(array('name'=>'id', 'type'=>'int'),
							array('name'=>'title', 'type'=>'str'),
							array('name'=>'notes', 'type'=>'str'),
							array('name'=>'priority', 'type'=>'int'),
							array('name'=>'due', 'type'=>'date'));

	public static $cmds = array('edittask', 'edit');

	public function execute() {
		if (!is_null($this->vars['id'])) {
			$query = 'UPDATE tasks SET edited=CURRENT_TIMESTAMP, ';
			$vars = array();
			if (array_key_exists('title', $this->vars) && !is_null($this->vars['title'])) {
				$query .= 'title=?, ';
				$vars[] = array('s'=>$this->vars['title']);
			}
			if (array_key_exists('notes', $this->vars) && !is_null($this->vars['notes'])) {
				$query .= 'notes=?, ';
				$vars[] = array('s'=>$this->vars['notes']);
			}
			if (array_key_exists('priority', $this->vars) && !is_null($this->vars['priority'])) {
				$query .= 'priority=?, ';
				$vars[] = array('i'=>$this->vars['priority']);
			}
			if (array_key_exists('due', $this->vars) && !is_null($this->vars['due'])) {
				$query .= 'due=?, ';
				$vars[] = array('s'=>($this->vars['due'] ? $this->vars['due']->format('Y-m-d H:i:s') : NULL));
			}
			$query = substr($query, 0, -2) . ' WHERE id=?';
			$vars[] = array('i'=>$this->vars['id']);
			$rows = $this->db->pquery($query, $vars);
			return $rows;
		}
		return FALSE;
	}

}