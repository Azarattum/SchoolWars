const HEXAGON = `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="frame" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256px" height="294px"><g id="hexagon"><path id="hexagon-path" stroke="#f00fffa" stroke-width="0" fill="#00fffa4c" d="M 128.000 0.000 C 85.370 24.501 42.741 49.001 0.110 73.500 C 0.111 122.500 0.111 171.500 0.110 220.500 C 42.741 244.999 85.370 269.499 128.000 294.000 C 170.630 269.499 213.259 244.999 255.890 220.500 C 255.889 171.500 255.889 122.500 255.890 73.500 C 213.259 49.001 170.630 24.501 128.000 0.000 Z"/></g></svg>`;

class GameField
{
	/**
		private _Canvas - Html canvas element
		private _Context - 2D Web-Gl context object
		private _Backgorund - Background image object
		private _Map - Hexagon map object
		private _Camera - Camera object
		private _DraggingTimer - Interval that is responsible for dragging animation
		public ColorMap - Map of teams and colors
		public SelectedCell - Represents selected cell's id
	*/
	
	constructor(canvas, textCanvas, background, map)
	{
		this._Loaded = false;
		this.SelectedCell = null;
		this.DraggingEase = 0.6;
		this._Canvas = canvas;
		this._TextCanvas = textCanvas;
		this._Camera = new Camera(this._Canvas.clientWidth, this._Canvas.clientHeight);

		this._Canvas.width = this._Camera.Width;
		this._Canvas.height = this._Camera.Height;
		this._TextCanvas.width = this._Camera.Width;
		this._TextCanvas.height = this._Camera.Height;
		
		//Adds "webgl-2d" context to canvas
		WebGL2D.enable(this._Canvas);
		//Define webgl-2d context
		this._Context = this._Canvas.getContext("webgl-2d");
		this._TextContext = this._TextCanvas.getContext("2d");
		this._Backgorund = new Background(background);
		this._Map = map;//new Map(colorMap);
		this._Loaded = true;
		//Register onload event
		let gameField = this;
		this._Map.onload = function() {
			gameField
			if (gameField.onload)
				setTimeout(function(){gameField.onload();}, 10);
		}
	}
	
	Render()
	{
		if (this._Loaded)
		{
			this._Backgorund.Render(this._Context, this._Camera);
			this._Map.Render(this._Context, this._TextContext, this._Camera);
		}
	}
	
	Drag(targetX, targetY)
	{
		this.X += targetX;
		this.Y += targetY;
		
		this.Render();
	}
	
	ParseCells(cells, spawns)
	{
		let objectCells = [];
		//Parse cells position, holder and value
		for (let cell in cells)
		{
			objectCells.push(new Cell(
				cells[cell].coords.x,
				cells[cell].coords.y,
				Math.abs(cells[cell].holder),
				cells[cell].value,
				(cells[cell].holder < 0)
			));
		}
		
		//Parse spawn cells
		/*for (let spawn in spawns)
		{
			objectCells[spawns[spawn].startCell].IsSpawn = true;
		}*/
		
		//Save to map
		this._Map.CellsCache = this._Map.Cells;
		this._Map.Cells = objectCells;
	}
	
	Select(x, y)
	{
		this.SelectedCell = this._Map.Select(x, y, this._Camera);
		this.Render();
	}
	
	set X(value) {this._Camera.X = value;}
	set Y(value) {this._Camera.Y = value;}
	set Zoom(value) {this._Camera.Zoom = value;}
	
	get X() {return this._Camera.X;}
	get Y() {return this._Camera.Y;}
	get Zoom() {return this._Camera.Zoom;}
}

class Map
{
	/**
		public Cells - Cells array
		public ColorMap - Map of holders and colors
	*/
	
	constructor(colorMap)
	{
		this.Cells = [];
		this.CellsCache = [];
		this.ImageMap = colorMap;
	}
	
	Select(x, y, camera)
	{
		//Define sizes
		let size = camera.Zoom * 64;
		let w = Math.sqrt(3) * (size + (size / 5.5));
		let h = 2 * (size + (size / 5.5));
		
		//Find cell
		let cellY = Math.round((y - camera.Y) / (h * (3 / 4) + 3));
		let cellX = Math.round(((x - camera.X) - (cellY % 2 == 1 ? w/2 : 0)) / (w + 3));
		
		//Select cell
		let cellId = undefined;
		
		for (let cell in this.Cells)
		{
			if (x != undefined && this.Cells[cell].X == cellX && this.Cells[cell].Y == cellY)
			{
				this.Cells[cell].IsSelected = true;
				cellId = cell;
			}
			else
				this.Cells[cell].IsSelected = false;
		}
		
		return +cellId;
	}
	
	Render(ctx, tctx, camera) 
	{
		if (!this.ImageMap || this.ImageMap.color.length <= 0)
			return;
		
		tctx.clearRect(0, 0, camera.Width, camera.Height);
		tctx.font = (camera.Zoom * 56.888) + "px monospace";
		tctx.textAlign = "center";
		for (let cell in this.Cells)
			this.Cells[cell].Render(ctx, tctx, camera, this.ImageMap);
	}
	
