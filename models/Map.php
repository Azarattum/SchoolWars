<?php
	class Map extends Model
	{
		public function get_map_data()
		{
			//ПОЛУЧЕНИЕ ВСЕХ КЛЕТОК КАРТЫ (все клетки со всеми данными)

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

		public function get_cells_holder()
		{
			//ПОЛУЧЕНИЕ ВЛАДЕЛЬЦЕВ КАРТЫ (x, y, holder); 0 игнорируется при селекте
		}
	}
?>