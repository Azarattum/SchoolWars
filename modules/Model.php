<?php
	class Model
	{
		public function __construct()
		{
			//Base model constuctor

			function create_players_table()
			{
				mysql_query("CREATE TABLE IF NOT EXISTS sw_players(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, team TINYINT, clicks_count INT)") or die("Не получилось создать таблицу игроков.");
			}

			function create_teams_table($teams)
			{
				mysql_query("CREATE TABLE IF NOT EXISTS sw_teams(id INT NOT NULL PRIMARY KEY, name VARCHAR(16) NOT NULL, color VARCHAR(21), start_x TINYINT, start_y TINYINT)") or die("Не получилось создать таблицу команд.");

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
				$result = mysql_query($query);
			}

			function create_map_table($teams)
			{
				mysql_query("CREATE TABLE IF NOT EXISTS sw_map(x SMALLINT NOT NULL, y SMALLINT NOT NULL, value TINYINT NOT NULL)") or die("Не получилось создать таблицу клеток карты.");

				$cells = array(
					array('x' => 0, 'y' => 0, 'value' => 0),
					array('x' => 1, 'y' => 0, 'value' => 0),
					array('x' => 2, 'y' => 0, 'value' => 0),
					array('x' => 0, 'y' => 1, 'value' => 0),
					array('x' => 1, 'y' => 1, 'value' => 0),
					array('x' => 2, 'y' => 1, 'value' => 0),
					array('x' => 0, 'y' => 2, 'value' => 0),
					array('x' => 1, 'y' => 2, 'value' => 0),
					array('x' => 2, 'y' => 2, 'value' => 0)
				);

				//Building query
				$cell_count = count($cells);
				$query = "INSERT IGNORE INTO sw_map";

				for ($i = 0; $i < $cell_count; $i++) {
					$cell = $cells[$i];
					$x = $cell['x'];
					$y = $cell['y'];
					$value = $cell['value'];

					$query .= " SELECT \"$x\" AS x, \"$y\" AS y, \"$value\" AS value UNION ALL";
				}

				$query = rtrim($query, " UNION ALL");

				$teams_count = count($teams);

				for ($i = 0; $i < $teams_count; $i++) {
					$start_x = $teams[$i]['start_x'];
					$start_y = $teams[$i]['start_y'];
					$team_id = $teams[$i]['id'];

					$query = str_replace("\"".$start_x."\" AS x, \"".$start_y."\" AS y, \"0\" AS value",
						"\"".$start_x."\" AS x, \"".$start_y."\" AS y, \"".$team_id."\" AS value", $query);
				}

				$result = mysql_query($query);
			}
			
			define("HOST", "localhost");
			define("DATABASE", "sw");
			define("MYSQL_USER", "root");
			define("MYSQL_PASS", "");

			$teams = array(
				array('id' => 1, 'name' => "10А", 'color' => "rgb(0,0,0)", 'start_x' => 0, 'start_y' => 0),
				array('id' => 2, 'name' => "10Б", 'color' => "rgb(0,0,0)", 'start_x' => 1, 'start_y' => 0),
				array('id' => 3, 'name' => "10В", 'color' => "rgb(0,0,0)", 'start_x' => 2, 'start_y' => 0),
				array('id' => 4, 'name' => "10Г", 'color' => "rgb(0,0,0)", 'start_x' => 0, 'start_y' => 1),
				array('id' => 5, 'name' => "11А", 'color' => "rgb(0,0,0)", 'start_x' => 2, 'start_y' => 1),
				array('id' => 6, 'name' => "11Б", 'color' => "rgb(0,0,0)", 'start_x' => 0, 'start_y' => 2),
				array('id' => 7, 'name' => "11В", 'color' => "rgb(0,0,0)", 'start_x' => 1, 'start_y' => 2),
				array('id' => 8, 'name' => "11Г", 'color' => "rgb(0,0,0)", 'start_x' => 2, 'start_y' => 2)
			);

			//DB connection
			$link = mysql_connect(HOST, MYSQL_USER, MYSQL_PASS) or die("Нет соединения с MySQL сервером.");
			mysql_query("CREATE DATABASE IF NOT EXISTS ".DATABASE) or die("Не получилось создать базу данных.");
			mysql_select_db(DATABASE) or die("Нет соединения с базой данных.");

			//Tables creation
			create_players_table();
			create_teams_table($teams);
			create_map_table($teams);
		}

		//For debuging!!!
		public function delete_db()
		{
			$query = "DROP DATABASE sw";
			$result = mysql_query($query);
			
			return $result;
		}
	}
?>