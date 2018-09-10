<?php
	$headers = array_change_key_case(GetAllHeaders());
	
	if (isset($headers["script"]) or die("<!--error-->Warning: Wrong request!")) {
		$script = $_SERVER["DOCUMENT_ROOT"];
		$script .= preg_replace("/\\\\/", "", preg_replace("/\\w*[.]\\w+$/u", "", parse_url($headers["referer"], PHP_URL_PATH)));
		$script .= '/'.urldecode($headers["script"]);
	}

	if (isset($headers["request"]) or die("<!--error-->Warning: Wrong request!"))
		$request = urldecode($headers["request"]);

	if (isset($headers["arguments"]) or die("<!--error-->Warning: Wrong request!"))
		$arguments = json_decode(urldecode($headers["arguments"]), false);
	
	
	if (!str_ends_with(strtolower($script),".php"))
		$script .= ".php";
	
	if(file_exists($script)) {
		ob_start();
		require_once($script);
		ob_end_clean();
	} else
		die("<!--error-->Warning: Script file has not found!");
	
	if (is_callable($request)) {
		$php_file = fread(fopen($script,"r"),filesize($script));
		$reg_exp = "/function +".preg_quote($request)."[(]([^)]*)[)]\\s*[{]\\s*requestable\\W/";

		if (preg_match($reg_exp,$php_file)) {
			ob_start();
			$result = urlencode(call_user_func_array($request,$arguments));
			$echos = urlencode(ob_get_contents());
			ob_end_clean();
			die($echos.$result);
		} else
			die("<!--error-->Warning: Function has not found!");
	} else
		die("<!--error-->Warning: Function has not found!");
	
	function str_ends_with($haystack, $needle)
	{
		$length = strlen($needle);
		return $length === 0 || (substr($haystack, -$length) === $needle);
	}
?>