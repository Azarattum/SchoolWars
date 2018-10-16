class Color 
{
	constructor(r, g, b, a) //Constructor
	{
		this.R = r;
    	this.G = g;
    	this.B = b;
    	this.A = a;
  	}
	
	saturate(value)
	{
		let r,g,b;
		var gray = 0.2989*this.R + 0.5870*this.G + 0.1140*this.B; //Weights from CCIR 601 spec
		r = -gray * value + this.R * (1+value);
		g = -gray * value + this.G * (1+value);
		b = -gray * value + this.B * (1+value);
		if(r > 255) r = 255;
		if(g > 255) g = 255;
		if(b > 255) b = 255;
		if(r < 0) r = 0;
		if(g < 0) g = 0;
		if(b < 0) b = 0;
		
		return new Color(r, g, b);
	}
	
	alpha(value)
	{
		return new Color(this.R, this.G, this.B, value);
	}
	
	toString()
	{
		if (this.A == undefined)
			return "rgb("+Math.round(this.R)+","+Math.round(this.G)+","+Math.round(this.B)+")";
		else
			return "rgba("+Math.round(this.R)+","+Math.round(this.G)+","+Math.round(this.B)+","+this.A+")";
	}
	
	static isColor(object)
	{
		return (object.R != undefined && object.G != undefined && object.B != undefined);
	}
}

function randomInt(min, max)
{
	let rnd = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rnd);
}

function shuffleArray(array) {
	let j;
	let x;

	for (let i = array.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = array[i];

		array[i] = array[j];
		array[j] = x;
	}

	return array;
}