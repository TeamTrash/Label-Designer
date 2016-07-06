module bo.designerTools {
	import Point = bo.helpers.Point;
	import MathHelper = bo.helpers.MathHelper;

	export class TextFactory implements ToolFactory {
		private button: JQuery;
		private counter: number;

		constructor() {
			this.button = $("<button></button>").append($("<span></span>").addClass("glyphicon glyphicon-font"));
		}

		public object(x: number, y: number, width: number, height: number): Tool {
			this.counter = this.counter || 1;

			return new TextTool(this.counter++, x, y, width, height);
		}

		public activate(window: ToolsWindow) { }

		public activateTool(): void {
			this.button.addClass("active");
		}

		public deactivateTool(): void {
			this.button.removeClass("active");
		}
	}

	export class TextTool implements Tool {
		public name: string;
		public text: string;
		public x: number;
		public y: number;
		public fontSize: number;
		public fontType: string;
		public width: number;
		public height: number;
		public rotation: number;
		public canResize: boolean;
		public properties: any;

        public static fromObject(object: any) {
			let result = new TextTool(1, object.x, object.y, object.width, object.height);
			result.name = object.name;
			result.text = object.text;
			result.fontSize = object.fontSize;
			result.fontType = object.fontType;
			result.rotation = object.rotation;

			return result;
		}

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

		public getFontHeight(): number {
			let textMeasure = $("<div></div>").css({
				"font-size": this.fontSize + "px",
				"font-family": this.fontType,
				"opacity": 0,
			}).text("M").appendTo($("body"));

			let height = textMeasure.outerHeight();
			textMeasure.remove();

			return height;
		}

		public draw(context: any, width?: number, height?: number): void {
			context.font = this.fontSize + "px " + this.fontType;
			let oColor = context.fillStyle;
			context.fillStyle = "white";
			this.height = this.getFontHeight();
			let measuredText = context.measureText(this.text);
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

		public drawActive(context): void {
			context.save();

			context.translate(this.x, this.y + this.height / 2);
			context.rotate((this.rotation * Math.PI) / 180);

			context.dashedStroke(-5, -5 - (this.height / 2), this.width + 5, (this.height * 0.9) - (this.height / 2) + 5, [2, 2]);

			context.restore();
		}

		public hitTest(coords: Point): boolean {
			let originX = this.x;
			let originY = this.y + this.height / 2;

			let rotation = this.rotation;

			let rotatedTopLeft = MathHelper.rotate(new Point(originX, originY), new Point(this.x, this.y), rotation);
			let rotatedBottomLeft = MathHelper.rotate(new Point(originX, originY), new Point(this.x, this.y + this.height), rotation);
			let rotatedTopRight = MathHelper.rotate(new Point(originX, originY), new Point(this.x + this.width, this.y), rotation);
			let rotatedBottomRight = MathHelper.rotate(new Point(originX, originY), new Point(this.x + this.width, this.y + this.height), rotation);
			let area = [rotatedTopLeft, rotatedBottomLeft, rotatedBottomRight, rotatedTopRight]
			let hitTest = bo.helpers.MathHelper.isPointWithinPolygon(new Point(coords.x, coords.y), area)

			return hitTest;
		}

        public toSerializable(): any {
			return {
				fontSize: this.fontSize, fontType: this.fontType, height: this.height, name: this.name, rotation: this.rotation,
				text: this.text, type: "textTool", width: this.width, x: this.x, y: this.y,
			};
		}
	}
}
