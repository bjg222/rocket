<?php

require_once('lib/util.php');

define('DEBUG', array_key_exists('debug', $_GET));

if (!DEBUG)
	prepare_ob();
else
	prepare_debug();

nocache_headers();

if (!DEBUG)
	json_headers();

$db = new DB('localhost', 'tasks', 'tasks', 'KAttd2tC4nG8ZUsY');

//$cmd = strtolower(filter_input(INPUT_GET, 'c',  FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH));
$cmd = getGetVar('c', 'string');
Log::v('Ajax', 'Command = ' . $cmd);

$handlers = array_filter(scandir('handlers'), function($s) { return is_file('handlers/'.$s) && strpos($s, 'handler.php'); });
array_walk($handlers, function(&$s) { $s = substr($s, 0, -4); });

foreach ($handlers as $handler) {
	if (in_array($cmd, $handler::$cmds)) {
		Log::v('Ajax', 'Using Handler: ' . $handler);
		$h = new $handler($db);
		break;
	}
}

// if (!rand(0,2))
	$res = (isset($h) ? $h->execute() : NULL);
// else
// 	$res = FALSE;

if (is_null($res))
	$out = array('success'=>FALSE, 'err'=>'Unknown command: ' . $cmd);
elseif (!$res)
	$out = array('success'=>FALSE, 'err'=>'Command failed: ' . $cmd);
elseif (is_string($res))
	$out = array('success'=>FALSE, 'err'=>array('Command failed: ' . $cmd, $res));
elseif (is_numeric($res))
	$out = array('success'=>TRUE, 'rows'=>$res);
else
	$out = array('success'=>TRUE, 'data'=>$res);

if (DEBUG) {
	clean_debug();
	echo '<br />' . PHP_EOL . '<br />' . PHP_EOL;
} else {
	$err = clean_ob();
	if ($err)
		$out['err'] = (array_key_exists('err', $out) ? array_merge((array)$out['err'], (array)$err) : (array)$err);
	$log = Log::output(($out['success'] ? 'warning' : 'verbose'), FALSE, TRUE);
	if ($log)
		$out['log'] = $log;
}

echo json_output($out);

if (DEBUG) {
	echo '<br />' . PHP_EOL . '<br />' . PHP_EOL;
	echo Log::output('verbose');
}


?>