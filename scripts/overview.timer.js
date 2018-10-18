/*
**
**  Fake timer script.
**
*/
var TimeLeft = 420;

/*On page loaded*/
function initializeTimer()
{
	setInterval(function() {
		let minutes = Math.floor(TimeLeft / 60);
		let seconds = TimeLeft % 60 + "";
		if (seconds.length <= 1)
			seconds = "0" + seconds;
		
		if (TimeLeft >= 0)
			$(".timer").text(minutes + ":" + seconds);	
		else
		{
			$(".timer").text("0:00");	
			$(".timer").css("color","rgb(240,30,20)");	
		}	
		TimeLeft--;
	}, 1000);
}