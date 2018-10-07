class Color 
{
	constructor(r, g, b, a) //Constructor
	{
		this.R = r;
    	this.G = g;
    	this.B = b;
    	this.A = a;
  	}
	
	toString()
	{
		if (this.A == undefined)
			return "rgb("+this.R+","+this.G+","+this.B+")";
		else
			return "rgba("+this.R+","+this.G+","+this.B+","+this.A+")";
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