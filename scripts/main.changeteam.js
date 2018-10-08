/*
**
**  Team changing script file.
**
*/

var IsChanging = false;

function initializeTeamchanger()
{
	for (let teamId in TeamsData) {
		let teamName = TeamsData[teamId].name;
		
		let teamButton = "<button id=\""+teamId+"\" class=\"change-team\">";
		teamButton += "<span class=\"change-team-name\">"+teamName+"</span>";
		teamButton += "<span class=\"change-team-count\">...</span>";
		teamButton += "<img class=\"svg change-team-icon image-avatar\"></img>";
		teamButton += "</button>";
		
		$(".teams-holder").append(teamButton);
	}

	initializeTeamChangeEvents();
	writeUsersCountInTeams();

	countUsersInTeams();
}

function initializeTeamChangeEvents()
{
	$(".change-team-button").click(function()
	{
		if ($(".change-team").css("opacity") > 0 && UserData.teamId != undefined)
			hideAvailableTeams();
		else if ($(".change-team").css("opacity") == 0 && !IsChanging)
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
		}, 300);
	}, 600);
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
		$("#"+i+">svg>path").css("fill", buttonColor.toString());
		$("#"+i+">.change-team-count").css("color", buttonColor.toString());
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
				
				$("#"+currentTeamId +">.change-team-count").text( UsersCountInTeams[currentTeamId] );
			}

			if (UserData != undefined && UserData.teamId != undefined)
				calcPointsToCapture();
		}

		setTimeout(function() {
			countUsersInTeams();
		}, 2000);
	});
}

function writeUsersCountInTeams()
{
	for (let teamId in UsersCountInTeams) {
		let userCount = +UsersCountInTeams[teamId];
		$("#"+teamId +">.change-team-count").text(userCount);
	}
}

function changeTeam(newTeamId)
{
	if (newTeamId == UserData.teamId)
		return true;

	$(".selected-team,.team-name").text("Меняем класс...");
	IsChanging = true;

	$(".change-team-button").css("background-color", "rgb(255, 255, 250)");
	$(".point-mark").css("fill", "rgb(255, 255, 250)");
	$(".cells-mark").css("fill", "rgb(255, 255, 250)");
	$(".points").css("color", "rgb(255, 255, 250)");

	$(".change-team").css({"flex-grow": "1", "height": "auto"});
	$("#" + newTeamId).css({"flex-grow": "0", "height": "0px"});
	
	request("change_team", [newTeamId], function(data) {
		if (data) {
			UserData.teamId = newTeamId;
			showCapturePossibility();
		} else {
			$("#"+newTeamId).css({"flex-grow": "1", "height": "auto"});
		}

		renderUserData();
		IsChanging = false;
		
		return data;
	});
}