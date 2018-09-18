<?php
	class Main extends Controller
	{
		public function __construct()
		{
			session_start();

			$this->load_page();

			$user = new User();
			$data = $user->login();

			//Building js script
			$user_data = "id: ".$data['id'];
			$team_data = "";

			if (isset( $data['team'] ) && isset( $data['team']['id'] )) {
				$team_data = ", team: {
					id: ".$data['team']['id'].",
					name: \"".$data['team']['name']."\",
					color: {
						r: ".$data['team']['color']['r'].",
						g: ".$data['team']['color']['g'].",
						b: ".$data['team']['color']['b']."
					},
					start: {
						x: ".$data['team']['start']['x'].",
						y: ".$data['team']['start']['y']."
					}
				}";
			}

			//!!!НАДО ЕЩЁ ПЕРЕДАВАТЬ МАССИВ КЛЕТОК ПОД КОНТРОЛЕМ!!!
			//!!!НАДО ЕЩЁ ПЕРЕДАВАТЬ КОЛ-ВО ИГРОКОВ В КОМАНДЕ!!!

			$js_script = "<script>var UserData = {".$user_data.$team_data."};</script>";
			echo $js_script;
		}
	}
?>