<?php
	class Bootstrap
	{
		public function __construct()
		{
			//Parse
			$url = $_GET["url"];
			$url = rtrim($url, '/');
			$url = explode('/', $url);
			$file = "controllers".$url[0].".ctrl.php";
			
			//Require
			require_once("libs/Controller.php");
			if (file_exists($file))
				require($file);
			else
			{
				require("controllers/error.ctrl.php");
				$controller = new Error(404);
				return false;
			}
			
			//Init
			$controller = new $url[0];
			if (isset($url[2]))
				$controller->$url[1]($url[2]);
			else if (isset($url[1]))
				$controller->$url[1]();
		}
		
		public function load_libraries($path)
		{
			//Ends with function
			function str_ends_with($haystack, $needle)
			{
				$length = strlen($needle);
				return $length === 0 || (substr($haystack, -$length) === $needle);
			}
			
			//Prevent die output
			function on_die()
			{
				ob_end_clean();
			}
			register_shutdown_function("on_die");
			ob_start();
			
			//Scan for libraries
			$libs = scandir($path);
			foreach ($libs as $lib)
			{
				if (str_ends_with($lib, ".php"))
					require_once($lib);
			}
			
			ob_end_clean();
		}
	}
?>