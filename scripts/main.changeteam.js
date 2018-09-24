/*
**
**  Team changing script file.
**
*/

function initializeTeamchanger()
{
	$(".change-team-button").click(function()
	{
		if ($(".change-team").height() > 0 && UserData.teamId != undefined)
			hideAvailableTeams();
		else if ($(".change-team").height() == 0)
			showAvailableTeams();
	});
	
	$(".change-team").click(function()
	{
		changeTeam(parseInt($(this)[0].id));
		hideAvailableTeams();
	});
}

function showAvailableTeams()
{
	$(".change-team").css("height", "8vh");
	$(".change-team").css("margin-top", "16px");
	for (let i = 1; i < 9; i++)
	{
		let buttonColor = TeamsData[i].color;
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