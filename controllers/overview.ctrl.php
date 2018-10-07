<?php
	class Overview extends Controller
	{
		public function __construct()
		{
			$this->load_page();

			$team = new Team();
			$teams_data = $team->get_team_data('all'); //Getting all teams data

			if ($teams_data) {
				$teams_data_script = "var TeamsData = {";

				foreach ($teams_data as $team_id => $current_team) {
					$team_data = $team_id.": {
						name: \"".$current_team['name']."\",
						color: {
							r: ".$current_team['color']['r'].",
							g: ".$current_team['color']['g'].",
							b: ".$current_team['color']['b']."
						},
						startCell: ".$current_team['start_cell']."
					}, ";

					$teams_data_script .= $team_data;
				}

				$teams_data_script = rtrim($teams_data_script, ", ");
				$teams_data_script .= "};";
			}

			$count_users_in_teams = $team->count_users_in_teams();

			if ($count_users_in_teams) {
				$teams_data_script .= " var UsersCountInTeams = {";

				foreach ($count_users_in_teams as $team_id => $count_users) {
					$count_users_data = $team_id.": ".$count_users.", ";
					$teams_data_script .= $count_users_data;
				}

				$teams_data_script = rtrim($teams_data_script, ", ");
				$teams_data_script .= "};";
			}

			//--------------------

			$map = new Map();
			$map_data = $map->get_map_data(); //Getting map data

			if ($map_data) {
				$map_data_script = "var MapData = {";

				foreach ($map_data as $cell_id => $cell) {
					$cell_data = $cell_id.": {
						coords: {
							x: ".$cell['coords']['x'].",
							y: ".$cell['coords']['y']."
						},
						holder: ".$cell['holder'].",
						value: ".$cell['value']."
					}, ";

					$map_data_script .= $cell_data;
				}

				$map_data_script = rtrim($map_data_script, ", ");
				$map_data_script .= "};";
			}


			//Building js script
			$js_script = "<script>".$teams_data_script." ".$map_data_script."</script>";
			echo $js_script;
		}
	}
?>