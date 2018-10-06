/*
**
**  Team changing script file.
**
*/

function initializeTeams()
{
	transformTeamsColor();
	transformUsersCountInTeams();

	//ДОБАВЛЕНИЕ ЭЛЕМЕНТОВ
	/*for (let teamId in TeamsData) {
		let teamName = TeamsData[teamId].name;
		$(".teams-holder").append("<button id=\""+teamId+"\" class=\"change-team ui-text\">"+teamName+"</button>");
	}*/

	countUsersInTeams(); //auto-update users count
	calcTeamsTerritory(); //update teams territory count (next requests from general.map.js)
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

			//ОТОБРАЖЕНИЕ КОЛ-ВА ИГРОКОВ (циклом по командам -> .text() у элементов)
		}

		window.setTimeout(function() {
			countUsersInTeams();
		}, 2000);
	});
}

function calcTeamsTerritory()
{
	for (let teamId in TeamsData)
		calcTeamTerritory(teamId);
}

function calcTeamTerritory(teamId)
{
	console.log(TeamsData[teamId]);

	//РАСЧЁТ КОЛ-ВА ТЕРРИТОРИИ
	//ОТОБРАЖЕНИЕ (.text() у элемента)
}