<?php
	header("Content-Type: text/html; charset=utf-8");

	require_once("modules/Bootstrap.php");
	
	//Init application
	$application = new Bootstrap("");
	
	if ($application->is_loaded) {
		$application->load_components("modules");
		$application->load_components("models");
		$application->initialize();
	}
?>