/*
**
**  This script file is for canvas ctx drawing.
**
*/

var DrawingSettings = {'hexagonSize': 48, 'offsetX': 0, 'offsetY': 0, 'margin': 32};
var BackgroundCalibaration = {'size': 1, 'x': -500, 'y': -300};

var MapEdges = {'minX': 0, 'minY': 0, 'maxX': 0, 'maxY': 0};

var Canvas;
var Height;
var Width;
var Ctx;
var BackCanvas;
var BackCtx;


function initializeMap()
{
	initializeCanvas();
	initializeBackCanvas();
	initializeEvents();

	initializeMapEdges();
	calcDrawingSettings();
	
	drawMap(Ctx, DrawingSettings.offsetX, DrawingSettings.offsetY, DrawingSettings.hexagonSize);
	//drawBackground(BackCtx, DrawingSettings.offsetX, DrawingSettings.offsetY, DrawingSettings.hexagonSize);
	updateMap();
}

function initializeCanvas()
{
	Canvas = document.getElementById("map");

	Height = Canvas.height = $("#map").height();
	Width = Canvas.width = $("#map").width();

	Ctx = Canvas.getContext("2d");
}

function initializeBackCanvas()
{
	BackCanvas = document.getElementById("map-background");

	BackCanvas.height = $("#map").height();
	BackCanvas.width = $("#map").width();

	BackCtx = BackCanvas.getContext("2d");
}

function initializeEvents()
{
	//Draw on resize
	$(window).resize(function() {
		initializeCanvas();
		initializeBackCanvas();

		calcDrawingSettings();

		drawMap(Ctx, DrawingSettings.offsetX, DrawingSettings.offsetY, DrawingSettings.hexagonSize);
		//drawBackground(BackCtx, DrawingSettings.offsetX, DrawingSettings.offsetY, DrawingSettings.hexagonSize);
	});
}

function initializeMapEdges()
{
	let minX = MapEdges.minX;
	let minY = MapEdges.minY;
	let maxX = MapEdges.maxX;
	let maxY = MapEdges.maxY;

	for (let cellId in MapData) {
		let cell = MapData[cellId];
		let x = +cell.coords.x;
		let y = +cell.coords.y;

		if (x < minX) minX = x;
		if (y < minY) minY = y;
		if (x > maxX) maxX = x;
		if (y > maxY) maxY = y;
	}

	MapEdges.minX = minX;
	MapEdges.minY = minY;
	MapEdges.maxX = maxX;
	MapEdges.maxY = maxY;
}

function calcDrawingSettings()
{
	let fieldWidth = Canvas.width - DrawingSettings.margin*2;
	let mapWidth = MapEdges.maxX - MapEdges.minX;
	// рабочая область / (кол-во клеток, учитывая сдвиги при отрисовке) / корень из 3 - контур
	let sizeX = fieldWidth / (mapWidth + 1 + 1/2) / Math.sqrt(3) - 3;

	let fieldHeight = Canvas.height - DrawingSettings.margin*2;
	let mapHeight = (MapEdges.maxY - MapEdges.minY) ;
	// рабочая область / (кол-во клеток, учитывая сдвиги при отрисовке) / 2 - контур
	let sizeY = fieldHeight / (mapHeight*3/4 + 1/2 + 1/2) / 2 - 3;

	let hexagonSize = (sizeX < sizeY) ? sizeX : sizeY;
	DrawingSettings.hexagonSize = hexagonSize;

	// половина разности ширины холста и ширины всех клеток
	DrawingSettings.offsetX = ( Canvas.width - (mapWidth + 1 + 1/2)*Math.sqrt(3)*(hexagonSize + 3) ) / 2;
	// половина разности высоты холста и высоты всех клеток
	DrawingSettings.offsetY = ( Canvas.height - (mapHeight*3/4 + 1/2 + 1/2)*2*(hexagonSize + 3) ) / 2;
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
				calcTeamsTerritory(); //update teams territory count
				drawMap(Ctx, DrawingSettings.offsetX, DrawingSettings.offsetY, DrawingSettings.hexagonSize);
			}
		}

		setTimeout(function() {
			updateMap();
		}, 300);
	});
}

function drawMap(ctx, offsetX, offsetY, hexagonSize)
{
	offsetX = (offsetX == undefined) ? 0 : offsetX;
	offsetY = (offsetY == undefined) ? 0 : offsetY;
	
	let w = Math.sqrt(3) * (hexagonSize + 3);
	let h = 2 * (hexagonSize + 3);
	
	ctx.clearRect(0, 0, $(document).width(), $(document).height());
	
	for (let cellId in MapData) {
		let cell = MapData[cellId];
		let x = cell.coords.x;
		let y = cell.coords.y;
		let holderId = cell.holder;
		let isSpawn = false;

		if (holderId < 0) {
			holderId = -holderId;
			isSpawn = true;
		}

		let color = TeamsData[holderId] ? TeamsData[holderId].color : new Color(255, 255, 255);

		let rx = x * w + (y % 2 == 1 ? w/2 : 0) + offsetX;
		let ry = y * h * 3 / 4 + offsetY;
		// чтобы при 0 оффсетах, всё отрисовывалось с координат 0;0
		rx += hexagonSize
		ry += hexagonSize;

		//Drawing
		drawHexagon(ctx, rx, ry, color, hexagonSize, isSpawn);
		color.A = 1;
		ctx.shadowBlur = 4;
		ctx.fillStyle = color.toString();
		ctx.font = (hexagonSize / 1.125) + "px monospace";
		ctx.textAlign = "center";
		ctx.fillText(cell.value, rx, ry + (hexagonSize / 3.75));
	}
}

function drawHexagon(ctx, x, y, color, hexagonSize, isSpawn)
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

	color.A = 0.3;
	ctx.shadowColor = "black";
	ctx.shadowBlur = 25;
	ctx.fillStyle = color.toString();
	ctx.fill();
	color.A = 1;
		
	ctx.shadowBlur = 0;
	ctx.lineWidth = isSpawn ? 4 : 2;
	ctx.strokeStyle = isSpawn ? "rgb(255, 255, 255)" : color.toString();
	ctx.stroke();
}

function drawBackground(ctx, offsetX, offsetY, hexagonSize)
{
	let image = document.getElementById("background");
	let w = Math.sqrt(3) * (hexagonSize + 3);
	let h = 2 * (hexagonSize + 3);
	
	ctx.clearRect(0, 0, $(document).width(), $(document).height());

	ctx.globalAlpha = 0.42; //TEMP
	//Drawing background
	ctx.drawImage(
		image,
		offsetX - w + BackgroundCalibaration.x,
		offsetY - h + BackgroundCalibaration.y,
		image.width * hexagonSize / 16 * BackgroundCalibaration.size,
		image.height * hexagonSize / 16 * BackgroundCalibaration.size
	);
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