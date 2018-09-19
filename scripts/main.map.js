/*
**
**  This script file is for canvas ctx drawing.
**
*/

var BackgroundCalibaration = {size: 0.7, x: 0, y: 0};
var Cursor = {};

function initializeMap()
{
	let canvas = document.getElementById("map");
	let height = canvas.height = $("#map").height();
	let width = canvas.width = $("#map").width();
	let ctx = canvas.getContext("2d");
	
	$(".map-screen").mousemove(function(event) {
		Cursor.X = event.pageX;
		Cursor.Y = event.pageY;
		console.log(Cursor);
	});
	/*Temporary*/
	var map = [
		[
			{color: new Color(255, 255, 255), value: 1},
			{color: new Color(255, 255, 255), value: 1},
			{color: new Color(255, 255, 255), value: 2},
			{color: new Color(255, 255, 255), value: 2}
		],
		[
			{color: new Color(255, 0, 255), value:10},
			{color: new Color(0, 125, 255), value:4},
			{},
			{color: new Color(255, 255, 255), value: 2},
			{color: new Color(0, 255, 0), value: 5}
		]
	];
	/*Temporary*/
	
	drawMap(ctx, map, 100, 160, 64);
	
	/*Temporary*/ /*RENDER TEST!!!*/
	setInterval(function() {
		let canvas = document.getElementById("map");
		let ctx = canvas.getContext("2d");
		var map = [
			[
				{color: new Color(255, 255, 255), value:1},
				{color: new Color(255, 255, 255), value:1},
				{color: new Color(255, 255, 255), value:2},
				{color: new Color(255, 255, 255), value:2}
			],
			[
				{color: new Color(255, 0,  255), value: 10},
				{color: new Color(0, 125, 255), value: 4},
				{},
				{color: new Color(255, 255, 255), value: 2},
				{color: new Color(0, 255, 0), value: 5}
			]
		];

		drawMap(ctx, map, 100, 160, 64);
	}, 20);
	/*Temporary*/
}

function drawMap(ctx, map, offsetX, offsetY, hexagonSize)
{
	offsetX = offsetX == undefined ? 0 : offsetX;
	offsetY = offsetY == undefined ? 0 : offsetY;
	
	var image = document.getElementById("background");
	var w = Math.sqrt(3) * (hexagonSize + 3);
	var h = 2 * (hexagonSize + 3);
	
	ctx.clearRect(0,0, $(document).width(), $(document).height());
	//Drawing background
	ctx.drawImage(
		image, 
		offsetX - w + BackgroundCalibaration.x, 
		offsetY - h + BackgroundCalibaration.y, 
		image.width * hexagonSize / 16 * BackgroundCalibaration.size, 
		image.height * hexagonSize / 16 * BackgroundCalibaration.size
	);
	
	var w = Math.sqrt(3) * (64 + 3);
	var h = 2 * (64 + 3);
	let highleghtedY = Math.round((Cursor.Y - offsetY) / h / 3 * 4);
	let highleghtedX = Math.round(((Cursor.X - $("#map").position().left) - (highleghtedY % 2 == 1 ? w/2 : 0) - offsetX) / w);
	
	for	(let y = 0; y < map.length; y++) {
		for	(let x = 0; x < map[y].length; x++) {
			//Calculation coordinates
			let cell = map[y][x];

			if (cell.color == undefined || cell.value == undefined)
				continue;
			
			let rx = x * w + (y % 2 == 1 ? w/2 : 0) + offsetX;
			let ry = y * h * 3 / 4 + offsetY;
			
			//Drawing
			let selected = highleghtedY == y && highleghtedX == x;
			drawHexagon(ctx, rx, ry, cell.color, hexagonSize, selected);
			cell.color.A = 1;
			ctx.shadowBlur = 2;
			ctx.fillStyle = cell.color.toString();
			ctx.font = (hexagonSize / 1.125) + "px monospace";
			ctx.textAlign = "center";
			ctx.fillText(cell.value, rx, ry + (hexagonSize / 3.75));
		}
	}
}

function drawHexagon(ctx, x, y, color, hexagonSize, selected)
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
	
	color.A = selected ? 0.8 : 0.4;
	ctx.shadowColor = "black";
	ctx.shadowBlur = 25;
	ctx.fillStyle = color.toString();
	ctx.fill();
	color.A = 1;
		
	ctx.shadowBlur = 0;
	ctx.lineWidth = 3;
	ctx.strokeStyle = color.toString();
	ctx.stroke();
}