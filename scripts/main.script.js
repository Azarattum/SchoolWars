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

	//UserData - инфа о юзере (id, team_id)
	//TeamsData - инфа всех команд ([id1, id2...])
	transformTeamsColor();

	console.log(UserData);
	console.log(TeamsData);

	renderUserData();
	
	//var newTeamId = 5;
	//changeTeam(newTeamId);
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

function changeTeam(newTeamId)
{
	request("change_team", [newTeamId], function(data) {
		//console.log(data);

		if (data) {
			UserData['teamId'] = newTeamId;
			renderUserData();
		}
	});
	
}

function renderUserData()
{
	var userTeam = TeamsData[UserData.teamId];
	console.log(userTeam);

	$(".ui").animate({opacity: "1"}, 500);

	$(".team-name").text("Класс: " + userTeam.name);
	$(".user-id").text("#" + UserData.id);

	let buttonColor = userTeam.color;
	$(".capture-button").css("border-color", buttonColor.toString());
	buttonColor.A = 0.6;
	$(".capture-button").css("background-color", buttonColor.toString());
}