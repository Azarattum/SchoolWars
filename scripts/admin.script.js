/*
**
**  Admin page initialize script file.
**
*/

var Promter;

//Disabling excess functions
//document.oncontextmenu = function() {return false};
document.ondragstart = function() {return false};


/*On page loaded*/
function main()
{
	let check = authorize();

	if (!check) {
		$("body").html("");
		return false;
	}

	$("body").css("background-color", "white");

	Promter = new AdminPromter();
	console.log(Promter);

	initializeEvents();
}

function authorize()
{
	let check = prompt();

	if (check !== "lalka")
		return false;

	return true;
}

function initializeEvents()
{
	$(".switch-left").click(function() {
		Promter.showPreviousPhrase();
	});

	$(".switch-right").click(function() {
		Promter.showNextPhrase();
	});
}