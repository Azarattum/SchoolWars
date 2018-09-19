/*
**
**  Main page initialize script file.
**
*/

/*On page loaded*/
function main()
{
	setScript("/modules/API.php");

	intializeTabs();
	initializeMap();
	
	console.log(UserData);


	var newTeamId = 2;
	changeTeam(newTeamId);
}

function intializeTabs()
{
	var swiper = new Swiper(".swiper-container");
	$(".map-screen-item").bind("touchstart click", function() {swiper.slideTo(0)});
	$(".profile-screen-item").bind("touchstart click", function() {swiper.slideTo(1)});
	$(".swiper-container").css("opacity", "1");
}

function changeTeam(newTeamId)
{
	request("change_team", [newTeamId], function(data) {
		//Проверки
		//...

		if (data)
			UserData['team'] = JSON.parse(data);

		//Обработать данные
		//...

		console.log(UserData);
	});
}