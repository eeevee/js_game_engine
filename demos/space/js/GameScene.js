var GameScene = function(name)
{
	Scene.call(this, name);

	var hero = new Wizard(16, 16,  core.assets['../img/wizard_evil_no_bg.png']);
	hero.x = core.gameWidth / 2 - hero.width / 2;
	hero.y = core.gameHeight - hero.height;
	this.addChild(hero);

	var enemies = [];
	for (var x = 0; x < 8; x++) {
		for (var y = 0; y < 3; y++) {
			var enemy = new Sprite(16,16);
			enemy.image = core.assets['../img/wizard_evil_no_bg.png'];
			enemy.x = 18 * x + 80;
			enemy.y = 18 * y + 10
			this.addChild(enemy);
			enemy.tweenGroup.moveTo(enemy.x + 50, enemy.y, 30).moveTo(enemy.x - 50, enemy.y, 30).setLoop(true);
			enemies.push(enemy);
		}
	}

	var scoreLabel = new TextField('score: 0', 'Arial', 12, 'black', 'left');
	scoreLabel.x = 10;
	scoreLabel.y = 20;
	var score = 0;
	this.addChild(scoreLabel);

	var bullets = [];

	this.frameHandler = function(e) {
		if(Keyboard.pressedKeys[Keyboard.KEY_CODES['Right']]) {
			if (hero.x < surface.canvas.width - hero.width) {
				hero.x += 5;
			}
		}

		if(Keyboard.pressedKeys[Keyboard.KEY_CODES['Left']]) {
			if (hero.x > 0) {
				hero.x -= 5;
			}
		}

		if(Keyboard.pressedKeys[Keyboard.KEY_CODES['Space']]) {
			if (bullets.length < 1) {
				var knife = new Knife(16, 16,  core.assets['../img/knife.png']);
				knife.x = hero.x + hero.width / 2;
				knife.y = hero.y - 5;
				this.addChild(knife);
				bullets.push(knife);
			}
		}

		//collision checks
		for (var i = 0; i < bullets.length; i++) {
			var bullet = bullets[i];
			//bullet out of screen
			if (bullet.y < -10) {
				this.removeChildAt(this.childs.indexOf(bullet));
				bullets.splice(bullets.indexOf(bullet), 1);
				continue;
			}
			bullet.y -= bullet.velocity;
			for (var j = 0; j < enemies.length; j++) {
				var wiz2 = enemies[j];
				//bullet collide with enemy
				if (bullet.boxCollides(wiz2, false)) {
  				console.log('colidiu');
  				enemies.splice(enemies.indexOf(wiz2), 1);
  				this.removeChildAt(this.childs.indexOf(wiz2));
  				bullets.splice(bullets.indexOf(bullet), 1);
  				this.removeChildAt(this.childs.indexOf(bullet));
  				score += 1;
  				scoreLabel.text = 'score: ' + score;
  				// all enemies destroyed, end game screen
  				/*
  				if (score == 24) {
  					var scene = new Scene('End game');
  					scene.addChild(scoreLabel);
  					scoreLabel.fontSize = 30;
  					scoreLabel.x = 80;
  					scoreLabel.y = 150;
  					game.addScene(scene);
  					game.changeScene('End game');
  				}
  				*/
  				break;
				}
			}
		}
	};

	this.addEventListener('enterframe', this.frameHandler.bind(this));
};