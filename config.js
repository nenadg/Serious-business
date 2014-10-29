var requestAnimationFrame;

var Gaem = (function(){
	var canvas, points, ctx, width, height, keys, friction, gravity, startPoint, animating, player,
		space, keepScore, boxes, values, image;

	function configure(next, currentScore){

		(function () {
			requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
			window.requestAnimationFrame = requestAnimationFrame;
		})();

		image = document.getElementById('flatlogo'),
		canvas = document.getElementById('canvas'),
		points = document.getElementById('points'),
		ctx = canvas.getContext("2d"),
		width = window.innerWidth - 1,
		height = window.innerHeight - 50,
		keys = [],
		boxes = [],
		friction = 0.8,
		gravity = 0.3,
		startPoint = currentScore? currentScore: 0,
		animating = true,
		player = {
			x: 10,
			y: 10,
			width: 11,
			height: 11,
			speed: 4,
			velX: 0,
			velY: 0,
			jumping: false,
			grounded: false
		},
		space = [
			{   // start pad
				x: 0,
				y: height /2,
				width: 68,
				height: 68,
				color: '#fff',
				feature: 'start',
				type: 'image',
				alpha: 1
			},
			{   // left wall
				x: 0,
				y: 0,
				width: 2,
				height: height,
				color: '#fff',
				feature: 'start',
				type: 'rect',
				alpha: 1
			},
			{   // floor
				x: 0,
				y: height - 2,
				width: width,
				height: 1,
				color: '#fff',
				feature: 'die',
				type: 'rect',
				alpha: 1
			},
			{   // ceiling
				x: 0,
				y: 0,
				width: width,
				height: 2,
				color: '#fff',
				feature: 'nothing',
				type: 'rect'
			},
			{   // right wall
				x: width - 2,
				y: 0,
				width: 1,
				height: height,
				color: '#fe1',
				feature: 'next',
				type: 'rect',
				alpha: 1
			}
		];
		
		values = {
			canvas: canvas,
			points: points,
			ctx: ctx,
			width: width,
			height: height,
			keys: keys,
			friction: friction,
			gravity: gravity,
			startPoint: startPoint,
			animating: animating,
			player: player,
			space: space,
			keepScore: currentScore,
			boxes: boxes,
			image: image
		};

		canvas.width = width;
		canvas.height = height;

		next();
	};

	var config = function(){
		return values;
	}

	var include = function(scripturl, next) {
		var head = document.getElementsByTagName('head')[0],
			script = document.createElement('script');
			
		script.type = 'text/javascript';
		script.src = scripturl;
		script.onreadystatechange = next;
    	script.onload = next;

		head.appendChild(script);
	};

	var load = function(){
		configure(function(){
			
			document.body.addEventListener("keydown", function (e) {
				keys[e.keyCode] = true;
			});

			document.body.addEventListener("keyup", function (e) {
				keys[e.keyCode] = false;
			});

			include('./gaem.js', function(){
				gaem.start();
			});
		})
	};

	var restart = function(currentScore){
		configure(function(){
			gaem.start(currentScore);
		}, currentScore);
	};

	var toRgb = function(hex, opacity) {

		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ?  parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + (opacity? ',' + opacity: '')
		 : null;
	}

	window.addEventListener("load", function(){
		load();
	});

	CanvasRenderingContext2D.prototype.clear = 
		CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
			if (preserveTransform) {
				this.save();
				this.setTransform(1, 0, 0, 1, 0, 0);
			}

			this.clearRect(0, 0, this.canvas.width, this.canvas.height);

			if (preserveTransform) {
				this.restore();
		}
	};

	return {
		load: load,
		config: config,
		restart: restart,
		toRgb: toRgb
	}
})();