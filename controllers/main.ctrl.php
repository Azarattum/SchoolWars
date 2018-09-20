<?php
	class Main extends Controller
	{
		public function __construct()
		{
			$this->load_page();

			$user = new User();
			$user_data = $user->login(); //Getting user's data

			//Building js script
			if ( isset($user_data['team']) )
				$user_team_data = ", teamId: ".$user_data['team'];

			$user_data_script = "var UserData = {id: ".$user_data['id'].$user_team_data."};";

			$teams_data = $user->get_team_data('all'); //Getting all teams' data

			if ( $teams_data ) {
				$teams_data_script = "var TeamsData = {";

				foreach ($teams_data as $team_id => $team) {
					$team_data = $team['id'].": {
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

				$query = rtrim($query, ", ");
				$teams_data_script .= "};";
			}

			//!!!НАДО ЕЩЁ ПЕРЕДАВАТЬ МАССИВ КЛЕТОК ПОД КОНТРОЛЕМ!!!
			//!!!НАДО ЕЩЁ ПЕРЕДАВАТЬ КОЛ-ВО ИГРОКОВ В КОМАНДЕ!!!

			$js_script = "<script>".$user_data_script." ".$teams_data_script."</script>";
			echo $js_script;
		}
	}
?>