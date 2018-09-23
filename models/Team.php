<?php
	class Team extends Model
	{
		public function get_team_data($team_id)
		{
			if ($team_id === 'all') {
				$condition = "1 = 1";
			} else if ( is_int($team_id) ) {
				$condition = "id = '$team_id'";
			}

			$query = "SELECT id, name AS team_name, r, g, b, start_cell FROM sw_teams WHERE $condition";
			$result = $this->query($query);

			if ($result) {
				$team_data = array();

				foreach ($result as $key => $team) {
					$current_team_id = $team['id'];
					$team_name = $team['team_name'];
					$team_color = array('r' => $team['r'], 'g' => $team['g'], 'b' => $team['b']);
					$start_cell = $team['start_cell'];

					$current_team_data = array(
						'name' => $team_name,
						'color' => $team_color,
						'start_cell' => $start_cell
					);

					$team_data[$current_team_id] = $current_team_data;
				}

				return $team_data;
			}
		}

		public function count_users_in_team($team_id)
		{
			if ($team_id === 'all') {
				$query = "SELECT max(id) AS max_id FROM sw_teams";
				$result = $this->query($query);
				$max_id = $result[0]['max_id'];

				$query = "";

				for ($current_id = 1; $current_id < $max_id; $current_id++) {
					$query .= "SELECT team, count(id) AS count_users FROM sw_users WHERE team = '$current_id' UNION ALL ";
				}

				$query = rtrim($query, " UNION ALL ");
			} else if ( is_int($team_id) ) {
				$query = "SELECT team, count(id) AS count_users FROM sw_users WHERE team = '$team_id'";
			} else
				return false;
			
			$sql_result = $this->query($query);

			if ($sql_result) {
				$result = array();

				foreach ($sql_result as $key => $current_result) {
					$team = $current_result['team'];
					$count_users = $current_result['count_users'];

					if ($count_users)
						$result[$team] = $count_users;
				}

				return $result;
			}
		}
	}
?>