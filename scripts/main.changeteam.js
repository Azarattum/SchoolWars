/*
**
**  Team changing script file.
**
*/

function initializeTeamchanger()
{
	for (let teamId in TeamsData) {
		let teamName = TeamsData[teamId].name;
		$(".teams-holder").append("<button id=\""+teamId+"\" class=\"change-team ui-text\">"+teamName+"</button>");
	}
	colorButtons();

	$(".change-team-button").click(function()
	{
		if ($(".change-team").css("opacity") > 0 && UserData.teamId != undefined)
			hideAvailableTeams();
		else if ($(".change-team").css("opacity") == 0)
			showAvailableTeams();
	});
	
	$(".change-team-button").on("touchstart", function() {
		if ($(".change-team").css("opacity") == 0)
			$(".teams-holder").css("height", "32px");
	});
 	$(".change-team-button").on("touchend", function() {
		if ($(".change-team").css("opacity") == 0)
			$(".teams-holder").css("height", "16px");
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
	$(".teams-holder").css("height", "calc(100% - 160px * 2 - 8vh + 32px)");
	$(".change-team").css({"flex-grow": "1", "opacity": "1", "height": "auto", "pointer-events": "auto"});
	$("#" + UserData["teamId"]).css({"flex-grow": "0", "height": "0px"});
}

function hideAvailableTeams()
{
	$(".change-team").css({"opacity": "0", "pointer-events": "none"});
	$(".teams-holder").css("height", "16px");
}

function colorButtons()
{
	for (let i in TeamsData) {
		let buttonColor = TeamsData[i].color;

		$("#" + i).text(TeamsData[i].name);
		$("#" + i).css("border-color", buttonColor.toString());
		buttonColor.A = 0.6;
		$("#" + i).css("background-color", buttonColor.toString());
	}
}

function changeTeam(newTeamId)
{
	if (newTeamId == UserData.teamId)
		return true;

	$(".selected-team,.team-name").text("Меняем класс...");
	$(".change-team-button").css("background-color", "rgb(255, 255, 250)");
	$(".points").css("color", "rgb(255, 255, 250)");
	$(".change-team").css({"flex-grow": "1", "height": "auto"});
	$("#" + newTeamId).css({"flex-grow": "0", "height": "0px"});
	
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
		else
			$("#" + newTeamId).css({"flex-grow": "1", "height": "auto"});

		return data;
	});
}