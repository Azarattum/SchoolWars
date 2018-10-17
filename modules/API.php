<?php
	function load_all_components()
	{
		$path = "../";
		require_once($path."modules/Bootstrap.php");

		$application = new Bootstrap($path);
		$application->load_components("modules");
		$application->load_components("models");
	}

	//-------------------- functions for all pages
	function get_game_status()
	{
		requestable;

		$status = file_get_contents("../status.txt");
		return $status === "true";
	}

	function count_users_in_teams()
	{
		requestable;
		load_all_components();

		$team = new Team();
		$result = $team->count_users_in_teams();

		return json_encode($result);
	}

	function get_cells_holders()
	{
		requestable;
		load_all_components();
		
		$map = new Map();
		$result = $map->get_cells_holders();

		return json_encode($result);
	}

	//-------------------- functions only for main page
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

	function capture_cell($cell_id)
	{
		requestable;
		
		//Checking the variable
		if (!is_int($cell_id) || $cell_id < 0)
			return false;

		load_all_components();

		$map = new Map();
		$result = $map->capture_cell($cell_id);

		return $result;
	}

	//-------------------- functions only for main page
	function start_end($pass)
	{
		requestable;

		if ($pass !== "lalka")
			return false;

		$status = file_put_contents("../status.txt", "false");
		return true;
	}
?>