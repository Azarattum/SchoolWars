/*
**
**  Team changing script file.
**
*/

function initializeTeamchanger()
{
	for (let teamId in TeamsData) {
		let teamName = TeamsData[teamId].name;
		$(".change-team-button").append("<button id=\""+teamId+"\" class=\"change-team ui-text\">"+teamName+"</button>");
	}

	$(".change-team-button").click(function()
	{
		if ($(".change-team").height() > 0 && UserData.teamId != undefined)
			hideAvailableTeams();
		else if ($(".change-team").height() == 0)
			showAvailableTeams();
	});
	
	$(".change-team").click(function()
	{
		changeTeam( parseInt($(this)[0].id) );
		hideAvailableTeams();
	});
}

function showTeams()
{
	window.setTimeout(function(){
		Swiper.slideTo(1);
		window.setTimeout(function(){
			showAvailableTeams()
		}, 150);
	}, 500);
}

function showAvailableTeams()
{
	$(".change-team").css("height", "7.1vh"); //TEMP
	$(".change-team").css("margin-top", "16px");

	for (let i in TeamsData) {
		let buttonColor = TeamsData[i].color;
		$("#" + i).text(TeamsData[i].name);
		$("#" + i).css("border", "solid 8px " + buttonColor.toString());
		buttonColor.A = 0.6;
		$("#" + i).css("background-color", buttonColor.toString());
	}

	$(".task-holder").css("filter", "blur(48px)");
}

function hideAvailableTeams()
{
	$(".change-team").css("height", "0px");
	$(".change-team").css("margin-top", "0px");
	$(".change-team").css("border", "none");
	$(".task-holder").css("filter", "none");
}

function changeTeam(newTeamId)
{
	if (newTeamId == UserData.teamId)
		return true;

	$(".selected-team,.team-name").text("Меняем класс...");

	request("change_team", [newTeamId], function(data) {
		if (data) {
			let firstTeam = false;

			if (!UserData.teamId)
				firstTeam = true;

			UserData['teamId'] = newTeamId;
			renderUserData();
			showCapturePossibility();

			if (firstTeam)
				countUsersInUserTeam(UserData.teamId);
		}

		return data;
	});
}