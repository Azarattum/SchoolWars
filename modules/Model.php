<?php
	class Model
	{
		protected $database;

		public function __construct()
		{
			//Base model constuctor
			/*Local database*/
			define("HOST", "localhost");
			define("DATABASE", "sw");
			define("MYSQL_USER", "root");
			define("MYSQL_PASS", "");
			/*Interkot database*/
			/*define("HOST", "localhost");
			define("DATABASE", "www-eva-net_study");
			define("MYSQL_USER", "046397785_kot");
			define("MYSQL_PASS", "kotbanan");*/
			/*------------------*/

			$teams = array(
				array('id' => 1, 'name' => "10А", 'r' => 255, 'g' => 64, 'b' => 64, 'start_cell' => 1),
				array('id' => 2, 'name' => "10Б", 'r' => 255, 'g' => 166, 'b' => 64, 'start_cell' => 5),
				array('id' => 3, 'name' => "10В", 'r' => 255, 'g' => 212, 'b' => 64, 'start_cell' => 21),
				array('id' => 4, 'name' => "10Г", 'r' => 255, 'g' => 255, 'b' => 64, 'start_cell' => 26),
				array('id' => 5, 'name' => "10Д", 'r' => 159, 'g' => 243, 'b' => 61, 'start_cell' => 36),
				array('id' => 6, 'name' => "11А", 'r' => 53, 'g' => 212, 'b' => 164, 'start_cell' => 46),
				array('id' => 7, 'name' => "11Б", 'r' => 70, 'g' => 113, 'b' => 213, 'start_cell' => 51),
				array('id' => 8, 'name' => "11В", 'r' => 122, 'g' => 69, 'b' => 214, 'start_cell' => 67),
				array('id' => 9, 'name' => "11Г", 'r' => 219, 'g' => 55, 'b' => 188, 'start_cell' => 71)
			);

			//DB connection
			$this->database = new mysqli(HOST, MYSQL_USER, MYSQL_PASS) or die( mysqli_error() );
			$this->query("CREATE DATABASE IF NOT EXISTS ".DATABASE); //For local usage
			$this->database->select_db(DATABASE);

			//Tables creation
			$this->create_users_table();
			$this->create_teams_table($teams);
			$this->create_map_table($teams);

			//!!!СНОС БАЗЫ
			//$this->delete_db();

			//!!!СНОС ТАБЛИЦ
			//$this->delete_tables();
		}

		private function create_users_table()
		{
			$query = "CREATE TABLE IF NOT EXISTS sw_users(
				id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
				team TINYINT,
				clicks_count INT DEFAULT 0
			)";

			$this->query($query);
		}

		private function create_teams_table($teams)
		{
			$query = "CREATE TABLE IF NOT EXISTS sw_teams(
				id TINYINT NOT NULL PRIMARY KEY,
				name VARCHAR(16),
				r TINYINT UNSIGNED,
				g TINYINT UNSIGNED,
				b TINYINT UNSIGNED,
				start_cell INT
			)";

			$this->query($query);

			$teams_count = count($teams);
			$query = "INSERT IGNORE INTO sw_teams";

			for ($i = 0; $i < $teams_count; $i++) {
				$team = $teams[$i];

				//Building query
				$query .= " SELECT";

				foreach ($team as $key => $value) {
					$query .= " \"$value\" AS $key,";
				}

				$query = rtrim($query, ',');
				$query .= " UNION ALL";
			}

			$query = rtrim($query, " UNION ALL");

			$this->query($query);
		}

		private function create_map_table($teams)
		{
			$query = "CREATE TABLE IF NOT EXISTS sw_map(
				id INT NOT NULL PRIMARY KEY,
				holder TINYINT,
				x SMALLINT NOT NULL,
				y SMALLINT NOT NULL,
				value TINYINT
			)";

			$this->query($query);

			//Building map
			$cells = array();
			//$cell = array('x' => x, 'y' => y, 'value' => value, 'holder' => holder)

			for ($y = 0; $y < 11; $y++) {
				for ($x = 0; $x < 7; $x++) {
					if (
						($x == 2 && $y == 4)
						|| ($x == 4 && $y == 3)
						|| ($x == 2 && $y == 7)
						|| ($x == 5 && $y == 6)
					)
						continue;

					$cell = array('x' => $x, 'y' => $y);

					$abs = abs($x - 3) + abs($y - 5);

					if ($abs === 0)
						$value = 7;
					else {
						$value = floor(7 / $abs);
					}

					$cell['value'] = $value;

					array_push($cells, $cell);
				}
			}

			//Building query
			$cell_count = count($cells);
			$query = "INSERT IGNORE INTO sw_map";

			for ($id = 0; $id < $cell_count; $id++) {
				$cell = $cells[$id];

				$holder = $cell['holder'];
				$x = $cell['x'];
				$y = $cell['y'];
				$value = $cell['value'];

				if (!$holder) $holder = 0;
				if (!$value) $value = 1;

				$query .= " SELECT '$id' AS id, '$holder' AS holder, '$x' AS x, '$y' AS y, '$value' AS value UNION ALL";
			}

			$query = rtrim($query, " UNION ALL");

			$teams_count = count($teams);

			for ($i = 0; $i < $teams_count; $i++) {
				$team_id = $teams[$i]['id'];
				$start_cell = $teams[$i]['start_cell'];

				$query = str_replace("'".$start_cell."' AS id, '0' AS holder",
					"'".$start_cell."' AS id, '".-$team_id."' AS holder", $query);
			}

			$this->query($query);
		}

		protected function query($query)
		{
			$result = $this->database->query($query);

			if (gettype($result) === "boolean") {
				if ($result)
					return $result;
				else
					die("Error: ".$this->database->error." in ".$query);
			} else {
				if ( mysqli_num_rows($result) ) {
					//Fetching information
					$data = array();

					while ($row = mysqli_fetch_assoc($result)) {
						$data_row = array();

						foreach ($row as $key => $value) {
							$data_row[$key] = $value;
						}

						array_push($data, $data_row);
					}

					return $data;
				}
			}
		}

		//For debuging!!!
		public function delete_db()
		{
			return $this->query("DROP DATABASE sw");
		}

		public function delete_tables()
		{
			return $this->query("DROP TABLE sw_map, sw_teams, sw_users");
		}
	}
?>