	set ImageMap(colorMap)
	{
		if (!colorMap)
			return;
		
		let imagesCount = colorMap.length * 4;
		let loadedImages = 0;
		let map = this;
		
		setTimeout(function() 
		{
			let svg = $($.parseXML(HEXAGON)).find("svg");
			
			map._ImageMap = {color:[], images:[[]]};
			for (let holder in colorMap)
			{
				let color = colorMap[holder];
				map._ImageMap.color[holder] = color;
				map._ImageMap.images[holder] = {false: [], true: []};
				//Normal
				map._ImageMap.images[holder][false][false] = createImage(
					svg, color.alpha(0.3), 5);
				//Spawn
				map._ImageMap.images[holder][true][false] = createImage(
					svg, color.alpha(0.3), 15, new Color(255,255,250));
				//Selected normal
				map._ImageMap.images[holder][false][true] = createImage(
					svg, color.alpha(0.9), 5);
				//Selected spawn
				map._ImageMap.images[holder][true][true] = createImage(
					svg, color.alpha(0.9), 15, new Color(255,255,250));
			}
		}, 0);
		
		function createImage(svg, color, strokeWidth, strokeColor)
		{
			strokeColor = strokeColor? strokeColor : color.alpha(1);
			let customSvg = svg.clone();
			customSvg.attr("width", 
				(+(customSvg.attr("width").replace("px", "")) + strokeWidth) + "px");
			customSvg.attr("height", 
				(+(customSvg.attr("height").replace("px", "")) + strokeWidth) + "px");
			customSvg.find("#hexagon").attr("transform",
				"translate("+(strokeWidth/2)+","+(strokeWidth/2)+")");
			
			customSvg.find("#hexagon-path").attr("fill", color.toString());
			customSvg.find("#hexagon-path").attr("stroke", strokeColor.toString());
			customSvg.find("#hexagon-path").attr("stroke-width", strokeWidth);
			
			let image = new Image();
			image.src = "data:image/svg+xml;base64," + btoa(customSvg[0].outerHTML);
			image.onload = function() {
				loadedImages++
				if (loadedImages >= imagesCount && map.onload)
					setTimeout(function(){map.onload();}, 200);
			};
			return image;
		}
	}
	get ImageMap() {return this._ImageMap;}
}

class Cell
{
	constructor(x, y, holder, value, isSpawn, isSelected)
	{
		this.X = x;
		this.Y = y;
		this.Holder = holder? holder: 0;
		this.Value = value || value === 0? value: 1;
		this.IsSpawn = isSpawn? isSpawn: false;
		this.IsSelected = isSelected? isSelected: false;
	}
	
	Equals(other)
	{
		if (!other)
			return false;
		
		return this.X == other.X && 
			this.Y == other.Y && 
			this.Holder == other.Holder &&
			this.Value == other.Value &&
			this.IsSpawn == other.IsSpawn &&
			this.IsSelected == other.IsSelected;			
	}
	
	Render(ctx, tctx, camera, imageMap)
	{
		let size = camera.Zoom * 64;
		var w = Math.sqrt(3) * (size + (size / 5.5));
		var h = 2 * (size + (size / 5.5));
		
		let x = (this.X * (w + 3)) + (this.Y % 2 == 1 ? w/2 : 0) + camera.X;
		let y = this.Y * (h * (3 / 4) + 3) + camera.Y;
		
		//Check if in camera
		if ((x - w / 2) > camera.Width ||
			(x + w / 2) < 0 ||
			(y - h / 2) > camera.Height ||
			(y + h / 2) < 0)
			return;
		
		//Draw shape
		let image = imageMap.images[this.Holder][this.IsSpawn][this.IsSelected];
		if (!image || image.height <= 1 || image.width <= 1)
			return;
		ctx.drawImage(
			imageMap.images[this.Holder][this.IsSpawn][this.IsSelected],
			x - w/2, y - h/2, w, h);

		//Draw text
		tctx.fillStyle = this.IsSelected ? 
			(this.Holder == 0?new Color(13,13,13): new Color(255,255,250))
			: imageMap.color[this.Holder].saturate(1.1);
		tctx.fillText(this.Value.toString(), x, Math.round(y + (size / 3.75)));
	}
}

class Camera
{
	constructor(width, height)
	{
		this.Width = width;
		this.Height = height;
		this.X = 50;
		this.Y = 50;
		this.Zoom = 0.5;
	}
}

class Background
{
	/**
		private _Calibration - Defines background calibration
	*/
	constructor(image)
	{
		this.Image = image;
		this._Calibration = {
			X: -245,
			Y: -242,
			Zoom: 1.695999999999998
		}
		this.Width = this._Calibration.Zoom * this.Image.Width;
		this.Height = this._Calibration.Zoom * this.Image.Height;
	}
	
	Render(ctx, camera)
	{
		//Draw solid background
		ctx.fillStyle = "#0d0d0d";
		ctx.fillRect(0, 0 , camera.Width, camera.Height);
		
		//Draw image background		
		let sx = -(this._Calibration.X + camera.X);
		let sy = -(this._Calibration.Y + camera.Y);
		
		let dx = sx < 0? -sx: 0;
		let dy = sy < 0? -sy: 0;
		
		let zoom = this._Calibration.Zoom * camera.Zoom;
		sx = Math.max(sx / zoom, 0);
		sy = Math.max(sy / zoom, 0);
		let width = Math.min(camera.Width, (this.Image.width - sx));
		let height = Math.min(camera.Height, (this.Image.height - sy));
		
		ctx.drawImage(
			this.Image, //Image
			sx, sy, //Source coords
			width, height, //Source sizes
			dx, dy, //Destination coords
			width * zoom, height * zoom//Destination sizes
		);
	}
}