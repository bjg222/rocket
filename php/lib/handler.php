<?php

class Handler {

	protected $db;

	protected $cmd;

	protected $post = array();

	protected $vars = array();

	public static $cmds = array();

	public function __construct($db) {
		Log::v('Handler', 'Construct: ' . print_r($this->post, TRUE));
		$this->db = $db;
		$cmd = getGetVar('c', 'string');
		foreach ($this->post as $v) {
			$val = getPostVar($v['name'], $v['type']);
			Log::v('Handler', 'Post: ' . $v['name'] . ' (' . $v['type'] . ') = ' . print_r($val, TRUE));
			$this->vars[$v['name']] = $val;
		}
	}

	public function execute() {
		return $this->vars;
	}

	public function manual($vars) {
		foreach(array_keys($this->vars) as $k) {
			if (array_key_exists($k, $vars))
				$this->vars[$k] = $vars[$k];
			else
				$this->vars[$k] = NULL;
		}
		return $this->execute();
	}

}