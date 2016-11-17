/**
* @Author Ajay Sreeram
* [M1032561]
* Mindtree
* Path Finding Genetic Algorithm
*/
var population;
var step_cnt;
var lifespan=200;
var target;
var canvas_background_color=[];
function setup(){
	
	createCanvas(window.innerWidth||document.body.clientWidth,
		window.innerHeight || document.body.clientHeight);//1200,750		//400,300
		
	population = new Population();
	target=createVector(400,200);
	step_cnt=0;
	choose_canvas_background();
		
	canvas.addEventListener('click',function(evt){
		var rect = canvas.getBoundingClientRect(), root = document.documentElement;
		var mouseX = evt.clientX - rect.left - root.scrollLeft;
		var mouseY = evt.clientY - rect.top - root.scrollTop;
		target = new Vector(mouseX,mouseY);
		noloop();
		setTimeout(function(){ 
			clear();
			//choose_canvas_background(); //uncomment this to change background color everytime we change target position
			loop();				
		}, 20);
	});
}

function draw(){
	if(step_cnt>=lifespan){
		population.selection();
		population.generate();
		step_cnt=0;
	}
		
	background(canvas_background_color[0],canvas_background_color[1],canvas_background_color[2]);
	
	population.run();	
		
	step_cnt++;
}

function Population(){
	this.ants=[];
	this.popsize=100;
	this.matingPool=[];
	this.generations=0;
	this.mutationRate=0.01;
	
	for(var i=0;i<this.popsize;i++){
		this.ants[i]=new Ant();
	}
	
	this.run=function(){
		clear();
		
		push();
		translate(0,0);	
		//target in yellow color
		fill(255,255,0 ,1);
		rect(target.x,target.y,16,16);
		pop();
		
		for(var i=0;i<this.popsize;i++){
			this.ants[i].update();
			this.ants[i].show();
		}	
	}
	
	this.reset = function(){
		for(var i=0;i<this.popsize;i++){
			this.ants[i]=new Ant();
		}
	}
	
	this.selection = function(){
		var maxFitness=this.getMaxFitness();
		this.matingPool = [];
		var sum=0;
		for (var i = 0; i < this.ants.length; i++) {
		  var fitness = this.ants[i].fitness/maxFitness;
		  var n = Math.floor(fitness * 100);  // Arbitrary multiplier
		  sum=sum+n;
		  this.matingPool.push(sum);
		}
	}
	
	
	this.generate = function(){
		var newAnts = [];   
		//crossover
		for (var i = 0; i < this.ants.length; i++) {
		    var a = Math.floor(getRandom(this.matingPool[this.matingPool.length-1]+1));
			var b = Math.floor(getRandom(this.matingPool[this.matingPool.length-1]+1));
			var partnerA = this.ants[this.get_ant_index_in_population(a)];
			var partnerB = this.ants[this.get_ant_index_in_population(b)];			
			var child = partnerA.dna.crossover(partnerB.dna);
			//mutation
			child.mutate(this.mutationRate);
			newAnts[i] = new Ant(child);
		}		
		this.ants=newAnts;
	}
	
	this.get_ant_index_in_population=function(val){
	    for(var i=0;i<this.matingPool.length;i++){
		    if(val<=this.matingPool[i])
			    return i;
	    }
	    return null;
    }

	this.getMaxFitness=function(){
		var maxFitness=0;
		for(var i=0;i<this.ants.length;i++){
			var fitness=this.ants[i].getFitness();
			if(fitness>maxFitness)
				maxFitness=fitness;
		}
		return maxFitness;
	}
}

function DNA(genes){
	this.genes=[];
	if(genes){
		this.genes=genes;
	}else{
		for(var i=0;i<lifespan;i++){
			this.genes[i]=createRandomVector();
		}
	}
	
	
	this.crossover=function(partner){
		var crossover = Math.floor(getRandom(this.genes.length)); 
		var child=[];
		for (var i = 0; i < this.genes.length; i++) {
		  if (i > crossover) child[i] = this.genes[i];
		  else               child[i] = partner.genes[i];
		}
		var newgenes = new DNA(child);
		return newgenes;
	}
	this.mutate=function(mutationRate){
		for (var i = 0; i < this.genes.length; i++) {
		  if (getRandom(1) < mutationRate) {
			this.genes[i] = createRandomVector();
		  }
		}
	}
}

function Ant(dna){	
	//starting every ant at middle bottom
	this.pos=createVector(width/2,height);
	//initial velocity of ant will be zero
	this.vel=createVector();
	this.acc=createVector();
	this.dna;
	this.completed = false;
	this.crashed = false; 
	this.fitness;
	
	if(dna)	
		this.dna=dna;
	else
		this.dna=new DNA();

	this.applyforce = function(force){
		this.acc.add(force);
	}
	
	this.update = function(){
		var d = distance_between_points(this.pos, target);
		//if distance less than 10, it means that , ant has reached the sweet
		if (d < 10) { 
		  this.completed = true;
		  this.pos = target.copy();
		  //to make position of rocket to be at centre of target rectangle, or else it will look like as if ant is over the target
		  this.pos.x+=8;this.pos.y+=8;
		}		
		this.applyforce(this.dna.genes[step_cnt]);		
		if (!this.completed && !this.crashed) {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mul(0);			
		}else{
			//nothing
		}
	}
	
	this.show = function(){	
		this.draw_ant(this.pos.x,this.pos.y,this.vel.heading());
	}
	
	this.draw_ant=function(x,y,a){
		push();				
		translate(x,y);	
		rotate(a);
		//black ants :p
		fill(0,0,0 ,0.5);
		rect(-10,-3,20,6);	
		pop();
	}
	
	this.getFitness=function(){
		var d = distance_between_points(this.pos,target);
		this.fitness = 1/d;	
		if (this.completed) {
		  //increase the fitness of this ant as it has reached the destination
		  this.fitness *= 10;
		}
		if (this.crashed) {
		  //decrease the fitness of this ant as it has been crashing, crashing is not yet implemented
		  this.fitness /= 10;
		}		
		return this.fitness;
	}
		
}

/**
* to set one random background color among the below  list
*/
function choose_canvas_background(){
	var colors=[
		[140,26,26],
		[46,204,113],
		[166,145,80]];	
	canvas_background_color = colors[Math.floor(getRandom(colors.length))];		
}
