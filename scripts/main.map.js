/*
**
**  This script file is for canvas ctx drawing.
**
*/

var HexagonSize = 64;
var OffsetX = 100;
var OffsetY = 160;

var BackgroundCalibaration = {size: 0.7, x: 0, y: -50};

var Cursor = {};

var HighlightedY = null;
var HighlightedX = null;
var HighlightedCell = null;


function initializeMap()
{
	let canvas = document.getElementById("map");
	let height = canvas.height = $("#map").height();
	let width = canvas.width = $("#map").width();
	let ctx = canvas.getContext("2d");

	initializeEvents();
	
	drawMap(ctx, MapData, OffsetX, OffsetY, HexagonSize);
	updateMap();
}

function initializeEvents()
{
	//Draw on resize
	$(window).resize(function() {
		let canvas = document.getElementById("map");
		let height = canvas.height = $("#map").height();
		let width = canvas.width = $("#map").width();
		let ctx = canvas.getContext("2d");

		drawMap(ctx, map, OffsetX, OffsetY, HexagonSize);
	});

	//Draw on click
	$(".map-screen").click(function(event) {
		Cursor.X = event.pageX;
		Cursor.Y = event.pageY;

		let w = Math.sqrt(3) * (HexagonSize + 3);
		let h = 2 * (HexagonSize + 3);
		HighlightedY = Math.round((Cursor.Y - OffsetY) / h / 3 * 4);
		HighlightedX = Math.round(((Cursor.X - $("#map").position().left) - (HighlightedY % 2 == 1 ? w/2 : 0) - OffsetX) / w);

		HighlightedCell = getCellId(HighlightedX, HighlightedY);

		if ((HighlightedCell || HighlightedCell == 0) && checkСellForCapture(HighlightedCell)) {
			$(".capture-screen").css("transform", "translateY(-100%)");
		} else
			$(".capture-screen").css("transform", "translateY(0)");

		let canvas = document.getElementById("map");
		let height = canvas.height = $("#map").height();
		let width = canvas.width = $("#map").width();
		let ctx = canvas.getContext("2d");

		drawMap(ctx, map, OffsetX, OffsetY, HexagonSize);
	});
}

function updateMap()
{
	request("get_cells_holders", function(data) {
		if (data) {
			let cellsHolders = JSON.parse(data);
			let changed = false;

			for (let cellId in cellsHolders) {
				let cellHolder = +cellsHolders[cellId];

				if (MapData[cellId].holder !== cellHolder) {
					MapData[cellId].holder = cellHolder;
					changed = true;
				}
			}

			if (changed) {
				let canvas = document.getElementById("map");
				let height = canvas.height = $("#map").height();
				let width = canvas.width = $("#map").width();
				let ctx = canvas.getContext("2d");

				drawMap(ctx, MapData, OffsetX, OffsetY, HexagonSize);
			}
		}

		setTimeout(function() {
			updateMap();
		}, 300);
	});
}

function drawMap(ctx, map, offsetX, offsetY, hexagonSize)
{
	offsetX = (offsetX == undefined) ? 0 : offsetX;
	offsetY = (offsetY == undefined) ? 0 : offsetY;
	
	var image = document.getElementById("background");
	var w = Math.sqrt(3) * (hexagonSize + 3);
	var h = 2 * (hexagonSize + 3);
	
	ctx.clearRect(0, 0, $(document).width(), $(document).height());

	//Drawing background
	/*
	ctx.drawImage(
		image, 
		offsetX - w + BackgroundCalibaration.x, 
		offsetY - h + BackgroundCalibaration.y, 
		image.width * hexagonSize / 16 * BackgroundCalibaration.size, 
		image.height * hexagonSize / 16 * BackgroundCalibaration.size
	);
	*/
	
	for (let cellId in MapData) {
		let cell = MapData[cellId];
		let x = cell.coords.x;
		let y = cell.coords.y;
		let selected = HighlightedY === y && HighlightedX === x;
		let holderId = cell.holder;
		let isSpawn = false;

		if (holderId < 0) {
			holderId = -holderId;
			isSpawn = true;
		}

		if (jQuery.inArray(+cellId, СapturedCells) !== -1)
			holderId = UserData.teamId;

		let color = TeamsData[holderId] ? TeamsData[holderId].color : new Color(255, 255, 255);
		
		let rx = x * w + (y % 2 == 1 ? w/2 : 0) + offsetX;
		let ry = y * h * 3 / 4 + OffsetY;

		//Drawing
		drawHexagon(ctx, rx, ry, color, hexagonSize, isSpawn, selected);
		color.A = 1;
		ctx.shadowBlur = 4;
		ctx.fillStyle = color.toString();
		ctx.font = (hexagonSize / 1.125) + "px monospace";
		ctx.textAlign = "center";
		ctx.fillText(cell.value, rx, ry + (hexagonSize / 3.75));
	}
}

function drawHexagon(ctx, x, y, color, hexagonSize, isSpawn, selected)
{
	ctx.beginPath();
	ctx.moveTo(x + hexagonSize * Math.cos(Math.PI / 6), y + hexagonSize * Math.sin(Math.PI / 6));

	for (let side = 0; side < 7; side++) {
		ctx.lineTo(
			x + hexagonSize * Math.cos(side * 2 * Math.PI / 6 + Math.PI / 6),
			y + hexagonSize * Math.sin(side * 2 * Math.PI / 6 + Math.PI / 6)
		);
	}
	ctx.closePath();

	color.A = selected ? 0.7 : 0.3;
	ctx.shadowColor = "black";
	ctx.shadowBlur = 25;
	ctx.fillStyle = color.toString();
	ctx.fill();
	color.A = 1;
		
	ctx.shadowBlur = 0;
	ctx.lineWidth = isSpawn ? 6 : 3;
	ctx.strokeStyle = isSpawn ? "rgb(255, 255, 255)" : color.toString();
	ctx.stroke();
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

	return null;
}