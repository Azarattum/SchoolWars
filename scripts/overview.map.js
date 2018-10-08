/*
**
**  This script file is for canvas ctx drawing.
**
*/

//temp
var HexagonSize = 48;
var OffsetX = 72;
var OffsetY = 72;

var BackgroundCalibaration = {size: 0.7, x: 0, y: -50};

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
	//расчёт HexagonSize и OffsetX/Y (что-то похожее на авто-фокус у клиента)
	//чтобы на экране была отрисована вся карта
	
	drawBackground(BackCtx, OffsetX, OffsetY, HexagonSize);
	drawMap(Ctx, OffsetX, OffsetY, HexagonSize);
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
		initializeBackCanvas();
		drawBackground(BackCtx, OffsetX, OffsetY, HexagonSize);

		initializeCanvas();
		drawMap(Ctx, OffsetX, OffsetY, HexagonSize);
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
				calcTeamsTerritory(); //update teams territory count
				drawMap(Ctx, OffsetX, OffsetY, HexagonSize);
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
	
	var w = Math.sqrt(3) * (hexagonSize + 3);
	var h = 2 * (hexagonSize + 3);
	
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
		let ry = y * h * 3 / 4 + OffsetY;

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
	ctx.lineWidth = isSpawn ? 6 : 3;
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