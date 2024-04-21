/*
Modified version of "X/Y Pad for Surround Panning" by
Nico Starke @ Ableton / Robert Henke
Jan. 25 2018

Adjusted for ReaperBridge usage by Niklas Garbe
21.04.2023
*/

outlets = 1;

// mgraphics initialization
mgraphics.init();					// initialize mgraphics
mgraphics.relative_coords = 0;		// coordinate system: x, y, width height
mgraphics.autofill = 0;				// we want to fill the paths ourself

// global variables		
var width = this.box.getattr("presentation_rect")[2];
var height = this.box.getattr("presentation_rect")[3];
	
var xVal = 0;
var yVal = 0;
var azimuth = 0;
var elevation = 1;

var xyCoords = 0;
var focusSize = 0;
var xyOffset = 20;
var scaleFactor = width/(width-2*xyOffset);
var xySize = 16;
var mouseIsDown = 0;
var mouseDownPos = [0, 0];

// colors
var xycolor = [1., 0.71, 0.2, 1.];
var focuscolor = [1, 1, 1, 0.16];


// main paint function 
function paint()
{
	with (mgraphics) {	

        // draw focus ring
	    set_source_rgba(focuscolor);
	    ellipse(xVal-focusSize/2, yVal-focusSize/2, focusSize, focusSize);
	    fill();

		// draw xy circle
		set_source_rgba(xycolor);
		ellipse(xVal-(xySize/2), yVal-(xySize/2), xySize, xySize);
		fill();	
	}
}

// set x/y position
function setPos(x, y, focus){
	x = worldtoscreen(x, y)[0];
	y = worldtoscreen(x, y)[1];
    xVal = x;
	yVal = y;
	mgraphics.redraw();
}

// Takes input azimuth-degrees and calculates corresponding position on screen
function setAzimuth(deg){
	azimuth = degtorad(deg)

	x = Math.sin(azimuth)
	y = Math.cos(azimuth)

	x = elevation * x
	y = elevation * y

	xVal = worldtoscreen(x, y)[0];
	yVal = worldtoscreen(x, y)[1];

	mgraphics.redraw();

}

// Takes input elevation-degrees and calculates corresponding position on screen
function setElevation(deg){

	rad = degtorad(deg)
	elevation = Math.cos(rad)

	x = Math.sin(azimuth)
	y = Math.cos(azimuth)

	x = elevation * x
	y = elevation * y

	xVal = worldtoscreen(x, y)[0];
	yVal = worldtoscreen(x, y)[1];

	xySize = 3 * Math.sin(rad) + 16

	mgraphics.redraw();
}

// Takes input width (stereo spread)-degrees and displays them using an additional ellipse
function setWidth(deg){
	rad = degtorad(deg)

	focusSize = 180 * Math.sin(0.5 * rad)

	mgraphics.redraw();
}


// change xy color
function setcolor(r, g, b, a){
    xycolor = [r, g, b, a];
    mgraphics.redraw();
}


function forcesize(w,h)
{
	if (w!=h) {
		h = w;
		box.size(w,h);
	}
}
forcesize.local = 1; //private


function onresize(w,h)
{
	forcesize(w,h);
	var width = this.box.getattr("presentation_rect")[2];
	var height = this.box.getattr("presentation_rect")[3];
	refresh();
}
onresize.local = 1; //private


// helper function for value clamping
function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}
clamp.local = 1; //private


// helper function to convert degrees to radians
function degtorad(deg){
	return deg*6.283185307179586/360.;
}
degtorad.local = 1; //private


// scale pixel coordinates to -1...1 range
function screentoworld(x, y){
	var rawValue = [0, 0];

	rawValue[0] = (x-xyOffset) / width * scaleFactor * 2 - 1;
	rawValue[1] = ((y-xyOffset) / height * scaleFactor * 2 - 1) * (-1);
	
	return rawValue;
}
screentoworld.local = 1; //private


// scale -1...1 range to pixel coordinates
function worldtoscreen(x, y){
	var pixelValue = [0, 0];

	pixelValue[0] = (((x + 1) * (width/scaleFactor)) / 2) + xyOffset;
	pixelValue[1] = ((((y * -1) + 1) * (height/scaleFactor)) / 2) + xyOffset;
	
	return pixelValue;
}
worldtoscreen.local = 1; //private
