
var gaem = (function(){
	var values, shooting = false;

	var start = function(keepScore){
		values = Gaem.config();
		keepScore = values.keepScore;
		animating = true;

		var tempoObj = [],
			colors = [ '#3261AB', '#44A5CB', '#5EC84E','#C0D860', '#F9DB57','#E6855E',
				'#DA5019', '#F2F5AA', '#D45D87', '#9D73BB', '#AEC1E3', '#5EC84E', '#A4C520',
				'#FFE600', '#F9DB57', '#E6855E', '#DA5019'
			],
			min = 5,
			max = 80,
			movingObjects = (function(){
				var a = [];
				for(var i = 0; i < 14; i++)
					a.push(Math.floor(Math.random() * 29));

				return a;
			})();

		for(var i = 1; i < 70; i++){

			tempoObj.push({ 
				x:  Math.floor(Math.random() * (values.width - min + 1)) + min, //width - Math.floor(Math.random() * i*10),
				y:  Math.floor(Math.random() * (values.height - min + 1)) + min,
				width: 68,  //Math.floor(Math.random() * (max - min + 1)) + min,
				height: 68,  // Math.floor(Math.random() * (max - min + 1)) + min,
				color: colors[Math.floor(Math.random()*colors.length)],
				feature: 'point',
				done: false,
				type: 'image',
				points: 68,
				alpha: 1,
				destroy: function(){
					var bulletIndex = values.boxes.indexOf(this);
					values.boxes.splice(bulletIndex, 1);
					//shooting = false;
					this.dead = 1;
				}
			});
		}

		var lastBox = 0;

		function checkIntersections(boxes, next){
			var newBoxes = [];

			boxes.sort(function(a, b){
				return  a.x > b.x;
			});
			
			for (var i = 0; i < boxes.length; i++) {
				if(!intersecting(boxes[i], boxes[i+1])){
					newBoxes.push(boxes[i]);
					/*if(boxes[i+1])
						boxes[i+1].x = boxes[i].right ;*/
				} else {
					if(boxes[i+1])
						boxes[i+1].y = boxes[i].top ;
				}
			}

			lastBox++;
			
			if(lastBox < 50)
				checkIntersections(newBoxes, next);

			else {
				values.boxes = newBoxes;
				
				for (var dimension in values.space){
					values.boxes.push(values.space[dimension]);
				}
				
				for (var item in movingObjects){
					var i = movingObjects[item],
						speed = movingObjects[item];

					if(values.boxes[i] && values.boxes[i].feature != 'next'){
						values.boxes[i].points = movingObjects[item] * 10;
						values.boxes[i].moving = true;
						values.boxes[i].alpha = .8;

						if(values.boxes[i].feature != 'start')
							move(values.boxes[i], speed); 
					}
				}

				next();
			}
		}

		checkIntersections(tempoObj, update);
	};

	function intersecting(shapeA, shapeB) {

		if(shapeB){
			shapeA.left = shapeA.x;
			shapeA.right = shapeA.x + shapeA.width;
			shapeA.top	= shapeA.y;
			shapeA.bottom = shapeA.y + shapeA.height;
			shapeB.left = shapeB.x;
			shapeB.right = shapeB.x + shapeB.width;
			shapeB.top	= shapeB.y;
			shapeB.bottom = shapeB.y + shapeB.height;

			return (shapeA.left <= shapeB.right &&
				shapeB.left <= shapeA.right &&
				shapeA.top <= shapeB.bottom &&
				shapeB.top <= shapeA.bottom);
		} else
			return false;
	};

	function update() {
		
		if(values.player.x < 0 || values.player.y > values.height + 120)
			die();

		if (values.keys[38] || values.keys[87] ) { // || values.keys[32]
			// up arrow or space
			if (!values.player.jumping && values.player.grounded) {
				values.player.jumping = true;
				values.player.grounded = false;
				values.player.velY = -values.player.speed * 2;
			}
		}
		if (values.keys[39] ||values. keys[68]) {
			// right arrow
			if (values.player.velX < values.player.speed) {
				values.player.velX++;
			}
		}
		if (values.keys[37] || values.keys[65]) {
			// left arrow
			if (values.player.velX > -values.player.speed) {
				values.player.velX--;
			}
		}

		values.player.velX *= values.friction;
		values.player.velY += values.gravity;

		values.ctx.clearRect(0, 0, values.width, values.height);

		values.ctx.beginPath();

		if (values.keys[32]){
			shoot();
		}
			
		values.player.grounded = false;

		for (var i = 0; i < values.boxes.length; i++) {

			if(values.boxes[i].hasOwnProperty('dead')){
				if(values.boxes[i].dead > 0)
					values.boxes[i].dead--;
				else {
					values.boxes[i].destroy();
					//var shapebIndex = values.boxes.indexOf(values.boxes[i]);
					//values.boxes.splice(shapebIndex, 1);
				}
			}
			
			if(values.boxes[i].feature === 'bullet'){

				values.ctx.fillStyle = 'rgba(' + Gaem.toRgb(values.boxes[i].color, values.boxes[i].alpha) + ')';
				values.ctx.fillRect(values.boxes[i].x, values.boxes[i].y, values.boxes[i].width, values.boxes[i].height);

			} else if(values.boxes[i].type === 'image'){
				values.ctx.drawImage(values.image, values.boxes[i].x, values.boxes[i].y, values.boxes[i].width, values.boxes[i].height);
				

				if(values.boxes[i].moving){

					values.ctx.fillStyle = 'rgba(' + Gaem.toRgb(values.boxes[i].color, values.boxes[i].alpha) + ')';
					values.ctx.fillRect(values.boxes[i].x, values.boxes[i].y, values.boxes[i].width, values.boxes[i].height);
				}
			} else {

				if(values.boxes[i].type === 'stroke'){

					values.ctx.strokeStyle = values.boxes[i].color;
					values.ctx.strokeRect(values.boxes[i].x, values.boxes[i].y, values.boxes[i].width, values.boxes[i].height);
				} else {
					values.ctx.fillStyle = values.boxes[i].color;
					values.ctx.fillRect(values.boxes[i].x, values.boxes[i].y, values.boxes[i].width, values.boxes[i].height);
				}
			}

			var dir = collision(values.player, values.boxes[i]);

			if (dir === "l" || dir === "r") {
				values.player.velX = 0;
				values.player.jumping = false;
			} else if (dir === "b") {
				values.player.grounded = true;
				values.player.jumping = false;
				// want to move along with object but it sucks
				/*if(values.boxes[i].moving)
					values.player.x = values.boxes[i].x + 20;*/
			} else if (dir === "t") {
				values.player.velY *= -1;

			}
		}
		
		if(values.player.grounded){
			 values.player.velY = 0;
		}
		
		values.player.x += values.player.velX;
		values.player.y += values.player.velY;

		// player
		values.ctx.fill();
		values.ctx.fillStyle = "#3261AB";
		values.ctx.fillRect(values.player.x, values.player.y, values.player.width, values.player.height);


		if(values.animating)
			requestAnimationFrame(update);	
	};

	function collision(shapeA, shapeB) {

		// get the vectors to check against
		var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
			vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
			// add the half widths and half heights of the objects
			hWidths = (shapeA.width / 2) + (shapeB.width / 2),
			hHeights = (shapeA.height / 2) + (shapeB.height / 2),
			colDir = null;

		// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
		if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
			// figures out on which side we are colliding (top, bottom, left, or right)
			var oX = hWidths - Math.abs(vX),
				oY = hHeights - Math.abs(vY);

			if (oX >= oY) {
				if (vY > 0) {
					colDir = "t";
					shapeA.y += oY;
				} else {
					colDir = "b";
					shapeA.y -= oY;
				}
			} else {
				if (vX > 0) {
					colDir = "l";
					shapeA.x += oX;
				} else {
					colDir = "r";
					shapeA.x -= oX;
				}
			}

			// scores or death
			if(shapeB.feature == 'point' && !shapeB.done){
				values.startPoint += shapeB.points;
				values.points.innerHTML = values.startPoint;
				shapeB.done = true;
			}

			if(shapeB.feature == 'die')
				die();

			if((shapeB.feature == 'next') ||(shapeA.x == values.width))
				die(values.startPoint);
		}

		return colDir;
	};

	function die(currentScore){
		values.animating = false;

		if(!currentScore){
			document.getElementById('dead').innerHTML = 'You died!';
			values.points.innerHTML = 0;
			values.startPoint = 0;
			currentScore = 0;
		} else 
			document.getElementById('dead').innerHTML = 'Woohoo new points!';

		values.boxes = [];
		shooting = false;
		values.ctx.clear();
		
		setTimeout(function(){
			Gaem.restart(currentScore);
			document.getElementById('dead').innerHTML = '';
		}, 1000);
	};

	function move(shape, speed){
		
		var left = 1,
			limit = values.width,
			limitMultiplier = 1,
			reverse = (shape.feature != 'bullet')? !(+new Date()%2): false;
		
		setInterval(function(){
			var left = (shape.x == 0)? (1, reverse = false): shape.x;

			if(left < limit && !reverse){
				left += 1;
			} else if(shape.feature != 'bullet') {
				left -= 1;
				reverse = true;
			}

			if(shape.feature === 'bullet'){
				for(var o in values.boxes)
					shot(shape, values.boxes[o]);
			}
		
			shape.x = left <= 0? left++: left;
			shape.step = speed;
		}, speed);
	};

	function shoot(){
		var bullet = {   
			x: values.player.x + 12,
			y: values.player.y + 4,
			width: 2,
			height: 2,
			color: '#000000',
			feature: 'bullet',
			type: 'rect',
			alpha: 1,
			idle: true,
			destroy: function(){
				var bulletIndex = values.boxes.indexOf(this);
					
				if(bulletIndex > -1)
					values.boxes.splice(bulletIndex, 1);

				shooting = false;
				this.dead = 1;
			},
			autodestroy: function(){
				setTimeout(function(){
					if(bullet)
						bullet.destroy();
				}, 1800);
			}
		};

		if(!shooting){
			values.boxes.push(bullet);
			move(bullet, 1);
			shooting = true;
			bullet.autodestroy();
		}
	};

	function shot(shapeA, shapeB){
		if(shapeB.feature != 'bullet' && !shapeB.dead && !shapeA.dead && shapeB.feature != 'next'){
			var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
				vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
				
				hWidths = (shapeA.width / 2) + (shapeB.width / 2),
				hHeights = (shapeA.height / 2) + (shapeB.height / 2),
				colDir = null;

			

			if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
				if (vX > 0) {
					shapeB.alpha = .2;
					shapeB.dead = 20;
					values.startPoint = parseInt(values.startPoint + 100);
					values.points.innerHTML = values.startPoint;

					shapeA.destroy();
				}
			}
		}
	};

	return {
		start: start
	}

})();