/*
**
**  This script file is for canvas ctx drawing.
**
*/

var HexagonSize = 64;
var OffsetX = 100;
var OffsetY = 160;
var EaseAmount = 0.4;

var BackgroundCalibaration = {size: 0.7, x: 0, y: -50};

var Cursor = {};
var DraggingTimer;

var HighlightedY = null;
var HighlightedX = null;
var HighlightedCell = null;

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
	initializeMapEvents();
	
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

function initializeMapEvents()
{
	//Draw on resize
	$(window).resize(function() {
		initializeBackCanvas();
		drawBackground(BackCtx, OffsetX, OffsetY, HexagonSize);
		
		initializeCanvas();
		drawMap(Ctx, OffsetX, OffsetY, HexagonSize);
	});

	//Draw on click
	$(".map-screen").click(function(event) {
		//ИСПОЛЬЗОВАТЬ touchstart?
		Cursor.X = event.pageX;
		Cursor.Y = event.pageY;

		let w = Math.sqrt(3) * (HexagonSize + 3);
		let h = 2 * (HexagonSize + 3);
		HighlightedY = Math.round((Cursor.Y - (OffsetY + $("canvas").offset().top)) / h / 3 * 4);
		HighlightedX = Math.round(((Cursor.X - $("#map").position().left) - (HighlightedY % 2 == 1 ? w/2 : 0) - (OffsetX + $("canvas").offset().left)) / w);

		HighlightedCell = getCellId(HighlightedX, HighlightedY);
		showCapturePossibility();

		drawMap(Ctx, OffsetX, OffsetY, HexagonSize);
	});
	
	var targetX, targetY, previousX, previousY, startOffsetX, startOffsetY;
	var isDragging;
	$(".map-wrapper").on("touchstart", function (e) {
		if (e.touches.length > 1) {
			isDragging = true;
			startOffsetX = $("canvas").offset().left;
			startOffsetY = $("canvas").offset().top;
				
			previousX = e.touches[0].clientX;
			previousY = e.touches[0].clientY;
			if (e.touches.length > 1) {
				previousX = (previousX + e.touches[1].clientX) / 2;
				previousY = (previousY + e.touches[1].clientY) / 2;
			}
			
			clearInterval(DraggingTimer);
			DraggingTimer = setInterval(function() {
				if (targetX && targetY) {
					$("canvas").offset({ 
						left: $("canvas").offset().left + EaseAmount * (targetX - $("canvas").offset().left), 
						top: $("canvas").offset().top + EaseAmount * (targetY - $("canvas").offset().top)
					});
				}
				//Stop dragging
				if (((!isDragging)
					&&(Math.abs($("canvas").offset().left - targetX) < 1)
					&&(Math.abs($("canvas").offset().top - targetY) < 1)) || Swiper.realIndex != 0) {
						$("canvas").offset({left: targetX, top: targetY});
						clearInterval(DraggingTimer);
						startOffsetX = startOffsetY = previousX = previousY = targetX = targetY = undefined;
				}
			}, 1000/30);
		}
	});
	
	$(".map-wrapper").on("touchend", function (e) {
		isDragging = false;
	});
	
	$(".map-wrapper").on("touchmove", function (e) {
		//Checking 2 fingers
		if (isDragging) {
			e.preventDefault();
			
			let x = e.touches[0].clientX;
			let y = e.touches[0].clientY;
			if (e.touches.length > 1) {
				x = (x + e.touches[1].clientX) / 2;
				y = (y + e.touches[1].clientY) / 2;
			}	
					
			targetX = startOffsetX + x - previousX;
			targetY = startOffsetY + y - previousY;	
		}
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
		let ry = y * h * 3 / 4 + offsetY;

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