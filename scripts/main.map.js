/*
**
**  This script file is for canvas ctx drawing.
**
*/
var Field;
var ScreenSizerFactor = 0.0007;

function initializeMap()
{
	Field = new GameField(
		document.getElementById("map"), 
		document.getElementById("map-text"), 
		document.getElementById("background"),
		ColorMap);
	Field.Zoom = Math.sqrt(Math.pow($(window).width(), 2) + Math.pow($(window).height(), 2) ) * ScreenSizerFactor;
	Field.ParseCells(MapData, TeamsData);
	Field.onload = Field.Render;
	
	initializeMapEvents();
	
	updateMap();
}

function initializeMapEvents()
{
	//Redraw on resize
	$(window).resize(function() {
		Field = new GameField(
			document.getElementById("map"), 
			document.getElementById("map-text"), 
			document.getElementById("background"),
			ColorMap);
		Field.Zoom = Math.sqrt(Math.pow($(window).width(), 2) + Math.pow($(window).height(), 2) ) * ScreenSizerFactor;
		Field.ParseCells(MapData, TeamsData);
		Field.onload = Field.Render;
	});

	//Draw on click
	$(".map-wrapper").click(function (e) {
		Field.Select(e.pageX, e.pageY);
		showCapturePossibility();
	});
	
	let previousX, previousY;
	let isDragging;
	$(".map-wrapper").on("touchstart", function (e) {
		if (e.touches.length > 1) {
			isDragging = true;
			previousX = e.touches[0].clientX;
			previousY = e.touches[0].clientY;
			if (e.touches.length > 1) {
				previousX = (previousX + e.touches[1].clientX) / 2;
				previousY = (previousY + e.touches[1].clientY) / 2;
			}
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
					
			Field.Drag(x - previousX, y - previousY);
			
			previousX = x;
			previousY = y;
			/*Doesn't work!*/
			/*if ((targetX + $(".map-screen").width()) < -(Width + DrawingSettings.hexagonSize))
				targetX = -(Width + DrawingSettings.hexagonSize) - $(".map-screen").width();
			if ((targetX + $(".map-screen").width()) > (Width + DrawingSettings.hexagonSize))
				targetX = Width + DrawingSettings.hexagonSize - $(".map-screen").width();
			
			if ((targetY + $(".map-screen").height()) < -(Height + DrawingSettings.hexagonSize))
				targetY = -(Height + DrawingSettings.hexagonSize) - $(".map-screen").height();
			if ((targetY + $(".map-screen").height()) > (Height + DrawingSettings.hexagonSize))
				targetY = Height + DrawingSettings.hexagonSize - $(".map-screen").height();*/
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
				Field.ParseCells(MapData, TeamsData);
				Field.Render();
			}
		}

		setTimeout(function() {
			if (!IsEnding)
				updateMap();
		}, 300);
	});
}