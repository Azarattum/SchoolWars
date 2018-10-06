/*
**
**  Main page initialize script file.
**
*/

//TeamsData - инфа всех команд ([id1, id2...])
//UsersCountInTeams - инфа о кол-ве игроков в командах ([teamId: count, ...])
//MapData - инфа всех клеток карты ([id0, id1...])

if (!UsersCountInTeams)
	var UsersCountInTeams = {};

//Disabling excess functions
document.ondragstart = function() {return false};


/*On page loaded*/
function main()
{
	//КАСТЫЛЬ, КОТОРЫЙ ИСПРАВЛЮ ПОСЛЕ ФИКСА ЛИБЫ requestIt
	setScript("../modules/API.php");

	initializeTeams();
	initializeMap();

	console.log(TeamsData);
	console.log(UsersCountInTeams);
	console.log(MapData);

}