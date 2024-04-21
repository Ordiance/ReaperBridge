/*
Speaker icons for Surround Panning
Nico Starke @ Ableton / Robert Henke
Jan. 24 2018
*/

outlets = 1;

// mgraphics initialization
mgraphics.init();					// initialize mgraphics
mgraphics.relative_coords = 0;		// coordinate system: x, y, width height
mgraphics.autofill = 0;				// we want to fill the paths ourself

// global variables		
var width = this.box.getattr("presentation_rect")[2];
var height = this.box.getattr("presentation_rect")[3];
	
var speakerlist = [];

// colors
var speakertextcolor = [0, 0, 0, 0.9];
var speakercolor = [[0.99, 0.86, 0.02, 1.], // 0 = L
					[1., 0.57, 0.02, 1.], 	// 1 = R
					[1., 0.71, 0.2, 1.]];	// 2 = Center (unused)


// main paint function
function paint()
{
	with (mgraphics) {	

		var numSpeakers = speakerlist.length / 4;
	
	    for (var i = 1; i <= numSpeakers; i++){

		    var x = speakerlist[(i-1)*4];
		    var y = - speakerlist[(i-1)*4+1];
		    var angle = 270 -speakerlist[(i-1)*4+2];
		    var textoffset = 0;

		    identity_matrix();
		    translate(worldtoscreen(x, y));
		    rotate(degtorad(angle));

		    // draw the speaker
		    set_source_rgba(speakercolor[speakerlist[(i-1)*4+3]]);
		    rectangle(-5, -2, 10, 8);
		    fill();
	
		    move_to(-5, -1);
		    line_to(-9, -5);
		    line_to(9, -5);
		    line_to(5, -1);
		    close_path();	
		    fill();

		    // rotate number in case speakers are facing upside down
		    if (angle > 90 && angle < 270){
			    rotate(3.14);
			    textoffset = 3;
		    }
		
		    else {
			    rotate(0);
			    textoffset = 4;
		    }
		
		    // draw the number
		    set_source_rgba(speakertextcolor);
		    select_font_face("Ableton Sans Book");
		    set_font_size(9.5);
		    move_to(-3, textoffset);
		    text_path(i.toString());
		    fill();
	    }
	
	}
}


// draw speakers 
function drawSpeakers(list){
    speakerlist = arguments;
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


// convert degrees to radians
function degtorad(deg){
	return deg*6.283185307179586/360.;
}
degtorad.local = 1; //private


// scale numbers to real pixels for speaker placement
function worldtoscreen(x, y){ 
	var pixelValue = [0, 0];

	pixelValue[0] = ((x*0.92 + 1) * width) / 2;
	pixelValue[1] = ((y*0.92 + 1) * height) / 2;
	
	return pixelValue;
}
worldtoscreen.local = 1; //private


