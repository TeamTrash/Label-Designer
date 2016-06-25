if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.designerTools)
	com.logicpartners.designerTools = {};
	
com.logicpartners.designerTools.barcode = function() {
	var self = this;
	this.counter = 1;
	this.button = $("<div></div>").addClass("designerToolbarBarcode designerToolbarButton").attr("title", "Barcode").append($("<div></div>"));
	this.object = function(x, y, width, height) {
		var width = 100;
		var canvasHolder = $("<canvas></canvas>").prop("width", "100").prop("height", "1");
		this.name = "Barcode " + self.counter++;
		this.text = "BARCODE";
		this.x = x;
		this.y = y;
		this.height = 100;
		this.format = "CODE128";
		this.multiplier = 2;
		this.rotation = 0;
		this.canResize = true;
		
		this.properties = [
			{
				name: "name", text: "name", readonly: false, type:"text"
				, get: function(obj){return obj.name;}, set: function (obj, value) {obj.name = value;}
			},
			{
				name: "text", text: "text", readonly: false, type:"text"
				, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value }
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
				name: "height", text: "height", readonly: false, type:"text"
				, get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value;  }
			},
			{
				name: "format", text: "format", readonly: false, type: "options"
				, options: ["CODE128B", "CODE128C", "CODE39", "EAN", "UPC", "ITF", "ITF14"]
				, get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value;  }
			},
			{
				name: "multiplier", text: "size", readonly: false, type: "options"
				, options: [1,2,3]
				, get: function (obj) { return obj.multiplier; }, set: function (obj, value) { obj.multiplier = value;  }
			},
			{
				name: "rotation", text: "rotation", readonly: false, type: "options"	
				, options: [0,90,180,270]
				, get: function (obj) { return obj.rotation; }, set: function (obj, value) { obj.rotation = value;  }
			}			
		];

		this.draw = function(context) {
			canvasHolder.JsBarcode(this.text, { width: this.multiplier, height : 1, format: this.format});
			var cwidth = canvasHolder[0].width;
			var cheight = canvasHolder[0].height;
			var ctx = canvasHolder[0].getContext('2d');
			this.width = cwidth;

			context.save();
			context.translate(parseInt(this.x), parseInt(this.y));
			context.rotate((this.rotation*Math.PI) / 180);

			var cData = ctx.getImageData(0, 0, cwidth, cheight);
			
			for (var i = 0; i < cwidth; i++) {
				if (cData.data[i * 4 + 3] == 255) { // Black (barcode = black or white)
					// Draw a black rectangle at this point.
					context.fillRect(i, 0, 1, this.height);
				}
			}

			context.restore();
		}
		
		this.setWidth = function(width) {
			//this.width = width;
		}
		
		this.getWidth = function() {
			return width;
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

		this.setFormat = function(format) {
			this.format = format;
		}

		this.getFormat = function() {
			return this.format;
		}

		this.setMultiplier = function(multiplier) {
			this.multiplier = multiplier;
		}

		this.getMultiplier = function(){
			return multiplier;
		}

		this.setRotation = function(angle) {
			this.rotation = angle;
		}

		this.getRotation = function() {
			return this.rotation;
		}

		this.drawActive = function(context) {
			context.save();

			context.translate(parseInt(this.x), parseInt(this.y));
			context.rotate((this.rotation*Math.PI) / 180);
			
			context.dashedStroke(1, 1, parseInt(this.width) - 1, parseInt(this.height) - 1, [2, 2]);

			context.restore();
		}

		this.hitTest = function(coords) {
			var helper = new com.logicpartners.labelControl.helper();
			var originX = parseInt(this.x);
			var originY = parseInt(this.y);

			rotation =  this.rotation;

			var rotatedTopLeft = helper.rotate(originX, originY, this.x, this.y, rotation);
			var rotatedBottomLeft = helper.rotate(originX, originY, this.x, this.y + this.height, rotation);
			var rotatedTopRight =  helper.rotate(originX, originY, this.x + this.width, this.y, rotation);
			var rotatedBottomRight =  helper.rotate(originX, originY, this.x + this.width, this.y + this.height, rotation);

			hitTest = helper.isPointWithinPolygon(coords.x, coords.y, [rotatedTopLeft, rotatedBottomLeft, rotatedBottomRight, rotatedTopRight])

			return hitTest;
		}
	}
};