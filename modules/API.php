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
	function count_users_in_team($team_id)
	{
		requestable;

		//Checking the variable
		if ((is_int($team_id) && $team_id > 0) || $team_id === "all") {
			load_all_components();

			$team = new Team();
			$result = $team->count_users_in_team($team_id);

			return json_encode($result);
		}

		return false;
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
?>