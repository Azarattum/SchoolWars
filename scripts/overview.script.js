/*
**
**  General page initialize script file.
**
*/

//TeamsData - инфа всех команд ([id1, id2...])
//UsersCountInTeams - инфа о кол-ве игроков в командах ([teamId: count, ...])
//MapData - инфа всех клеток карты ([id0, id1...])

if (!UsersCountInTeams)
	var UsersCountInTeams = {};

var TeamsTerritoryCount = {};
var GameStatus = true;

//Disabling excess functions
document.ondragstart = function() {return false};


/*On page loaded*/
function main()
{
	setScript("modules/API.php");
	window.onbeforeunload = function() {
		if ( !confirm("Нажми \"нет\"") )
			return;
	}

	initializeTeams();
	initializeMap();
	initializeTimer();

	console.log(TeamsData);
	console.log(UsersCountInTeams);
	console.log(MapData);

	getGameStatus();
}

function getGameStatus()
{
	request("get_game_status", function(data) {
		if (!data) {
			GameStatus = false;
			startEnd();
		}

		setTimeout(function() {
			if (GameStatus)
				getGameStatus();
		}, 1000);
	});
}