<?php
	class Main extends Controller
	{
		public function __construct()
		{
			$this->load_page();

			$user = new User();
			$user_data = $user->login(); //Getting user data

			if ( isset($user_data['team']) )
				$user_team_data = ", teamId: ".$user_data['team'];

			$user_data_script = "var UserData = {id: ".$user_data['id'].$user_team_data."};";

			//--------------------

			$teams_data = $user->get_team_data('all'); //Getting all teams data

			if ($teams_data) {
				$teams_data_script = "var TeamsData = {";

				foreach ($teams_data as $team_id => $team) {
					$team_data = $team_id.": {
						name: \"".$team['name']."\",
						color: {
							r: ".$team['color']['r'].",
							g: ".$team['color']['g'].",
							b: ".$team['color']['b']."
						},
						start: {
							x: ".$team['start']['x'].",
							y: ".$team['start']['y']."
						}
					}, ";

					$teams_data_script .= $team_data;
				}

				$teams_data_script = rtrim($teams_data_script, ", ");
				$teams_data_script .= "};";
			}

			//!!!НАДО ЕЩЁ ПЕРЕДАВАТЬ КОЛ-ВО ИГРОКОВ В КОМАНДЕ!!!

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
			$js_script = "<script>".$user_data_script." ".$teams_data_script." ".$map_data_script."</script>";
			echo $js_script;
		}
	}
?>