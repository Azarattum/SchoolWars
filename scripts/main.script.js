/*
**
**  Main page initialize script file.
**
*/

/*On page loaded*/
function main()
{
	setScript("/modules/API.php");

	transformTeamsColor();

	//UserData - инфа о юзере (id, team_id)
	//TeamsData - инфа всех команд ([id1, id2...])
	//MapData - инфа всех клеток карты ([id0, id1...])
	console.log(UserData);
	console.log(TeamsData);
	console.log(MapData);

	intializeTabs();
	initializeMap();

	if (UserData.teamId)
		renderUserData();
	else
		showTeams();
	

	setTimeout(function() {
		var newTeamId = 5;
		changeTeam(newTeamId);
	}, 3000);
}

function intializeTabs()
{
	var swiper = new Swiper(".swiper-container");
	$(".map-screen-item").bind("touchstart click", function() {swiper.slideTo(0)});
	$(".profile-screen-item").bind("touchstart click", function() {swiper.slideTo(1)});
	$(".swiper-container").css("opacity", "1");
}

function transformTeamsColor()
{
	for (var teamId in TeamsData) {
		var team = TeamsData[teamId];
		team.color = new Color(team.color.r, team.color.g, team.color.b);
	}
}

function showTeams()
{
	console.log("Выбери команду, бомж");

	//создание/показ списка команд

	//по нажатию на команду changeTeam(id команды)
	//при положительном callback'е, удаление/скрытие списка

	//по нажатию все списка, он удаляется/скрывается, если игрок состояит в тиме (UserData.teamId)
}

function changeTeam(newTeamId)
{
	if (newTeamId == UserData.teamId)
		return true;

	request("change_team", [newTeamId], function(data) {
		if (data) {
			UserData['teamId'] = newTeamId;
			renderUserData();
		}

		return data;
	});
	
}

function renderUserData()
{
	var userTeam = TeamsData[UserData.teamId];

	$(".ui").animate({opacity: "1"}, 500);

	$(".team-name").text("Класс: " + userTeam.name);
	$(".user-id").text("#" + UserData.id);

	let buttonColor = userTeam.color;
	$(".capture-button").css("border-color", buttonColor.toString());
	buttonColor.A = 0.6;
	$(".capture-button").css("background-color", buttonColor.toString());
}