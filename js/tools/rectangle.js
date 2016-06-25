if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.designerTools)
	com.logicpartners.designerTools = {};
	
com.logicpartners.designerTools.rectangle = function() {
	var self = this;
	this.counter = 1;
	this.button = $("<div></div>").addClass("designerToolbarRectangle designerToolbarButton").attr("title", "Rectangle").append($("<div></div>"));
	this.object =  function(x, y, width, height) {
		this.name = "Rectangle " + self.counter++;
		this.x = x;
		this.y = y;
		this.width = width > 30 ? width : 30;
		this.height = height > 30 ? height : 30;
		this.rotation = 0;
		this.canResize = true;

		this.properties = [
			{
				name: "name", text: "name", readonly: false, type:"text"
				, get: function(obj){return obj.name;}, set: function (obj, value) {obj.name = value;}
			},
			{
				name: "x", text: "x", readonly: false, type:"number"
				, get: function (obj) { return obj.x; }, set: function (obj, value) { obj.x = value }
			},
			{
				name: "y", text: "y", readonly: false, type:"number"
				, get: function (obj) { return obj.y; }, set: function (obj, value) { obj.y = value }
			},
			{
				name: "width", text: "width", readonly: false, type:"text"
				, get: function (obj) { return obj.width; }, set: function (obj, value) { obj.width = value;  }
			},
			{
				name: "height", text: "height", readonly: false, type:"text"
				, get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value;  }
			}		
		];

		this.draw = function(context) {
			context.fillRect(this.x, this.y, this.width, this.height);
		}
		
		this.setWidth = function(width) {
			this.width = parseInt(width);
		}
		
		this.getWidth = function() {
			return this.width;
		}
		
		this.setHeight = function(height) {
			this.height = height;
		}
		
		this.getHeight = function() {
			return this.height;
		}

		this.setHandle = function(coords) {
			this.handle = this.resizeZone(coords);
		}

		this.getHandle = function() {
			return this.handle;
		}

		this.setRotation = function(angle) {
			this.rotation = angle;
		}

		this.getRotation = function() {
			return this.rotation;
		}

		this.drawActive = function(context) {
			context.dashedStroke(parseInt(this.x + 1), parseInt(this.y + 1), parseInt(this.x) + parseInt(this.width) - 1, parseInt(this.y) + parseInt(this.height) - 1, [2, 2]);
		}

		this.hitTest = function(coords) {
			return (coords.x >= parseInt(this.x) && coords.x <= parseInt(this.x) + parseInt(this.width) && coords.y >= parseInt(this.y) && coords.y <= parseInt(this.y) + parseInt(this.height));
		}
	}
}