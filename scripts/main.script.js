/*
**
**  Main page initialize script file.
**
*/

//UserData - инфа о юзере (id, team_id)
//TeamsData - инфа всех команд ([id1, id2...])
//UsersCountInTeams - инфа о кол-ве игроков в командах ([teamId: count, ...])
//MapData - инфа всех клеток карты ([id0, id1...])
var Swiper;

if (!UsersCountInTeams)
	var UsersCountInTeams = {};

//Disabling excess functions
//document.oncontextmenu = function() {return false};
document.ondragstart = function() {return false};


/*On page loaded*/
function main()
{
	setScript("/modules/API.php");

	transformTeamsColor();
	transformUsersCountInTeams();

	console.log(UserData);
	console.log(TeamsData);
	console.log(UsersCountInTeams);
	console.log(MapData);

	intializeTabs();
	initializeMap();
	initializeCapture();
	initializeFarm();
	initializeTeamchanger();

	if (UserData.teamId) {
		renderUserData();
		countUsersInUserTeam(UserData.teamId);
	} else
		showTeams();
}

function intializeTabs()
{
	Swiper = new Swiper(".swiper-container");
	$(".map-screen-item").bind("touchstart click", function() {Swiper.slideTo(0)});
	$(".profile-screen-item").bind("touchstart click", function() {Swiper.slideTo(1)});
	$(".swiper-container").css("opacity", "1");
}

function transformUsersCountInTeams()
{
	for (let teamId in TeamsData) {
		if ( !UsersCountInTeams[teamId] )
			UsersCountInTeams[teamId] = null;
	}
}

function transformTeamsColor()
{
	for (let teamId in TeamsData) {
		let team = TeamsData[teamId];
		team.color = new Color(team.color.r, team.color.g, team.color.b);
	}
}

function countUsersInUserTeam()
{
	teamId = UserData.teamId;

	if (!teamId)
		return false;

	request("count_users_in_team", [teamId], function(data) {
		if (data && JSON.parse(data)) {
			data = JSON.parse(data);
			let userCount = +data[teamId];

			if (userCount)
				UsersCountInTeams[teamId] = userCount;

			if (teamId === UserData.teamId)
				calcPointsToCapture();
		}

		setTimeout(function() {
			countUsersInUserTeam();
		}, 2000);
	});
}

function countUsersInTeams()
{
	request("count_users_in_team", ["all"], function(data) {
		if (data && JSON.parse(data)) {
			data = JSON.parse(data);

			for (let currentTeamId in UsersCountInTeams) {
				let userCount = +data[currentTeamId];

				if (userCount)
					UsersCountInTeams[currentTeamId] = userCount;
				else
					UsersCountInTeams[currentTeamId] = null;
			}
		}
	});
}

function renderUserData()
{
	//Draw team colors
	for (let i in TeamsData) {
		let buttonColor = TeamsData[i].color;

		$("#" + i).text(TeamsData[i].name);
		$("#" + i).css("border-color", buttonColor.toString());
		buttonColor.A = 0.6;
		$("#" + i).css("background-color", buttonColor.toString());
	}
	
	let userTeam = TeamsData[UserData.teamId];

	$(".ui").animate({opacity: "1"}, 500);

	$(".team-name").text("Класс: " + userTeam.name);
	$(".selected-team").text(userTeam.name);
	$(".user-id").text("#" + UserData.id);

	//User' team color
	let color = userTeam.color;
	$(".points").css("color", color.toString());

	$(".capture-button").css("border-color", color.toString());
	color.A = 0.6;
	$(".capture-button").css("background-color", color.toString());

	$(".capture-button").on("touchstart", function() {
		color.A = 0.8;
		$(".capture-button").css("background-color", color.toString());
		$(".capture-button").css("border", "solid 8px rgba(0, 0, 0, 0.4)");
	});

	$(".capture-button").on("touchend", function() {
		color.A = 0.6;
		$(".capture-button").css("background-color", color.toString());
		$(".capture-button").css("border", "solid 8px "+color.toString());
	});

	color.A = 0.4;
	$(".change-team-button").css("background-color", color.toString());
}