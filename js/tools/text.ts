module bo.designerTools {
	import point = bo.helpers.point;
	import mathHelper = bo.helpers.mathHelper;

	export class textFactory implements toolFactory {
		constructor() {
			this.button = $("<div></div>").addClass("designerToolbarText designerToolbarButton").attr("title", "Text").append($("<div></div>"));
		}

		button: JQuery;
		private counter: number;

		object(x: number, y: number, width: number, height: number): bo.designerTools.tool {
			this.counter = this.counter || 1;
			return new textTool(this.counter++, x, y, width, height);
		}
	}

	export class textTool implements tool {
		constructor(counter: number, x: number, y: number, width: number, height: number) {
			this.name = `Textbox ${counter}`;
			this.text = this.name;
			this.x = x;
			this.y = y;
			this.fontSize = 30;
			this.fontType = "Arial";
			this.width = 100;
			this.height = 0;
			this.rotation = 0;
			this.canResize = true;

			this.properties = [
				{
					name: "name", text: "name", readonly: false, type: "text"
					, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; }
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
					name: "fontSize", text: "font size", readonly: false, type: "options", options: [10, 20, 30, 40, 50, 60]
					, get: function (obj) { return obj.fontSize; }, set: function (obj, value) { obj.fontSize = value }
				},
				{
					name: "rotation", text: "rotation", readonly: false, type: "options", options: [0, 90, 180, 270]
					, get: function (obj) { return obj.rotation; }, set: function (obj, value) { obj.rotation = value; }
				}
			];
		}

		name: string;
		text: string;
		x: number;
		y: number;
		fontSize: number;
		fontType: string;
		width: number;
		height: number;
		rotation: number;
		canResize: boolean;
		properties: any;

		getFontHeight(): number {
			var textMeasure = $("<div></div>").css({
				"font-size": this.fontSize + "px",
				"font-family": this.fontType,
				"opacity": 0,
			}).text("M").appendTo($("body"));

			var height = textMeasure.outerHeight();
			textMeasure.remove();

			return height;
		}

		draw(context: any, width?: number, height?: number): void {
			context.font = this.fontSize + "px " + this.fontType;
			var oColor = context.fillStyle;
			context.fillStyle = "white";
			this.height = this.getFontHeight();
			var measuredText = context.measureText(this.text);
			this.width = measuredText.width;
			context.globalCompositeOperation = "difference";
			context.save();
			context.translate(this.x, this.y + (this.height / 2));
			context.rotate((this.rotation * Math.PI) / 180);
			context.fillText(this.text, 0, 0 + (this.height * 0.75) - (this.height / 2));
			context.restore();
			context.globalCompositeOperation = "source-over";
			context.fillStyle = oColor;
		}

		drawActive(context): void {
			context.save();

			context.translate(this.x, this.y + this.height / 2);
			context.rotate((this.rotation * Math.PI) / 180);

			context.dashedStroke(-5, -5 - (this.height / 2), this.width + 5, (this.height * 0.9) - (this.height / 2) + 5, [2, 2]);

			context.restore();
		}

		hitTest(coords): boolean {
			var originX = this.x;
			var originY = this.y + this.height / 2;

			var rotation = this.rotation;

			var rotatedTopLeft = mathHelper.rotate(new point(originX, originY), new point(this.x, this.y), rotation);
			var rotatedBottomLeft = mathHelper.rotate(new point(originX, originY), new point(this.x, this.y + this.height), rotation);
			var rotatedTopRight = mathHelper.rotate(new point(originX, originY), new point(this.x + this.width, this.y), rotation);
			var rotatedBottomRight = mathHelper.rotate(new point(originX, originY), new point(this.x + this.width, this.y + this.height), rotation);
			var area = [rotatedTopLeft, rotatedBottomLeft, rotatedBottomRight, rotatedTopRight]
			var hitTest = bo.helpers.mathHelper.isPointWithinPolygon(new point(coords.x, coords.y), area)

			return hitTest;
		}

        toSerializable(): any {
			return {
				type: "textTool", name: this.name, text: this.text, x: this.x, y: this.y, fontSize: this.fontSize,
				fontType: this.fontType, width: this.width, height: this.height, rotation: this.rotation
			};
		}

        static fromObject(object: any) {
			var result = new textTool(1, object.x, object.y, object.width, object.height);
			result.name = object.name;
			result.text = object.text;
			result.fontSize = object.fontSize;
			result.fontType = object.fontType;
			result.rotation = object.rotation;

			return result;
		}
	}
}