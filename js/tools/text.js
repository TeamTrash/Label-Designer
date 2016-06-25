if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.designerTools)
	com.logicpartners.designerTools = {};

com.logicpartners.designerTools.text = function () {
	var self = this;
	this.counter = 1;
	this.button = $("<div></div>").addClass("designerToolbarText designerToolbarButton").attr("title", "Text").append($("<div></div>"));
	this.object = function (x, y, width, height) {
		this.name = "Textbox " + self.counter++;
		this.text = this.name;
		this.x = x;
		this.y = y;
		this.fontSize = 36;
		this.fontType = "Arial";
		this.width = 100;
		this.height = 0;
		this.rotation = 0;
		this.canResize = false;

		this.properties = [
			{
				name: "name", text: "name", readonly: false, type: "text" 
				, get: function(obj){return obj.name;}, set: function (obj, value) {obj.name = value;}
			},
			{
				name: "text", text: "text", readonly: false, type: "text"
				, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value }
			},
			{
				name: "x", text: "x", readonly: false, type: "number"
				, get: function (obj) { return obj.x; }, set: function (obj, value) { obj.x = value }
			},
			{
				name: "y", text: "y", readonly: false, type: "number"
				, get: function (obj) { return obj.y; }, set: function (obj, value) { obj.y = value }
			},
			{
				name: "fontSize", text: "font size", readonly: false, type: "options", options: [10,20,30,40,50,60]
				, get: function (obj) { return obj.fontSize; }, set: function (obj, value) { obj.fontSize = value }
			},
			{
				name: "rotation", text: "rotation", readonly: false, type: "options", options: [0,90,180,270]
				, get: function (obj) { return obj.rotation; }, set: function (obj, value) { obj.rotation = value;  }
			}			
		];

		this.getFontHeight = function () {
			var textMeasure = $("<div></div>").css({
				"font-size": this.fontSize + "px",
				"font-family": this.fontType,
				"opacity": 0,
			}).text("M").appendTo($("body"));

			var height = textMeasure.outerHeight();
			textMeasure.remove();
			return height;
		}

		this.draw = function (context) {
			context.font = this.fontSize + "px " + this.fontType;
			var oColor = context.fillStyle;
			context.fillStyle = "white";
			this.height = this.getFontHeight();
			var measuredText = context.measureText(this.text);
			this.width = measuredText.width;
			context.globalCompositeOperation = "difference";
			context.save();
			context.translate(parseInt(this.x), parseInt(this.y) + (this.height / 2));
			context.rotate((this.rotation * Math.PI) / 180);
			context.fillText(this.text, 0, 0 + (this.height * 0.75) - (this.height / 2));
			context.restore();
			context.globalCompositeOperation = "source-over";
			context.fillStyle = oColor;
		}

		this.setWidth = function (width) {
			//this.width = width;
		}

		this.getWidth = function () {
			return this.width;
		}

		this.setHeight = function (height) {
			//height = height;
		}

		this.getHeight = function () {
			return this.height * 0.75;
		}

		this.setRotation = function (angle) {
			this.rotation = angle;
		}

		this.getRotation = function () {
			return this.rotation;
		}

		this.drawActive = function (context) {
			context.save();

			context.translate(parseInt(this.x), parseInt(this.y) + this.height / 2);
			context.rotate((this.rotation * Math.PI) / 180);

			context.dashedStroke(1, 1 - (this.height / 2), parseInt(this.width) - 1, parseInt(this.height * 0.9) - (this.height / 2) - 1, [2, 2]);

			context.restore();
		}

		this.hitTest = function (coords) {
			var helper = new com.logicpartners.labelControl.helper();
			var originX = parseInt(this.x);
			var originY = parseInt(this.y) + this.height / 2;

			rotation = this.rotation;

			var rotatedTopLeft = helper.rotate(originX, originY, this.x, this.y, rotation);
			var rotatedBottomLeft = helper.rotate(originX, originY, this.x, this.y + this.height, rotation);
			var rotatedTopRight = helper.rotate(originX, originY, this.x + this.width, this.y, rotation);
			var rotatedBottomRight = helper.rotate(originX, originY, this.x + this.width, this.y + this.height, rotation);

			hitTest = helper.isPointWithinPolygon(coords.x, coords.y, [rotatedTopLeft, rotatedBottomLeft, rotatedBottomRight, rotatedTopRight])

			return hitTest;
		}
	}
}