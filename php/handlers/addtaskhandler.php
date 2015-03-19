<?php

class AddTaskHandler extends Handler {

	protected $post = array(array('name'=>'title', 'type'=>'str'),
							array('name'=>'notes', 'type'=>'str'),
							array('name'=>'priority', 'type'=>'int'),
							array('name'=>'due', 'type'=>'date'));

	public static $cmds = array('addtask', 'add');

	public function execute() {
		$query = 'INSERT INTO tasks (';
		$vars = array();
		if (array_key_exists('title', $this->vars) && !is_null($this->vars['title'])) {
			$query .= 'title, ';
			$vars[] = array('s'=>$this->vars['title']);
		}
		if (!$vars) {
			echo 'Title is required' . PHP_EOL;
			return FALSE;
		}
		if (array_key_exists('notes', $this->vars) && !is_null($this->vars['notes'])) {
			$query .= 'notes, ';
			$vars[] = array('s'=>$this->vars['notes']);
		}
		if (array_key_exists('priority', $this->vars) && !is_null($this->vars['priority'])) {
			$query .= 'priority, ';
			$vars[] = array('i'=>$this->vars['priority']);
		}
		if (array_key_exists('due', $this->vars) && !is_null($this->vars['due'])) {
			$query .= 'due, ';
			$vars[] = array('s'=>$this->vars['due']->format('Y-m-d H:i:s'));
		}
		$query = substr($query, 0, -2) . ') VALUES (' . implode(', ', array_fill(0, count($vars), '?')) . ')';
		$rows = $this->db->pquery($query, $vars);
		if ($rows && is_numeric($rows)) {
			$id = $this->db->last_insert_id();
			$h = new GetTaskHandler($this->db);
			return $h->manual(array('id'=>$id));
		}
		return $rows;
	}

}