<?php
	class Controller
	{
		public $HTML_DIRECTORY = "views";
		public $CSS_DIRECTORY = "views";
		public $JS_DIRECTORY = "scripts";
		
		public function __construct()
		{
			//Base controller constuctor
		}
			
		protected function load_page()
		{
			/*Element loading functions*/
			function load_html($file_name, $class)
			{
				$file_path = $class->HTML_DIRECTORY."/".$file_name;

				if (file_exists($file_path))
					include($file_path);
			}
			
			function load_css($file_name, $class)
			{
				$file_path = $class->CSS_DIRECTORY."/".$file_name;

				if (file_exists($file_path))
					echo "<link rel=\"stylesheet\" href=\"".$file_path."\" type=\"text/css\">";
			}
			
			function load_js($file_name, $class)
			{
				$file_path = $class->JS_DIRECTORY."/".$file_name;

				if (file_exists($file_path))
					echo "<script src=\"".$file_path."\" type=\"text/javascript\"></script>";
			}
			
			/*Load javascript libraries*/
			$files = scandir("libs");

			foreach ($files as $file) {
				if (preg_match("/.+[.]js/", $file))
					echo "<script src=\"libs/".$file."\" type=\"text/javascript\"></script>";
			}
			
			/*Load page data*/
			$page = strtolower(get_class($this));
			//Scan all files
			$files = array_unique(array_merge(
				scandir($this->HTML_DIRECTORY),
				scandir($this->CSS_DIRECTORY),
				scandir($this->JS_DIRECTORY))
			);
				
			//Load only files from this page
			foreach ($files as $file) {
				$matches = array();
				
				if (preg_match("/(".$page."|^)[.]\S+[.](html|css|js)/", $file, $matches))
					call_user_func("load_".$matches[2], $file, $this);
			}
		}		
	}
?>