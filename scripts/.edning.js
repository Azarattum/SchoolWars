/*
**
**  This script file is for making glich effects and showing the ending video.
**
*/
var IsEnding = false;

function startEnd()
{
	//The end?
	IsEnding = true;
	makeGliches();
	setTimeout(function() {
		makeMatrix();
		clearMap(function() {
			setTimeout(function() {
				$("body").css("background-color", "rgb(13,13,13)");
				$("body").html("<iframe width=\"100%\" height=\"100%\" style=\"position: absolute;left:0px;top:0px;width:100vw;height:100vh;\" src=\"https://www.youtube.com/embed/VpZM5EKanio?autoplay=1&amp;rel=0&amp;showinfo=0\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>");
			}, 2600);
		});
	}, 2500);
}

function clearMap(callback)
{
	var Lenght;
	for (let i in MapData)
		Lenght = i;

	setTimeout( function() {
		var cell = 0;
		var prevTime = new Date().getTime();
		var clearingTimer = setInterval(function() {
			let cellsToClear = Math.floor((new Date().getTime() - prevTime) / 100);
			for (let i = 0; i < cellsToClear; i++)
			{
				MapData[cell].holder = 0;
				cell++;
				
				if (cell >= Lenght) {
					clearInterval(clearingTimer);

					if (callback)
						callback();

					return;
				}
			}			
			
			if (window.Field == undefined) {
				initializeCanvas();
				drawMap(Ctx, DrawingSettings.offsetX, DrawingSettings.offsetY, DrawingSettings.hexagonSize);
			} else {
				Field.ParseCells(MapData, TeamsData);
				Field.Render();
			}
		}, 100);
	}, 2000);
}

function makeGliches()
{
	$("div,span,p").each(function(){
		if ($(this).text() == $(this).html() && $(this).text().length > 0)
		{
			$(this).attr("data-text", $(this).text())
			$(this).addClass("glitch");
		}
	});
	setTimeout(function(){
		$(".task-holder").addClass("gl-4");
		setTimeout(function(){
			$(".tab-bar").addClass("gl-1");
			setTimeout(function(){
				$(".map-wrapper").addClass("gl-4");
				setTimeout(function(){
					$(".page").addClass("gl-3");
				}, 800);
			}, 400);
		}, 500);
	}, 1500);
}

function makeMatrix()
{
	var canvas = document.body.appendChild( document.createElement( 'canvas' ) );
	$(canvas).css({"top": "0px", "left": "0px", "z-index": "600", "position": "absolute", "height": "100vh", "width": "100vw"});
    context = canvas.getContext( '2d' );
	context.globalCompositeOperation = 'lighter';
	canvas.width = $(window).width()/3;
	canvas.height = $(window).height()/3;
	draw();
	
	var textStrip = ['诶', '比', '西', '迪', '伊', '吉', '艾', '杰', '开', '哦', '屁', '提', '维'];

	var stripCount = 60, stripX = new Array(), stripY = new Array(), dY = new Array(), stripFontSize = new Array();

	for (var i = 0; i < stripCount; i++) {
		stripX[i] = Math.floor(Math.random()*1265);
		stripY[i] = -100;
		dY[i] = Math.floor(Math.random()*7)+3;
		stripFontSize[i] = Math.floor(Math.random()*16)+8;
	}

	var theColors = ['#cefbe4', '#81ec72', '#5cd646', '#54d13c', '#4ccc32', '#43c728'];

	var elem, context, timer;

	function drawStrip(x, y) {
		for (var k = 0; k <= 20; k++) {
			var randChar = textStrip[Math.floor(Math.random()*textStrip.length)];
			if (context.fillText) {
				switch (k) {
				case 0:
					context.fillStyle = theColors[0]; break;
				case 1:
					context.fillStyle = theColors[1]; break;
				case 3:
					context.fillStyle = theColors[2]; break;
				case 7:
					context.fillStyle = theColors[3]; break;
				case 13:
					context.fillStyle = theColors[4]; break;
				case 17:
					context.fillStyle = theColors[5]; break;
				}
				context.fillText(randChar, x, y);
			}
			y -= stripFontSize[k];
		}
	}

	function draw() {
		// clear the canvas and set the properties
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.shadowOffsetX = context.shadowOffsetY = 0;
		context.shadowColor = '#94f475';
		
		for (var j = 0; j < stripCount; j++) {
			context.font = stripFontSize[j]+'px MatrixCode';
			context.textBaseline = 'top';
			context.textAlign = 'center';
			
			if (stripY[j] > 1358) {
				stripX[j] = Math.floor(Math.random()*canvas.width);
				stripY[j] = -100;
				dY[j] = Math.floor(Math.random()*7)+3;
				stripFontSize[j] = Math.floor(Math.random()*16)+8;
				drawStrip(stripX[j], stripY[j]);
			} else drawStrip(stripX[j], stripY[j]);
			
			stripY[j] += dY[j];
		}
	  setTimeout(draw, 70);
	}
}



