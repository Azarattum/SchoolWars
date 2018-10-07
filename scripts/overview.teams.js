/*
**
**  Team changing script file.
**
*/

function initializeTeams()
{
	transformTeamsColor();
	transformUsersCountInTeams();

	for (let teamId in TeamsData) {
		let place = teamId; //может, сразу расчитывать место перед этим?

		let team = TeamsData[teamId];
		let teamName = team.name;
		let userCount = UsersCountInTeams[teamId];
		let teamTerritory = 0; //может, сразу расчитывать кол-во территории перед этим?

		$(".teams-data").append(`
			<div class="team-data" id="team-`+teamId+`">
				<div class="team-place">#`+teamId+`</div>
				<div class="team-name">`+teamName+`</div>
				<div class="team-users">`+userCount+`</div>
				<div class="team-territory">`+teamTerritory+`</div>
			</div>
		`);
	}

	countUsersInTeams(); //auto-update users count
	calcTeamsTerritory(); //update teams territory count (next requests from general.map.js)
}

function transformUsersCountInTeams()
{
	for (let teamId in TeamsData) {
		if ( !UsersCountInTeams[teamId] )
			UsersCountInTeams[teamId] = 0;
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
	request("count_users_in_teams", function(data) {
		if (data && JSON.parse(data)) {
			data = JSON.parse(data);

			for (let currentTeamId in UsersCountInTeams) {
				let userCount = +data[currentTeamId];

				if (userCount)
					UsersCountInTeams[currentTeamId] = userCount;
				else
					UsersCountInTeams[currentTeamId] = 0;
			}

			for (let teamId in TeamsData)
				$("#team-"+teamId+">.team-users").text( UsersCountInTeams[teamId] );
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

	sortTeamsByTerritoryCount();
}

function calcTeamTerritory(teamId)
{
	let territoryCount = 0;

	for (let cellId in MapData) {
		let cellHolder = Math.abs( +MapData[cellId].holder );

		if (cellHolder === +teamId)
			territoryCount += MapData[cellId].value;
	}

	TeamsTerritoryCount[teamId] = territoryCount;
	$("#team-"+teamId+">.team-territory").text(territoryCount);
}

function sortTeamsByTerritoryCount()
{
	let teamsPlace = [];

	for (let teamId in TeamsTerritoryCount) {
		let territoryCount = TeamsTerritoryCount[teamId];
		teamsPlace.push( {'id': teamId, 'territoryCount': territoryCount} );
	}

	teamsPlace.sort(function(a, b) {return b.territoryCount - a.territoryCount});

	for (let i = 0; i < teamsPlace.length; i++) {
		let place = i + 1;
		let teamId = teamsPlace[i].id;

		$("#team-"+teamId+">.team-place").text("#"+place);
		$("#team-"+teamId).css("top", place * 100+"%");
	}
}