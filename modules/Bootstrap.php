<?php
	class Bootstrap
	{
		public function __construct()
		{
			//Parse
			$url = $_GET["url"];
			$url = rtrim($url, '/');
			$url = explode('/', $url);

			if (empty($url[0]))
				$url[0] = "main";
			$file = "controllers/".$url[0].".ctrl.php";

			//Require
			require_once("modules/Controller.php");

			if ($url[0] == "httperror") {
				require("controllers/httperror.ctrl.php");
				$controller = new HttpError(403);
				return false;
			} else if (!file_exists($file)) {
				require("controllers/httperror.ctrl.php");
				$controller = new HttpError(404);
				return false;
			} else
				require($file);
			
			//Init
			$controller = new $url[0];
			
			if (isset($url[2]))
				$controller->$url[1]($url[2]);
			else if (isset($url[1]))
				$controller->$url[1]();
		}
		
		public function load_components($path)
		{
			//Prevent outputing while loading
			ob_start();
			//Scan for libraries
			$libs = scandir($path);

			foreach ($libs as $lib) {
				if ($this->str_ends_with($lib, ".php"))
					require_once($path."/".$lib);
			}
				
			ob_end_clean();
		}
		
		//Ends with function
		private function str_ends_with($haystack, $needle)
		{
			$length = strlen($needle);
			return $length === 0 || (substr($haystack, -$length) === $needle);
		}
	}
?>