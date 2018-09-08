<?php
	class Error extends Controller
	{
		public function __construct($code)
		{
			//Error controller constructor
			echo "Error ".$code."!";
		}
	}
?>