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
	}
?>