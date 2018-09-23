<?php
	class Map extends Model
	{
		public function get_map_data()
		{
			//Getting all map data
			$query = "SELECT id, x, y, holder, value FROM sw_map";
			$result = $this->query($query);

			if ($result) {
				$map_data = array();

				foreach ($result as $key => $sql_cell) {
					$cell_id = $sql_cell['id'];
					$cell_coords = array('x' => $sql_cell['x'], 'y' => $sql_cell['y']);
					$cell_holder = $sql_cell['holder'];
					$cell_value = $sql_cell['value'];

					$cell = array(
						'coords' => $cell_coords,
						'holder' => $cell_holder,
						'value' => $cell_value
					);

					$map_data[$cell_id] = $cell;
				}

				return $map_data;
			}
		}

		public function get_cells_holders()
		{
			//Getting cell's holders
			$query = "SELECT id, holder FROM sw_map WHERE holder <> 0";
			$result = $this->query($query);

			foreach ($result as $key => $current_result) {
				$cell_id = $current_result['id'];
				$cell_holder = $current_result['holder'];

				$cells_holders[$cell_id] = $cell_holder;
			}

			return $cells_holders;
		}

		public function capture_cell($cell_id)
		{
			if (!is_int($cell_id) || $cell_id < 0)
				return false;

			if (isset($_SESSION['user_id']))
				$user_id = $_SESSION['user_id'];
			else
				return false;

			//Getting user's team
			$query = "SELECT team AS team_id FROM sw_users WHERE id = '$user_id'";
			$result = $this->query($query);
			$team_id = +$result[0]['team_id'];

			if (!$team_id)
				return false;

			//Getting current cell's holder
			$query = "SELECT holder AS cell_holder, x, y FROM sw_map WHERE id = '$cell_id'";
			$result = $this->query($query);
			$cell_holder = +$result[0]['cell_holder'];
			$x = +$result[0]['x'];
			$y = +$result[0]['y'];

			if ($cell_holder === null || $cell_holder < 0 || $cell_holder === $team_id)
				return false;

			//Checking already captured neighbor cells
			if ($y % 2 == 0) {
				$query = "SELECT count(id) AS count FROM sw_map
				WHERE (x = '$x' - 1 AND y = '$y' - 1
					OR x = '$x' AND y = '$y' - 1
					OR x = '$x' - 1 AND y = '$y'
					OR x = '$x' + 1 AND y = '$y'
					OR x = '$x' - 1 AND y = '$y' + 1
					OR x = '$x' AND y = '$y' + 1)
					AND (holder = '$team_id' OR holder = '-$team_id')";
			} else {
				$query = "SELECT count(id) AS count FROM sw_map
				WHERE (x = '$x' AND y = '$y' - 1
					OR x = '$x' + 1 AND y = '$y' - 1
					OR x = '$x' - 1 AND y = '$y'
					OR x = '$x' + 1 AND y = '$y'
					OR x = '$x' AND y = '$y' + 1
					OR x = '$x' + 1 AND y = '$y' + 1)
					AND (holder = '$team_id' OR holder = '-$team_id')";
			}

			$result = $this->query($query);
			$alreadyCapturedNeighborCells = +$result[0]['count'];

			if ($alreadyCapturedNeighborCells < 1)
				return false;

			//Capturing cell
			$query = "UPDATE sw_map SET holder = '$team_id' WHERE id = '$cell_id'";
			$result = $this->query($query);
			
			return $result;
		}
	}
?>