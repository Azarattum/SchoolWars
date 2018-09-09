<?php
	class Error extends Controller
	{
		public function __construct($code)
		{
			//Error controller constructor
			switch($code) {
				case 404: echo "Error ".$code."! (Not found)"; break;
				case 403: echo "Error ".$code."! (Forbidden)"; break;
			}
		}
	}
?>