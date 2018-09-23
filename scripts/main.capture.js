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
		if (Points - PointsToCapture >= 0) {
			//Cell id
			let id = getCellId(HighlightedX, HighlightedY);

			if (!id && id !== 0)
				return false;

			captureCell(id);
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
	PointsToCapture = 42 + userCount*2;

	$(".points").text(Points+"/"+PointsToCapture);
	$(".cost").text(PointsToCapture);
}

function getCellId(cell_x, cell_y)
{
	for (let id in MapData) {
		let coords = MapData[id].coords;
		let x = coords.x;
		let y = coords.y;

		if (cell_x === x && cell_y === y)
			return +id;
	}

	return false;
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

function captureCell(id)
{
	//Checking
	let cell = MapData[id];

	if (!cell)
		return false;

	let cellHolder = cell.holder;

	if (cellHolder < 0 || cellHolder == UserData.teamId)
		return false;

	if ( !checkNeighborCells(id) )
		return false;

	if (Points - PointsToCapture < 0)
		return false;

	HighlightedX = null;
	HighlightedY = null;

	Points -= PointsToCapture;
	$(".points").text(Points+"/"+PointsToCapture);

	СapturedCells.push(id);

	//Capturing
	request("capture_cell", [id], function(data) {
		СapturedCells.splice(СapturedCells.indexOf(id), 1);

		if (!data) {
			MapData[id]['holder'] = cellHolder;

			let canvas = document.getElementById("map");
			let height = canvas.height = $("#map").height();
			let width = canvas.width = $("#map").width();
			let ctx = canvas.getContext("2d");

			drawMap(ctx, MapData, OffsetX, OffsetY, HexagonSize);
		}
	});

	let team = UserData.teamId;
	MapData[id]['holder'] = team;

	let canvas = document.getElementById("map");
	let height = canvas.height = $("#map").height();
	let width = canvas.width = $("#map").width();
	let ctx = canvas.getContext("2d");

	drawMap(ctx, MapData, OffsetX, OffsetY, HexagonSize);
}