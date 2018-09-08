<?php
	header("Content-Type: text/html; charset=utf-8");

	//Init application
	require_once("modules/Bootstrap.php");
	$application = new Bootstrap();
	$application->load_libraries("modules");
	//$application->load_libraries("libs");
?>