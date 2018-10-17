/*
**
**  This script file is for cells capture.
**
*/

var PointsToCapture = null;
var СapturedCells = [];


function initializeCapture()
{
	calcPointsToCapture();

	$(".capture-button").click(function(event) {
		if (PointsToCapture) {
			if (Points - PointsToCapture >= 0) {
				if (Field.SelectedCell || Field.SelectedCell === 0)
					captureCell(+Field.SelectedCell);
			}
		}

		event.stopPropagation();
	});
	
	$(".capture-screen").on("touchstart", function (e) {
		event.stopPropagation();
	});
}

/*TEMP*/
function calcPointsToCapture()
{
	if (!UserData.teamId)
		return false;

	let userCount = UsersCountInTeams[UserData.teamId];
	PointsToCapture = 4 + userCount;

	$(".points").text(Points+"/"+PointsToCapture);
	$(".cost").text(PointsToCapture);

	writeCapturePossibility();
}

function writeCapturePossibility()
{
	if (Points >= PointsToCapture) {
		$(".capture-button").text("ЗАХВАТИТЬ");
		$(".capture-screen").css("filter", "saturate(100%)");
	} else {
		$(".capture-button").text("НУЖНО:");
		$(".capture-screen").css("filter", "saturate(0%)");
	}
}

function showCapturePossibility()
{
	if ( checkСellForCapture(Field.SelectedCell) ) {
		$(".capture-screen").css("transform", "translateY(-100%)");
	} else
		$(".capture-screen").css("transform", "translateY(0)");
}

function captureCell(id)
{
	//Checking
	if (!checkСellForCapture(id) )
		return false;

	if (Points - PointsToCapture < 0)
		return false;

	let cellHolder = MapData[id].holder;

	Field.Select();

	$(".capture-screen").css("transform", "translateY(0)");

	Points -= PointsToCapture;
	$(".points").text(Points+"/"+PointsToCapture);
	$.cookie("points", Points);

	writeCapturePossibility();

	СapturedCells.push(id);

	//Capturing
	request("capture_cell", [id], function(data) {
		СapturedCells.splice(СapturedCells.indexOf(id), 1);

		if (!data) {
			MapData[id]['holder'] = cellHolder;

			Points += PointsToCapture;
			$.cookie("points", Points);
			writeCapturePossibility();

			Field.ParseCells(MapData, TeamsData);
			Field.Render();
		}
	});

	let team = UserData.teamId;
	MapData[id]["holder"] = team;

	Field.ParseCells(MapData, TeamsData);
	Field.Render();
}

function checkСellForCapture(id)
{
	let cell = MapData[id];

	if (!cell)
		return false;

	let cellHolder = cell.holder;

	if (cellHolder < 0)
		return false;

	if (cellHolder == UserData.teamId)
		return false;

	if ( !checkNeighborCells(id) )
		return false;

	return true;
}

function checkNeighborCells(cellId)
{
	let cellX = MapData[cellId].coords.x;
	let cellY = MapData[cellId].coords.y;
	let team = UserData.teamId;

	if (cellY % 2 == 0) {
		for (let id in MapData) {
			let cell = MapData[id];
			let x = cell.coords.x;
			let y = cell.coords.y;
			let holder = cell.holder;

			if (jQuery.inArray(+id, СapturedCells) !== -1)
				holder = UserData.teamId;

			if (
				(x == cellX - 1) && (y == cellY - 1)
				|| (x == cellX) && (y == cellY - 1)
				|| (x == cellX - 1) && (y == cellY)
				|| (x == cellX + 1) && (y == cellY)
				|| (x == cellX - 1) && (y == cellY + 1)
				|| (x == cellX) && (y == cellY + 1)
			) {
				if (team == Math.abs(holder)) {
					return true;
				}
			}
		}
	} else {
		for (let id in MapData) {
			let cell = MapData[id];
			let x = cell.coords.x;
			let y = cell.coords.y;
			let holder = cell.holder;

			if (
				(x == cellX) && (y == cellY - 1)
				|| (x == cellX + 1) && (y == cellY - 1)
				|| (x == cellX - 1) && (y == cellY)
				|| (x == cellX + 1) && (y == cellY)
				|| (x == cellX) && (y == cellY + 1)
				|| (x == cellX + 1) && (y == cellY + 1)
			) {
				if (team == Math.abs(holder))
					return true;
			}
		}
	}

	return false;
}