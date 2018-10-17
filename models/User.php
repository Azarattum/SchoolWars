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
			$query = "INSERT INTO sw_users (id, team) VALUES (NULL, NULL)";
			$this->query($query);

			//Last id
			$query = "SELECT max(id) AS user_id FROM sw_users";
			$result = $this->query($query);
			$user_id = +$result[0]['user_id'];

			$_SESSION['user_id'] = $user_id;

			return $user_id;
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