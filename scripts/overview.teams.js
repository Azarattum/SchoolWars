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
		let teamColor = team.color.toString();
		let teamName = team.name;
		let userCount = UsersCountInTeams[teamId];
		let teamTerritory = 0; //может, сразу расчитывать кол-во территории перед этим?

		$(".teams-top").append(`
			<div id="team-`+teamId+`" class="team-place" style="background-color:`+teamColor+`;">
				<div class="team-name ui-text">`+teamName+`</div>
				<div class="team-score ui-text">`+teamTerritory+`</div>
			</div>
		`);
		
		$(".teams-population-data").append(`
			<div id="population-`+teamId+`" class="team-name ui-text" style="color:`+teamColor+`;">`+teamName+`:<span class="team-population">`+userCount+`</span></div>
		`);
	}

	createInlineSVGs();
	countUsersInTeams(); //auto-update users count
	calcTeamsTerritory(); //update teams territory count (next requests from general.map.js)
	$(window).resize(function(){
		//Wait for transition ended
		setTimeout(sortTeamsByTerritoryCount, 400);
	});
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
				$("#population-"+teamId+">.team-population").text( UsersCountInTeams[teamId] );
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
	$("#team-"+teamId+">.team-score").text(territoryCount);
}

function createInlineSVGs()
{
	//Replace all SVG images with inline SVG
	$("img.svg").each(function(){
		let img = $(this);
		let imgID = img.attr("id");
		let imgClass = img.attr("class");
		let imgStyle = img.attr("style");
		let imgURL = img.css("background-image").replace("url(", "").replace(")", "").replace(new RegExp("\"", "g"), "");

		$.get(imgURL, function(data) {
			// Get the SVG tag, ignore the rest
			let svg = $(data).find("svg");

			// Add replaced image's ID to the new SVG
			if (typeof imgID !== "undefined") {
				svg = svg.attr("id", imgID);
			}
			// Add replaced image's classes to the new SVG
			if (typeof imgClass !== "undefined") {
				svg = svg.attr("class", imgClass+" replaced-svg");
			}
			// Add styles to the new SVG
			if (typeof imgStyle !== "undefined") {
				svg = svg.attr("style", imgStyle);
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			svg = svg.removeAttr("xmlns:a");

			// Check if the viewport is set, if the viewport is not set the SVG wont"t scale.
			if (!svg.attr("viewBox") && svg.attr("height") && svg.attr("width")) {
				svg.attr("viewBox", "0 0 " + svg.attr("height") + " " + svg.attr("width"))
			}

			svg[0].style.backgroundImage = "none";
			
			// Replace image with new SVG
			img.replaceWith(svg);
			
			sortTeamsByTerritoryCount();
		}, "xml");
	});
}

function sortTeamsByTerritoryCount()
{
	let teamsPlace = [];

	for (let teamId in TeamsTerritoryCount) {
		let territoryCount = TeamsTerritoryCount[teamId];
		teamsPlace.push( {"id": teamId, "territoryCount": territoryCount, "color": TeamsData[teamId].color} );
	}

	teamsPlace.sort(function(a, b) {return b.territoryCount - a.territoryCount});

	for (let i = 0; i < teamsPlace.length; i++) {
		let place = i;
		let teamId = teamsPlace[i].id;

		$("#team-"+teamId).css("top", place * $(".teams-top").height() / teamsPlace.length + "px");
	}
	
	$(".teams-top").css("right", "0px");
	$(".top-icon").css("right", "32px");
	$(".crown-gem").css("fill", teamsPlace[0].color.toString());
}