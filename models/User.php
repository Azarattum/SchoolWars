<?php
	class User extends Model
	{
		public function login()
		{
			//unset($_SESSION['user_id']); //!!!DEBUGING

			if (isset($_SESSION['user_id'])) {
				$user_id = $_SESSION['user_id'];

				//Getting data from DB
				$query = "SELECT team AS team_id FROM sw_users WHERE id = '$user_id'";
				$result = $this->query($query);
				$team_id = $result['team_id'];

				if ($team_id)
					$team_data = $this->get_team_data($team_id);

				$user_data = array(
					'id' => $user_id,
					'team' => $team_data
				);

				//!!!НАДО ЕЩЁ ПЕРЕДАВАТЬ МАССИВ КЛЕТОК ПОД КОНТРОЛЕМ!!!
				//!!!НАДО ЕЩЁ ПЕРЕДАВАТЬ КОЛ-ВО ИГРОКОВ В КОМАНДЕ!!!

				return $user_data;
			} else {
				//Registration
				$user_id = $this->register();

				if ( is_int($user_id) )
					return array('id' => $user_id);
			}
		}

		private function register()
		{
			//New player
			$query = "INSERT INTO sw_users (id, team, clicks_count) VALUES (NULL, NULL, DEFAULT)";
			$this->query($query);

			//Last id
			$query = "SELECT max(id) AS user_id FROM sw_users";
			$result = $this->query($query);
			$user_id = +$result['user_id'];

			$_SESSION['user_id'] = $user_id;

			return $user_id;
		}

		private function get_team_data($team_id)
		{
			$query = "SELECT name AS team_name, r, g, b, start_x, start_y FROM sw_teams WHERE id = '$team_id'";
			$result = $this->query($query);

			if ($result) {
				$team_name = $result['team_name'];
				$team_color = array('r' => $result['r'], 'g' => $result['g'], 'b' => $result['b']);
				$team_start = array('x' => $result['start_x'], 'y' => $result['start_y']);

				$team_data = array(
					'id' => $team_id,
					'name' => $team_name,
					'color' => $team_color,
					'start' => $team_start
				);

				return $team_data;
			}
		}

		public function change_user_team($new_team_id)
		{
			$user_id = $_SESSION['user_id'];

			if (!$user_id)
				return false;

			$team_data = $this->get_team_data($new_team_id);

			if (!$team_data)
				return false;

			$query = "UPDATE sw_users SET team = '$new_team_id' WHERE id = '$user_id'";
			$result = $this->query($query);

			if ($result)
				return $team_data;
			else
				return false;
		}
	}
?>