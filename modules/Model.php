<?php
	class Model
	{
		protected $database;

		public function __construct()
		{
			//Base model constuctor

			function create_players_table($model)
			{
				$model->query("CREATE TABLE IF NOT EXISTS sw_players(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, team TINYINT, clicks_count INT)")
					or die("Не получилось создать таблицу игроков.");
			}

			function create_teams_table($teams, $model)
			{
				$model->query("CREATE TABLE IF NOT EXISTS sw_teams(id TINYINT NOT NULL PRIMARY KEY, name VARCHAR(16), r TINYINT UNSIGNED, g TINYINT UNSIGNED, b TINYINT UNSIGNED, start_x TINYINT, start_y TINYINT)")
					or die("Не получилось создать таблицу команд.");

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
				$result = $model->query($query);
			}

			function create_map_table($teams, $model)
			{
				$model->query("CREATE TABLE IF NOT EXISTS sw_map(id INT NOT NULL PRIMARY KEY, x SMALLINT NOT NULL, y SMALLINT NOT NULL, holder TINYINT, value TINYINT)")
					or die("Не получилось создать таблицу клеток карты.");

				$cells = array(
					array('x' => 0, 'y' => 0),
					array('x' => 1, 'y' => 0),
					array('x' => 2, 'y' => 0),
					array('x' => 0, 'y' => 1, 'value' => 2),
					array('x' => 1, 'y' => 1),
					array('x' => 2, 'y' => 1),
					array('x' => 0, 'y' => 2),
					array('x' => 1, 'y' => 2, 'value' => 3),
					array('x' => 2, 'y' => 2)
				);

				//Building query
				$cell_count = count($cells);
				$query = "INSERT IGNORE INTO sw_map";

				for ($id = 0; $id < $cell_count; $id++) {
					$cell = $cells[$id];

					$x = $cell['x'];
					$y = $cell['y'];
					$holder = $cell['holder'];
					$value = $cell['value'];

					if (!$holder) $holder = 0;
					if (!$value) $value = 1;

					$query .= " SELECT '$id' AS id, '$x' AS x, '$y' AS y, '$holder' AS holder, '$value' AS value UNION ALL";
				}

				$query = rtrim($query, " UNION ALL");

				$teams_count = count($teams);

				for ($i = 0; $i < $teams_count; $i++) {
					$team_id = $teams[$i]['id'];
					$start_x = $teams[$i]['start_x'];
					$start_y = $teams[$i]['start_y'];

					$query = str_replace("'".$start_x."' AS x, '".$start_y."' AS y, '0' AS holder",
						"'".$start_x."' AS x, '".$start_y."' AS y, '".-$team_id."' AS holder", $query);
				}

				return $model->query($query);
			}
			
			define("HOST", "localhost");
			define("DATABASE", "sw");
			define("MYSQL_USER", "root");
			define("MYSQL_PASS", "");

			$teams = array(
				array('id' => 1, 'name' => "10А", 'r' => 0, 'g' => 0, 'b' => 0, 'start_x' => 0, 'start_y' => 0),
				array('id' => 2, 'name' => "10Б", 'r' => 0, 'g' => 0, 'b' => 0, 'start_x' => 1, 'start_y' => 0),
				array('id' => 3, 'name' => "10В", 'r' => 0, 'g' => 0, 'b' => 0, 'start_x' => 2, 'start_y' => 0),
				array('id' => 4, 'name' => "10Г", 'r' => 0, 'g' => 0, 'b' => 0, 'start_x' => 0, 'start_y' => 1),
				array('id' => 5, 'name' => "11А", 'r' => 0, 'g' => 0, 'b' => 0, 'start_x' => 2, 'start_y' => 1),
				array('id' => 6, 'name' => "11Б", 'r' => 0, 'g' => 0, 'b' => 0, 'start_x' => 0, 'start_y' => 2),
				array('id' => 7, 'name' => "11В", 'r' => 0, 'g' => 0, 'b' => 0, 'start_x' => 1, 'start_y' => 2),
				array('id' => 8, 'name' => "11Г", 'r' => 0, 'g' => 0, 'b' => 0, 'start_x' => 2, 'start_y' => 2)
			);

			//DB connection
			$this->database = new mysqli(HOST, MYSQL_USER, MYSQL_PASS) or die("Нет соединения с MySQL сервером.");
			$this->query("CREATE DATABASE IF NOT EXISTS ".DATABASE) or die("Не получилось создать базу данных.");
			$this->database->select_db(DATABASE);

			//Tables creation
			create_players_table($this);
			create_teams_table($teams, $this);
			create_map_table($teams, $this);
		}


		/*
		protected function query($query)
		{
			return $this->database->query($query);
		}
		*/

		//For debuging!!!
		public function query($query)
		{
			$result = $this->database->query($query);
			return $result;
		}

		public function delete_db()
		{
			return $this->query("DROP DATABASE sw");
		}
	}
?>