/**
* @Author Ajay Sreeram
* [M1032561]
* Mindtree
* library for Path Finding Genetic Algorithm
*/

var canvas;
var context;

/**
* width and height of canvas
*/

var width,height;
/**
* Frames Per Second (FPS), to increase speed,
* increase FPS value, its range is [1,1000]
*/
var FPS=60;	

/**
* creating the canvas and appending it to body tag
*/
function createCanvas(canwidth,canheight){
	canvas=document.createElement("canvas");
	canvas.width=canwidth;
	canvas.height=canheight;
	
	canvas.style.left = '0px';
	canvas.style.top = '0px';
	canvas.style.position = 'absolute';
	
	width=canwidth;
	height=canheight;
	context=canvas.getContext("2d");	
	document.body.appendChild(canvas);
}

/**
* setting background color to canvas
*/
function background(colorR,colorG,colorB){	
	canvas.style.background = 'rgba('+colorR+', '+colorG+', '+colorB+',1)';
}

/**
* Pushes the current state onto the stack.
*/
function push(){
	context.save();
}

/**
* Pops the top state on the stack, restoring the context to that state.
*/
function pop(){	
	context.restore();
}

/**
* remaps the (0,0) position on the canvas
*/
function translate(x,y){
	context.translate(x, y);
}

/**
* clear canvas
*/
function clear(){	
	context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
* rotates the current drawing.
*/
function rotate(angle){
	context.rotate(angle);
}

/**
* set fill style ie., color with which we can further draw on canvas
*/
function fill(colorR,colorG,colorB,opacity){
	var style='rgba('+colorR+', '+colorG+', '+colorB+', '+opacity+')';
	context.fillStyle = style;
}

/**
* drawing a rectangle at x,y with width=recWidth, height=recHeight
*/
function rect(x,y,recWidth,recHeight){
	context.fillRect(x, y, recWidth, recHeight);
}

var _repeat_draw;

/**
* continuously calling draw function in constant time span
*/
function recall_draw(){
	draw();
	if(_repeat_draw){
		setTimeout(function(){ recall_draw(); }, 1000/FPS);
	}
}

/**
* to will break recall_draw function
*/
function noloop(){
	_repeat_draw=false;
}

/**
* to resume calling draw function
*/
function loop(){
	_repeat_draw=true;
	recall_draw();
}

/**
* creates a vector
*/
function createVector(x,y,z){
	return new Vector(x, y, z);
}

/**
* to create vector object, and add some functionalities to it
*/
function Vector(x,y,z){
	if(x)
		this.x=x;
	else
		this.x=0;
	if(y)
		this.y=y;
	else
		this.y=0;
	if(z)
		this.z=z;
	else
		this.z=0;
	
	this.add=function(new_vec){
		this.x = this.x + new_vec.x;
		this.y = this.y + new_vec.y;
		this.z = this.z + new_vec.z;
	}
	
	this.mul=function(new_val){
		this.x=this.x*new_val;
		this.y=this.y*new_val;
		this.z=this.z*new_val;
	}
	
	this.heading=function(){		
		return Math.atan2(this.y, this.x);
	}
	
	this.copy = function(){
		return new Vector(this.x,this.y,this.z);
	}
		
}

/**
* creating random 2d vector 
*/
function createRandomVector(){
	var angle = Math.random()*2* Math.PI;//Math.random()*360* Math.PI / 180;//randome angle in radians
	return new Vector(Math.cos(angle),Math.sin(angle),0);
}

/**
* to find distance between two poits, each point is represented as vector having x,y,z values
*/
function distance_between_points(p1,p2){
	return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2))+0.01;
}

/**
* to get randome value in range [min,max]
*/
function getRandom(min, max) {
  if(max)
	return Math.random() * (max - min) + min;
  else
	return Math.random()*min;
}

/**
* starting the application after all required files loaded
*/
window.onload = function() {	
	setup();	
	_repeat_draw=true;
	recall_draw();	
	console.log("----------------- Code by: 'Sreeram Ajay' [M1032561] -----------------");
}
