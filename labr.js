  window.onload = function(){

  var canvas, 
        context,
        bounce = -1;
        
    
    canvas = document.getElementById("canvas");
    canvas.width = 300;
    canvas.height = 300;
    context = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height; 
//d:delimiter
var delimiter = 10;
var size = w/delimiter;


for(var i = 0;i<10;i++){
        for(var j = 0;j<10;j++){       
            rect(size*i,size*j,size,size,randomcolor());

    };
};




 var Maze = new Array(
                      new Array(1,1,1,1,1,1,1,1,1,1),
                      new Array(1,0,0,0,1,1,1,0,0,0),
                      new Array(1,1,1,0,0,0,0,0,1,1),
                      new Array(1,0,0,0,1,1,1,0,1,1),
                      new Array(1,0,1,1,1,1,0,1,1,1),
                      new Array(1,0,0,1,1,1,0,0,0,1),
                      new Array(1,1,0,0,0,1,0,1,0,1),
                      new Array(1,1,1,1,0,1,0,1,0,1),
                      new Array(1,0,0,0,0,0,0,1,0,1),
                      new Array(1,0,1,1,1,1,1,1,1,1)
                      ); 


function BlackOrWhite(something){
    if(something == 1){return "black";}else{return "white";};
};


            

for(var i = 0;i<10;i++){
        for(var j = 0;j<10;j++){       
            rect(size*j,size*i,size,size,BlackOrWhite((Maze[i][j])));

    };
};






//+++++++++++++++++++++++++++++++++++++++++
//     CANVVAS UTILITIEZ
//+++++++++++++++++++++++++++++++++++++++++

function rect(x,y,w,h,color){
    context.fillStyle = color;  
    context.fillRect (x,y,w,h);  
};

function randomcolor(){
    var r=Math.floor(Math.random()*255),
        g=Math.floor(Math.random()*255),
        b=Math.floor(Math.random()*255),
        a=Math.random(),
        rgba='rgba('+r+','+g+','+b+','+a+')';
    return rgba;

};

function rnd(num){
    return Math.random()*num;
};

canvas.addEventListener('click', function(){
    context.clearRect(0, 0, 800, 800);    
});

function Line(x1,y1,x2,y2){
    //context.lineWidth = 0.1;
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
};


function Circle(x,y,radius,startAngle,endAngle,clockwise){

    context.beginPath();
    context.arc(x,y,radius,startAngle,endAngle,clockwise);
    context.closePath();
    context.fill();     
};
}