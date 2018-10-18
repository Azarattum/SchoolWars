/*
**
**  Main page initialize script file.
**
*/

//UserData - инфа о юзере (id, team_id)
//TeamsData - инфа всех команд ([id1, id2...])
//UsersCountInTeams - инфа о кол-ве игроков в командах ([teamId: count, ...])
//MapData - инфа всех клеток карты ([id0, id1...])
var Swiper;
var GameStatus = true;

if (!UsersCountInTeams)
	var UsersCountInTeams = {};

//Disabling excess functions
//document.oncontextmenu = function() {return false};
document.ondragstart = function() {return false};
var ColorMap = [];

/*On page loaded*/
function main()
{
	setScript("modules/API.php");

	if ($.cookie("points"))
		Points = +$.cookie("points");
	
	transformTeamsColor();
	transformUsersCountInTeams();

	console.log(UserData);
	console.log(TeamsData);
	console.log(UsersCountInTeams);
	console.log(MapData);

	intializeTabs();
	initializeCapture();
	initializeFarm();
	initializeTeamchanger();
	getGameStatus();

	renderUserData();

	if (!UserData.teamId)
		showTeams();
	
	createInlineSVGs();
	
	//Disable zooming
	$(window).on("touchmove", function (e) {
		if (e.touches.length > 1) 
			e.preventDefault();
	});
	
	initializeMap();
}

function intializeTabs()
{
	Swiper = new Swiper(".swiper-container");
	Swiper.on("slideChange", function() {
		$(".tab-icon").css("filter", "saturate(0)");
		$(".tab-icon").css("opacity", "0.8");
		$(".tab-label").css("color", "rgb(128, 128, 128)");
		$($(".tab-icon")[Swiper.realIndex]).css("filter", "none");
		$($(".tab-icon")[Swiper.realIndex]).css("opacity", "1");
		$($(".tab-label")[Swiper.realIndex]).css("color", "rgb(255, 148, 6)");
	});
	$(".map-screen-item").bind("touchstart click", function() {Swiper.slideTo(0)});
	$(".profile-screen-item").bind("touchstart click", function() {Swiper.slideTo(1)});
	$(".swiper-container").css("opacity", "1");
	$($(".tab-icon")[0]).css("filter", "none");
	$($(".tab-icon")[0]).css("opacity", "1");
	$($(".tab-label")[0]).css("color", "rgb(255, 148, 6)");
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
	ColorMap[0] = new Color(255, 255, 255);
	for (let teamId in TeamsData) {
		let team = TeamsData[teamId];
		team.color = new Color(team.color.r, team.color.g, team.color.b);
		ColorMap[teamId] = team.color;
	}
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

			// Replace image with new SVG
			img.replaceWith(svg);
			
			renderUserData();
		}, "xml");
	});
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

function renderUserData()
{
	//Draw team colors	
	let userTeam = TeamsData[UserData.teamId];

	if (userTeam) {
		$(".ui").animate({opacity: "1"}, 500);

		$(".team-name").text("Класс: " + userTeam.name);
		$(".selected-team").text(userTeam.name);
		$(".user-id").text("#" + UserData.id);

		//User' team color
		let color = userTeam.color;
		$(".points").css("color", color.toString());

		$(".capture-button").css("border-color", color.toString());
		color.A = 0.6;
		$(".capture-button").css("background-color", color.toString());
		
		color.A = 1;
		$(".change-team-button").css("background-color", color.toString());
		$(".point-mark").css("fill", color.toString());
		$(".cells-mark").css("fill", color.toString());
	}
	
	colorButtons();
}