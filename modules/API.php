<?php
	function load_all_components()
	{
		$path = "../";
		require_once($path."modules/Bootstrap.php");

		$application = new Bootstrap($path);
		$application->load_components("modules");
		$application->load_components("models");
	}

	function change_team($new_team_id)
	{
		requestable;

		//Checking the variable
		if (!is_int($new_team_id) || $new_team_id < 1)
			return false;

		load_all_components();

		$user = new User();
		$result = $user->change_user_team($new_team_id);

		return $result;
	}
?>