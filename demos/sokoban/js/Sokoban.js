var Maps = {
	map1:  [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
			[1, 5, 0, 0, 1, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 9, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
};

var TileMap = function(map, tileWidth, tileHeight, scene)
{
	this.hero = null;
	this.positionIncrement = 16;

	var keyboardHandler = function(e) {
		if (Keyboard.pressedKeys[Keyboard.KEY_CODES['Left']]) {
			if (canMove(this.hero, 'left')) {
				var nextTile = getNextTileByDirection(this.hero, 'left');
				if (nextTile.type == 3) {
					moveItem(nextTile, 'left');
				}
				this.hero.x -= this.positionIncrement;
			}
		} else if (Keyboard.pressedKeys[Keyboard.KEY_CODES['Right']]) {
			if (canMove(this.hero, 'right')) {
				var nextTile = getNextTileByDirection(this.hero, 'right');
				if (nextTile.type == 3) {
					moveItem(nextTile, 'right');
				}
				this.hero.x += this.positionIncrement;
			}
		} else if (Keyboard.pressedKeys[Keyboard.KEY_CODES['Up']]) {
			if (canMove(this.hero, 'up')) {
				var nextTile = getNextTileByDirection(this.hero, 'up');
				if (nextTile.type == 3) {
					moveItem(nextTile, 'up');
				}
				this.hero.y -= this.positionIncrement;
			}
		} else if (Keyboard.pressedKeys[Keyboard.KEY_CODES['Down']]) {
			if (canMove(this.hero, 'down')) {
				var nextTile = getNextTileByDirection(this.hero, 'down');
				if (nextTile.type == 3) {
					moveItem(nextTile, 'down');
				}
				this.hero.y += this.positionIncrement;
			}
		}
	};

	var getNextTileByDirection = function(target, direction) {
		var pt = getNextPointByDirection(target, direction);
		if (pt.col < 0 || pt.row < 0 || pt.col >= map.length || pt.row >= map[0].length) return;
		return map[pt.col][pt.row];
	};

	var getNextPointByDirection = function(target, direction) {
		var row = null;
		var col = null;
		if (direction == 'left') {
			row = Math.floor((target.x - tileWidth) / tileWidth);
			col = Math.floor((target.y) / tileWidth);
		} else if (direction == 'right') {
			row = Math.floor((target.x + tileWidth) / tileWidth);
			col = Math.floor((target.y) / tileWidth);
		} else if (direction == 'up') {
			row = Math.floor((target.x) / tileWidth);
			col = Math.floor((target.y - tileHeight) / tileWidth);
		} else if (direction == 'down') {
			row = Math.floor((target.x) / tileWidth);
			col = Math.floor((target.y + tileHeight) / tileWidth);
		}

		return {col: col, row: row};
	};

	var getTargetPoint = function(target) {
		return {col: Math.floor(target.y / tileWidth), row: Math.floor(target.x / tileWidth)};
	};

	var canMove = function(target, direction) {
		var nextTile = getNextTileByDirection(target, direction);
		var nextNextTile = getNextTileByDirection(nextTile, direction);
		if (nextTile.type == 1 || nextTile.type == 6) return false;
		if (nextTile.type == 3 && (nextNextTile.type == 1 || nextNextTile.type == 3 || nextNextTile.type == 6)) return false;
		return true;
	};

	var moveItem = function(target, direction) {
		var nextNextTile = getNextTileByDirection(target, direction);
		var dummy = {x: target.x, y: target.y, type: 0};
		var pt = getTargetPoint(target, direction);
		//get the box coordinates
		var newPt = getNextPointByDirection(target, direction);
		if (nextNextTile.type == 5) {
			//remove item and opened box sprites
			scene.removeChildAt(scene.getChildIndex(target));
			scene.removeChildAt(scene.getChildIndex(nextNextTile));
			//create a chest closed sprite
			s = new Sprite(tileWidth, tileHeight, core.assets['img/chest_closed.png']);
			s.x = newPt.row * tileWidth;
			s.y = newPt.col * tileHeight;
			scene.addChild(s);
			s.type = 6;
			//add the closed chest to map
			map[newPt.col][newPt.row] = s;
		} else {
			//move the item
			target.x = newPt.row * tileWidth;
			target.y = newPt.col * tileHeight;
			map[newPt.col][newPt.row] = target;
		}
		//clear the old item position
		map[pt.col][pt.row] = dummy;
	};

	this.load = function(map, tileWidth, tileHeight, scene) {
		for (var y = 0; y < map.length; y++) {
			for (var x = 0; x < map[y].length; x++) {
				if (map[y][x] == 1) {
					var s = new Sprite(tileWidth, tileHeight, core.assets['img/wall.png']);
					s.x = x * tileWidth;
					s.y = y * tileHeight;
					scene.addChild(s);
					s.type = 1;
					map[y][x] = s;
				} else if (map[y][x] == 9) {
					var s = new Sprite(tileWidth, tileHeight, core.assets['img/wizard.png']);
					s.x = x * tileWidth;
					s.y = y * tileHeight;
					scene.addChild(s);
					this.hero = s;
					s.type = 9;
					map[y][x] = s;
				} else if (map[y][x] == 5) {
					var s = new Sprite(tileWidth, tileHeight, core.assets['img/chest_opened.png']);
					s.x = x * tileWidth;
					s.y = y * tileHeight;
					scene.addChild(s);
					s.type = 5;
					map[y][x] = s;
				} else if (map[y][x] == 3) {
					var s = new Sprite(tileWidth, tileHeight, core.assets['img/knife.png']);
					s.x = x * tileWidth;
					s.y = y * tileHeight;
					scene.addChild(s);
					s.type = 3;
					map[y][x] = s;
				} else {
					var s = {x: x * tileWidth, y: y * tileHeight, type: 0};
					map[y][x] = s;
				}
			}
		}
	};

	this.startHeroMovement = function() {
		core.addEventListener('enterframe', keyboardHandler.bind(this));
	};
	
	this.load(map, tileWidth, tileHeight, scene);
};