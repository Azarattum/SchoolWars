<?php
	class User extends Model
	{
		public function login()
		{
			//unset($_SESSION['user_id']); //!!!DEBUGING

			if (isset($_SESSION['user_id'])) {
				$user_id = $_SESSION['user_id'];

				//Getting user data from DB
				$query = "SELECT team AS team_id FROM sw_users WHERE id = '$user_id'";
				$result = $this->query($query);
				$team_id = $result[0]['team_id'];

				$user_data = array(
					'id' => $user_id,
					'team' => $team_id
				);

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
			$user_id = +$result[0]['user_id'];

			$_SESSION['user_id'] = $user_id;

			return $user_id;
		}

		public function get_team_data($team_id)
		{
			if ($team_id === 'all') {
				$condition = "1 = 1";
			} else if ( is_int($team_id) ) {
				$condition = "id = '$team_id'";
			}

			$query = "SELECT id, name AS team_name, r, g, b, start_x, start_y FROM sw_teams WHERE $condition";
			$result = $this->query($query);

			if ($result) {
				$team_data = array();

				foreach ($result as $key => $team) {
					$current_team_id = $team['id'];
					$team_name = $team['team_name'];
					$team_color = array('r' => $team['r'], 'g' => $team['g'], 'b' => $team['b']);
					$team_start = array('x' => $team['start_x'], 'y' => $team['start_y']);

					$current_team_data = array(
						'id' => $current_team_id,
						'name' => $team_name,
						'color' => $team_color,
						'start' => $team_start
					);

					$team_data[$current_team_id] = $current_team_data;
				}

				return $team_data;
			}
		}

		public function change_user_team($new_team_id)
		{
			$user_id = $_SESSION['user_id'];

			if (!$user_id)
				return false;

			//Check team existence
			$query = "SELECT count(id) AS count FROM sw_teams WHERE id = '$new_team_id'";
			$sql_result = $this->query($query);
			$result = $sql_result[0]['count'];

			if ($result != 1)
				return false;

			$query = "UPDATE sw_users SET team = '$new_team_id' WHERE id = '$user_id'";
			$result = $this->query($query);

			if ($result)
				return true;
			else
				return false;
		}
	}
?>