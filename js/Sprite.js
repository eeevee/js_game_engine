var Sprite = function(width, height) 
{
	DisplayObject.call(this, width, height);

	var _originalWidth = width;
	var _originalHeight = height;
	var _collisionManager = new CollisionManager(this);
	this.tweenGroup = new TweenGroup(this);
	this.image;

	this.boxCollides = function(target) {
		return _collisionManager.boxCollides(target);
	};

	this.pointCollides = function(point) {
		return _collisionManager.pointCollides(point);
	};

	this.pixelPerfectCollides = function(target) {
		return _collisionManager.pixelPerfectCollides(target);
	};

	this.generatePixelMap = function(source, resolution) {
		if (!resolution) resolution = 5;
		if (!source) source = this;
		
		var map = [];
		for (var y = 0; y < source.height; y += resolution) {
			for (var x = 0; x < source.width; x += resolution) {
				var rowOffset = y + "_" + x;
				var pixel = surface.context.getImageData(x, y, resolution, resolution);
				var pixelData = pixel.data;
				map[rowOffset] = {x: x, y: y, pixelData: pixelData};
			}
		}
		return map;
	};

	//GETTERS
	this.getScaleX = function() {
		return this.width / _originalWidth;
	};

	this.getScaleY = function() {
		return this.height / _originalHeight;
	};

	//SETTERS
	this.setScaleX = function(value) {
		this.width = _originalWidth * value;
	};

	this.setScaleY = function(value) {
		this.height = _originalHeight * value;
	};
};
