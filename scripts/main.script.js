/*
**
**  Main page initialize script file.
**
*/

//UserData - инфа о юзере (id, team_id)
//TeamsData - инфа всех команд ([id1, id2...])
//UsersCountInTeams - инфа о кол-ве игроков в командах ([teamId: count, ...])
//MapData - инфа всех клеток карты ([id0, id1...])

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

	if (UserData.teamId) {
		renderUserData();
		countUsersInUserTeam(UserData.teamId);
	} else
		showTeams();
}

function intializeTabs()
{
	var swiper = new Swiper(".swiper-container");
	$(".map-screen-item").bind("touchstart click", function() {swiper.slideTo(0)});
	$(".profile-screen-item").bind("touchstart click", function() {swiper.slideTo(1)});
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

function showTeams()
{
	console.log("Выбери команду, бомж");

	//открытие второй вкладки
	//создание/показ списка команд

	//запрос на получение кол-ва игроков в командах countUsersInTeam("all")

	//по нажатию на команду changeTeam(id команды)
	//при положительном callback'е, удаление/скрытие списка

	//по нажатию все списка, он удаляется/скрывается, если игрок состояит в тиме (UserData.teamId)

	setTimeout(function() {
		let newTeamId = Math.floor(Math.random() * 9) + 1;
		changeTeam(newTeamId);
	}, 3000);
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

		//console.log(UsersCountInTeams);
	});
}

function changeTeam(newTeamId)
{
	if (newTeamId == UserData.teamId)
		return true;

	request("change_team", [newTeamId], function(data) {
		if (data) {
			let firstTeam = false;

			if (!UserData.teamId)
				firstTeam = true;

			UserData['teamId'] = newTeamId;
			renderUserData();

			if (firstTeam)
				countUsersInUserTeam(UserData.teamId);
		}

		return data;
	});
}

function renderUserData()
{
	let userTeam = TeamsData[UserData.teamId];

	$(".ui").animate({opacity: "1"}, 500);

	$(".team-name").text("Класс: " + userTeam.name);
	$(".user-id").text("#" + UserData.id);

	let buttonColor = userTeam.color;
	$(".capture-button").css("border-color", buttonColor.toString());
	buttonColor.A = 0.6;
	$(".capture-button").css("background-color", buttonColor.toString());
}