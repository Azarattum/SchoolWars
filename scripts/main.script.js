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

		UserData.team.color = new Color(UserData.team.color.r, UserData.team.color.g, UserData.team.color.b);
		
		//Обработать данные
		//...

		console.log(UserData);
		renderDataChanges();
	});
	
}

function renderDataChanges()
{
	$(".ui").css("opacity", "1");
	$(".team-name").text("Класс: " + UserData.team.name);
	$(".user-id").text("#" + UserData.id);
	let buttonColor = UserData.team.color;
	$(".capture-button").css("border-color", buttonColor.toString());
	buttonColor.A = 0.6;
	$(".capture-button").css("background-color", buttonColor.toString());
}