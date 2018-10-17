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
			define("MYSQL_PASS", "kotbanan");
			/*------------------*/

			$teams = array(
				array('id' => 1, 'name' => "10А", 'r' => 255, 'g' => 64, 'b' => 64),
				array('id' => 2, 'name' => "10Б", 'r' => 255, 'g' => 166, 'b' => 64),
				array('id' => 3, 'name' => "10В", 'r' => 255, 'g' => 212, 'b' => 64),
				array('id' => 4, 'name' => "10Г", 'r' => 255, 'g' => 255, 'b' => 64),
				array('id' => 5, 'name' => "10Д", 'r' => 159, 'g' => 243, 'b' => 61),
				array('id' => 6, 'name' => "11А", 'r' => 53, 'g' => 212, 'b' => 164),
				array('id' => 7, 'name' => "11Б", 'r' => 70, 'g' => 113, 'b' => 213),
				array('id' => 8, 'name' => "11В", 'r' => 122, 'g' => 69, 'b' => 214),
				array('id' => 9, 'name' => "11Г", 'r' => 219, 'g' => 55, 'b' => 188)
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
				team TINYINT
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
				b TINYINT UNSIGNED
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
			$cells = array(
				array('x' => 0, 'y' => 0, 'value' => 2, 'holder' => 0),
				array('x' => 4, 'y' => 0, 'value' => 0, 'holder' => -1),
				array('x' => 5, 'y' => 0, 'value' => 3, 'holder' => 0),
				array('x' => 6, 'y' => 0, 'value' => 3, 'holder' => 0),
				array('x' => 7, 'y' => 0, 'value' => 2, 'holder' => 0),
				array('x' => 8, 'y' => 0, 'value' => 3, 'holder' => 0),
				array('x' => 9, 'y' => 0, 'value' => 3, 'holder' => 0),
				array('x' => 10, 'y' => 0, 'value' => 2, 'holder' => 0),
				array('x' => 11, 'y' => 0, 'value' => 4, 'holder' => 0),
				array('x' => 12, 'y' => 0, 'value' => 2, 'holder' => 0),
				array('x' => 13, 'y' => 0, 'value' => 0, 'holder' => -2),

				array('x' => 0, 'y' => 1, 'value' => 0, 'holder' => -3),
				array('x' => 1, 'y' => 1, 'value' => 1, 'holder' => 0),
				array('x' => 2, 'y' => 1, 'value' => 1, 'holder' => 0),
				array('x' => 3, 'y' => 1, 'value' => 1, 'holder' => 0),
				array('x' => 4, 'y' => 1, 'value' => 1, 'holder' => 0),
				array('x' => 5, 'y' => 1, 'value' => 1, 'holder' => 0),
				array('x' => 6, 'y' => 1, 'value' => 3, 'holder' => 0),
				array('x' => 7, 'y' => 1, 'value' => 2, 'holder' => 0),
				array('x' => 8, 'y' => 1, 'value' => 3, 'holder' => 0),
				array('x' => 9, 'y' => 1, 'value' => 1, 'holder' => 0),
				array('x' => 10, 'y' => 1, 'value' => 4, 'holder' => 0),
				array('x' => 11, 'y' => 1, 'value' => 4, 'holder' => 0),
				array('x' => 12, 'y' => 1, 'value' => 2, 'holder' => 0),
				array('x' => 13, 'y' => 1, 'value' => 2, 'holder' => 0),

				array('x' => 0, 'y' => 2, 'value' => 3, 'holder' => 0),
				array('x' => 1, 'y' => 2, 'value' => 3, 'holder' => 0),
				array('x' => 6, 'y' => 2, 'value' => 1, 'holder' => 0),
				array('x' => 7, 'y' => 2, 'value' => 1, 'holder' => 0),
				array('x' => 8, 'y' => 2, 'value' => 2, 'holder' => 0),
				array('x' => 9, 'y' => 2, 'value' => 2, 'holder' => 0),
				array('x' => 10, 'y' => 2, 'value' => 2, 'holder' => 0),
				array('x' => 11, 'y' => 2, 'value' => 4, 'holder' => 0),
				array('x' => 12, 'y' => 2, 'value' => 1, 'holder' => 0),
				array('x' => 13, 'y' => 2, 'value' => 0, 'holder' => -4),

				array('x' => 0, 'y' => 3, 'value' => 2, 'holder' => 0),
				array('x' => 1, 'y' => 3, 'value' => 1, 'holder' => 0),
				array('x' => 2, 'y' => 3, 'value' => 1, 'holder' => 0),
				array('x' => 3, 'y' => 3, 'value' => 1, 'holder' => 0),
				array('x' => 4, 'y' => 3, 'value' => 1, 'holder' => 0),
				array('x' => 5, 'y' => 3, 'value' => 1, 'holder' => 0),
				array('x' => 6, 'y' => 3, 'value' => 1, 'holder' => 0),
				array('x' => 7, 'y' => 3, 'value' => 1, 'holder' => 0),
				array('x' => 8, 'y' => 3, 'value' => 1, 'holder' => 0),
				array('x' => 9, 'y' => 3, 'value' => 1, 'holder' => 0),
				array('x' => 10, 'y' => 3, 'value' => 1, 'holder' => 0),
				array('x' => 11, 'y' => 3, 'value' => 2, 'holder' => 0),
				array('x' => 12, 'y' => 3, 'value' => 2, 'holder' => 0),
				array('x' => 13, 'y' => 3, 'value' => 2, 'holder' => 0),

				array('x' => 0, 'y' => 4, 'value' => 2, 'holder' => 0),
				array('x' => 2, 'y' => 4, 'value' => 1, 'holder' => 0),
				array('x' => 3, 'y' => 4, 'value' => 1, 'holder' => 0),
				array('x' => 4, 'y' => 4, 'value' => 1, 'holder' => 0),
				array('x' => 5, 'y' => 4, 'value' => 7, 'holder' => 0),
				array('x' => 6, 'y' => 4, 'value' => 9, 'holder' => 0),
				array('x' => 7, 'y' => 4, 'value' => 2, 'holder' => 0),
				array('x' => 8, 'y' => 4, 'value' => 1, 'holder' => 0),
				array('x' => 9, 'y' => 4, 'value' => 1, 'holder' => 0),
				array('x' => 10, 'y' => 4, 'value' => 1, 'holder' => 0),
				array('x' => 11, 'y' => 4, 'value' => 1, 'holder' => 0),
				array('x' => 12, 'y' => 4, 'value' => 3, 'holder' => 0),
				array('x' => 13, 'y' => 4, 'value' => 2, 'holder' => 0),

				array('x' => 0, 'y' => 5, 'value' => 0, 'holder' => -5),
				array('x' => 2, 'y' => 5, 'value' => 2, 'holder' => 0),
				array('x' => 3, 'y' => 5, 'value' => 1, 'holder' => 0),
				array('x' => 4, 'y' => 5, 'value' => 9, 'holder' => 0),
				array('x' => 5, 'y' => 5, 'value' => 10, 'holder' => 0),
				array('x' => 6, 'y' => 5, 'value' => 7, 'holder' => 0),
				array('x' => 7, 'y' => 5, 'value' => 2, 'holder' => 0),
				array('x' => 9, 'y' => 5, 'value' => 4, 'holder' => 0),
				array('x' => 10, 'y' => 5, 'value' => 4, 'holder' => 0),
				array('x' => 12, 'y' => 5, 'value' => 3, 'holder' => 0),
				array('x' => 13, 'y' => 5, 'value' => 0, 'holder' => -6),

				array('x' => 0, 'y' => 6, 'value' => 2, 'holder' => 0),
				array('x' => 1, 'y' => 6, 'value' => 2, 'holder' => 0),
				array('x' => 2, 'y' => 6, 'value' => 2, 'holder' => 0),
				array('x' => 4, 'y' => 6, 'value' => 1, 'holder' => 0),
				array('x' => 5, 'y' => 6, 'value' => 7, 'holder' => 0),
				array('x' => 6, 'y' => 6, 'value' => 9, 'holder' => 0),
				array('x' => 7, 'y' => 6, 'value' => 2, 'holder' => 0),
				array('x' => 9, 'y' => 6, 'value' => 4, 'holder' => 0),
				array('x' => 10, 'y' => 6, 'value' => 4, 'holder' => 0),
				array('x' => 12, 'y' => 6, 'value' => 3, 'holder' => 0),
				array('x' => 13, 'y' => 6, 'value' => 2, 'holder' => 0),

				array('x' => 0, 'y' => 7, 'value' => 3, 'holder' => 0),
				array('x' => 1, 'y' => 7, 'value' => 2, 'holder' => 0),
				array('x' => 2, 'y' => 7, 'value' => 2, 'holder' => 0),
				array('x' => 3, 'y' => 7, 'value' => 2, 'holder' => 0),
				array('x' => 4, 'y' => 7, 'value' => 2, 'holder' => 0),
				array('x' => 5, 'y' => 7, 'value' => 1, 'holder' => 0),
				array('x' => 6, 'y' => 7, 'value' => 1, 'holder' => 0),
				array('x' => 7, 'y' => 7, 'value' => 1, 'holder' => 0),
				array('x' => 9, 'y' => 7, 'value' => 1, 'holder' => 0),
				array('x' => 10, 'y' => 7, 'value' => 1, 'holder' => 0),
				array('x' => 11, 'y' => 7, 'value' => 1, 'holder' => 0),
				array('x' => 12, 'y' => 7, 'value' => 2, 'holder' => 0),
				array('x' => 13, 'y' => 7, 'value' => 1, 'holder' => 0),

				array('x' => 0, 'y' => 8, 'value' => 1, 'holder' => 0),
				array('x' => 1, 'y' => 8, 'value' => 3, 'holder' => 0),
				array('x' => 2, 'y' => 8, 'value' => 2, 'holder' => 0),
				array('x' => 3, 'y' => 8, 'value' => 3, 'holder' => 0),
				array('x' => 4, 'y' => 8, 'value' => 3, 'holder' => 0),
				array('x' => 5, 'y' => 8, 'value' => 1, 'holder' => 0),
				array('x' => 6, 'y' => 8, 'value' => 1, 'holder' => 0),
				array('x' => 7, 'y' => 8, 'value' => 2, 'holder' => 0),
				array('x' => 8, 'y' => 8, 'value' => 5, 'holder' => 0),
				array('x' => 9, 'y' => 8, 'value' => 5, 'holder' => 0),
				array('x' => 10, 'y' => 8, 'value' => 2, 'holder' => 0),
				array('x' => 11, 'y' => 8, 'value' => 1, 'holder' => 0),

				array('x' => 0, 'y' => 9, 'value' => 3, 'holder' => 0),
				array('x' => 1, 'y' => 9, 'value' => 2, 'holder' => 0),
				array('x' => 2, 'y' => 9, 'value' => 1, 'holder' => 0),
				array('x' => 3, 'y' => 9, 'value' => 3, 'holder' => 0),
				array('x' => 4, 'y' => 9, 'value' => 1, 'holder' => 0),
				array('x' => 5, 'y' => 9, 'value' => 1, 'holder' => 0),
				array('x' => 6, 'y' => 9, 'value' => 1, 'holder' => 0),
				array('x' => 8, 'y' => 9, 'value' => 5, 'holder' => 0),
				array('x' => 10, 'y' => 9, 'value' => 1, 'holder' => 0),
				array('x' => 11, 'y' => 9, 'value' => 1, 'holder' => 0),
				array('x' => 12, 'y' => 9, 'value' => 1, 'holder' => 0),
				array('x' => 13, 'y' => 9, 'value' => 1, 'holder' => 0),

				array('x' => 0, 'y' => 10, 'value' => 0, 'holder' => -7),
				array('x' => 1, 'y' => 10, 'value' => 2, 'holder' => 0),
				array('x' => 6, 'y' => 10, 'value' => 1, 'holder' => 0),
				array('x' => 7, 'y' => 10, 'value' => 2, 'holder' => 0),
				array('x' => 8, 'y' => 10, 'value' => 5, 'holder' => 0),
				array('x' => 9, 'y' => 10, 'value' => 5, 'holder' => 0),
				array('x' => 10, 'y' => 10, 'value' => 2, 'holder' => 0),
				array('x' => 11, 'y' => 10, 'value' => 1, 'holder' => 0),
				array('x' => 12, 'y' => 10, 'value' => 6, 'holder' => 0),
				array('x' => 13, 'y' => 10, 'value' => 8, 'holder' => 0),

				array('x' => 0, 'y' => 11, 'value' => 1, 'holder' => 0),
				array('x' => 1, 'y' => 11, 'value' => 1, 'holder' => 0),
				array('x' => 2, 'y' => 11, 'value' => 1, 'holder' => 0),
				array('x' => 3, 'y' => 11, 'value' => 1, 'holder' => 0),
				array('x' => 4, 'y' => 11, 'value' => 1, 'holder' => 0),
				array('x' => 5, 'y' => 11, 'value' => 2, 'holder' => 0),
				array('x' => 6, 'y' => 11, 'value' => 1, 'holder' => 0),
				array('x' => 7, 'y' => 11, 'value' => 1, 'holder' => 0),
				array('x' => 9, 'y' => 11, 'value' => 1, 'holder' => 0),
				array('x' => 10, 'y' => 11, 'value' => 1, 'holder' => 0),
				array('x' => 11, 'y' => 11, 'value' => 1, 'holder' => 0),
				array('x' => 13, 'y' => 11, 'value' => 1, 'holder' => 0),

				array('x' => 0, 'y' => 12, 'value' => 3, 'holder' => 0),
				array('x' => 1, 'y' => 12, 'value' => 3, 'holder' => 0),
				array('x' => 2, 'y' => 12, 'value' => 3, 'holder' => 0),
				array('x' => 3, 'y' => 12, 'value' => 1, 'holder' => 0),
				array('x' => 4, 'y' => 12, 'value' => 1, 'holder' => 0),
				array('x' => 5, 'y' => 12, 'value' => 3, 'holder' => 0),
				array('x' => 6, 'y' => 12, 'value' => 1, 'holder' => 0),
				array('x' => 7, 'y' => 12, 'value' => 1, 'holder' => 0),
				array('x' => 8, 'y' => 12, 'value' => 1, 'holder' => 0),
				array('x' => 9, 'y' => 12, 'value' => 1, 'holder' => 0),
				array('x' => 11, 'y' => 12, 'value' => 1, 'holder' => 0),
				array('x' => 12, 'y' => 12, 'value' => 8, 'holder' => 0),
				array('x' => 13, 'y' => 12, 'value' => 6, 'holder' => 0),

				array('x' => 0, 'y' => 13, 'value' => 1, 'holder' => 0),
				array('x' => 1, 'y' => 13, 'value' => 1, 'holder' => 0),
				array('x' => 2, 'y' => 13, 'value' => 0, 'holder' => -8),
				array('x' => 3, 'y' => 13, 'value' => 1, 'holder' => 0),
				array('x' => 4, 'y' => 13, 'value' => 3, 'holder' => 0),
				array('x' => 5, 'y' => 13, 'value' => 3, 'holder' => 0),
				array('x' => 6, 'y' => 13, 'value' => 2, 'holder' => 0),
				array('x' => 7, 'y' => 13, 'value' => 2, 'holder' => 0),
				array('x' => 8, 'y' => 13, 'value' => 0, 'holder' => -9),
				array('x' => 9, 'y' => 13, 'value' => 1, 'holder' => 0),
				array('x' => 11, 'y' => 13, 'value' => 1, 'holder' => 0),
				array('x' => 12, 'y' => 13, 'value' => 1, 'holder' => 0),
				array('x' => 13, 'y' => 13, 'value' => 1, 'holder' => 0)
			);

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
				if (!$value && $value !== 0) $value = 1;

				$query .= " SELECT '$id' AS id, '$holder' AS holder, '$x' AS x, '$y' AS y, '$value' AS value UNION ALL";
			}

			$query = rtrim($query, " UNION ALL");

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