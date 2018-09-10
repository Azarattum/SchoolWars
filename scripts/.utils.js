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
		if (object.R != undefined && object.G != undefined && object.B != undefined)
			return true;
		else
			return false;
	}
}