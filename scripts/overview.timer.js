/*
**
**  Fake timer script.
**
*/
var TimeLeft = 300;

/*On page loaded*/
function initializeTimer()
{
	setInterval(function() {
		let minutes = Math.floor(TimeLeft / 60);
		let seconds = TimeLeft % 60 + "";
		if (seconds.length <= 1)
			seconds = "0" + seconds;
		
		$(".timer").text(minutes + ":" + seconds);		
		TimeLeft--;
	}, 1000);
}