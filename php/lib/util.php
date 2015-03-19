<?php

function autoload_class($class) {
	foreach (array('lib', 'handlers') as $f) {
		if (is_file(getcwd() . '/' . $f . '/' . $class . '.php')) {
			require_once(getcwd() . '/' . $f . '/' . $class . '.php');
			return;
		}
	}
	if (strtolower($class) != $class)
		autoload_class(strtolower($class));
}

spl_autoload_register('autoload_class');

function in_array_r($needle, $haystack) {
	foreach ($haystack as $item) {
		if ($item === $needle || (is_array($item) && in_array_r($needle, $item))) {
			return true;
		}
	}
	return false;
}

function preprint($s, $ret = FALSE) {
	$val = "<pre>\n";
	$val .= htmlentities(print_r($s, TRUE));
	$val .= "</pre>\n";
	if ($ret)
		return $val;
	echo $val;
}

function printvar($b, $ret = FALSE) {
	if ($b === TRUE)
		$out = 'TRUE';
	elseif ($b === FALSE)
		$out = 'FALSE';
	elseif (is_array($b) || is_object($b))
		$out = print_r($b, TRUE);
	else
		$out = (string)$b;
	if ($ret)
		return $out;
	echo $out;
}

function printvarr($b) {
	return printvar($b, TRUE);
}

function prepare_ob() {
	ob_start();
	ini_set('html_errors', FALSE);
	set_time_limit(10);
}

function clean_ob() {
	return array_values(array_filter(explode("\n", ob_get_clean())));
}

function prepare_debug() {
	echo '<pre>' . PHP_EOL;
}

function clean_debug() {
	echo '</pre>' . PHP_EOL;
}

function nocache_headers() {
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 1 Jan 1990 00:00:00 GMT');
}

function json_headers() {
	header('Content-type: application/json');
}

function json_output($ob) {
	return json_encode($ob);
}

function getPostVar($name, $type) {
	return getVar($name, $type, INPUT_POST);
}

function getGetVar($name, $type) {
	return getVar($name, $type, INPUT_GET);
}

function getVar($name, $type, $source=INPUT_POST) {
	switch ($source) {
		case INPUT_GET:										break;
		case INPUT_REQUEST:									break;
		case INPUT_POST:									break;
		case 'get':				$source = INPUT_GET;		break;
		case 'request':			$source = INPUT_REQUEST;	break;
		case 'post':			$source = INPUT_POST;		break;
		default:				$source = INPUT_POST;		break;
	}
	switch ($type) {
		case 'integer':
		case 'int':			$filter = FILTER_VALIDATE_INT;				break;
		case 'float':		$filter = FILTER_VALIDATE_FLOAT;			break;
		case 'boolean':
		case 'bool':		$filter = FILTER_VALIDATE_BOOLEAN;			break;
		case 'date':
		case 'string':
		case 'str':			$filter = FILTER_SANITIZE_STRING;
							$flags = FILTER_FLAG_NO_ENCODE_QUOTES |
									 FILTER_FLAG_STRIP_LOW |
									 FILTER_FLAG_STRIP_HIGH;			break;
		default:			$filter = $type;							break;
	}
	if (!isset($flags))
		$flags = 0;
	Log::v('Filter', $source . ' ' . $name . ' ' . $filter . ' ' . $flags);
	$val = filter_input($source, $name, $filter, $flags);
	if (!is_null($val)) {
		switch ($type) {
// 			case 'integer':
// 			case 'int':
// 			case FILTER_SANITIZE_NUMBER_INT:
// 				$val = intval($val);
// 				break;
// 			case 'float':
// 			case FILTER_SANITIZE_NUMBER_FLOAT:
// 				$val = floatval($val);
// 				break;
			case 'date':
				try {
					if (!$val)
						$val = false;
					else {
						$d = new DateTime($val);
						$val = $d;
					}
				} catch (Exception $e) {
					$val = false;
				}
				break;
			case 'string':
			case 'str':
				$val = trim($val);
				break;
		}
	}
	return $val;
}