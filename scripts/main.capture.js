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
				if (HighlightedCell)
					captureCell(HighlightedCell);
			}
		}

		event.stopPropagation();
	});
}

/*TEMP*/
function calcPointsToCapture()
{
	if (!UserData.teamId)
		return false;

	let userCount = UsersCountInTeams[UserData.teamId];
	PointsToCapture = 5 + userCount*2;

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
	if ( checkСellForCapture(HighlightedCell) ) {
		$(".capture-screen").css("transform", "translateY(-100%)");
	} else
		$(".capture-screen").css("transform", "translateY(0)");
}

function captureCell(id)
{
	//Checking
	if ( !checkСellForCapture(id) )
		return false;

	if (Points - PointsToCapture < 0)
		return false;

	let cellHolder = MapData[id].holder;

	HighlightedX = null;
	HighlightedY = null;
	HighlightedCell = null;

	$(".capture-screen").css("transform", "translateY(0)");

	Points -= PointsToCapture;
	$(".points").text(Points+"/"+PointsToCapture);

	writeCapturePossibility();

	СapturedCells.push(id);

	//Capturing
	request("capture_cell", [id], function(data) {
		СapturedCells.splice(СapturedCells.indexOf(id), 1);

		if (!data) {
			MapData[id]['holder'] = cellHolder;

			Points += PointsToCapture;
			writeCapturePossibility();

			initializeCanvas();
			drawMap(Ctx, OffsetX, OffsetY, HexagonSize);
		}
	});

	let team = UserData.teamId;
	MapData[id]['holder'] = team;

	initializeCanvas();
	drawMap(Ctx, OffsetX, OffsetY, HexagonSize);
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