module bo.designerTools {
	import point = bo.helpers.point;
	import mathHelper = bo.helpers.mathHelper;

	export class barcodeFactory implements toolFactory {
		constructor() {
			this.button = $("<div></div>").addClass("designerToolbarBarcode designerToolbarButton").attr("title", "Barcode").append($("<div></div>"));
		}

		button: JQuery;
		private counter: number;

		object(x: number, y: number, width: number, height: number): bo.designerTools.tool {
			this.counter = this.counter || 1;
			this.deactivateTool();
			return new barcodeTool(this.counter++, x, y, width, height);
		}

		activate(window:toolsWindow){}

		activateTool():void{
			this.button.addClass("designerToolbarButtonActive");
		}
		deactivateTool():void{
			this.button.removeClass("designerToolbarButtonActive");
		}
	}

	export class barcodeTool implements tool {
		constructor(counter: number, x: number, y: number, width: number, height: number) {
			var width = 100;
			this.canvasHolder = $("<canvas></canvas>").prop("width", "100").prop("height", "1");
			this.name = "Barcode " + counter;
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
					name: "height", text: "height", readonly: false, type: "text"
					, get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; }
				},
				{
					name: "format", text: "format", readonly: false, type: "options"
					, options: ["CODE128B", "CODE128C", "CODE39", "EAN", "UPC", "ITF", "ITF14"]
					, get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value; }
				},
				{
					name: "multiplier", text: "size", readonly: false, type: "options"
					, options: [1, 2, 3]
					, get: function (obj) { return obj.multiplier; }, set: function (obj, value) { obj.multiplier = value; }
				},
				{
					name: "rotation", text: "rotation", readonly: false, type: "options"
					, options: [0, 90, 180, 270]
					, get: function (obj) { return obj.rotation; }, set: function (obj, value) { obj.rotation = value; }
				}
			];
		}


		name: string;
		text: string;
		x: number;
		y: number;
		width: number;
		height: number;
		format: string;
		multiplier: number;
		rotation: number;
		canResize: boolean;
		properties: any;
		canvasHolder: any;

		draw(context: CanvasRenderingContext2D, width?: number, height?: number): void {
			this.canvasHolder.JsBarcode(this.text, { width: this.multiplier, height : this.height, format: this.format, displayValue:false, margin:0});
			var cwidth = this.canvasHolder[0].width;
			var cheight = this.canvasHolder[0].height;
			var ctx = this.canvasHolder[0].getContext('2d');
			this.width = cwidth;

			context.save();
			context.translate(this.x, this.y);
			context.rotate((this.rotation * Math.PI) / 180);

			context.drawImage(this.canvasHolder[0], 0, 0);
			context.restore();
		}

		drawActive(context: CanvasRenderingContext2D): void {
			context.save();

			context.translate(this.x, this.y);
			context.rotate((this.rotation * Math.PI) / 180);

			context.dashedStroke(-5, -5, this.width + 5, this.height + 5, [2, 2]);

			context.restore();
		}

		hitTest(coords: point): boolean {
			var originX = this.x;
			var originY = this.y + this.height / 2;

			var rotation = this.rotation;

			var rotatedTopLeft = mathHelper.rotate(new point(originX, originY), new point(this.x, this.y), rotation);
			var rotatedBottomLeft = mathHelper.rotate(new point(originX, originY), new point(this.x, this.y + this.height), rotation);
			var rotatedTopRight = mathHelper.rotate(new point(originX, originY), new point(this.x + this.width, this.y), rotation);
			var rotatedBottomRight = mathHelper.rotate(new point(originX, originY), new point(this.x + this.width, this.y + this.height), rotation);
			var area = [rotatedTopLeft, rotatedBottomLeft, rotatedBottomRight, rotatedTopRight]
			var hitTest = mathHelper.isPointWithinPolygon(new point(coords.x, coords.y), area)

			return hitTest;
		}
				
        toSerializable(): any {
			return {
				type: "barcodeTool", name: this.name, text: this.text, x: this.x, y: this.y, 
				height: this.height, format: this.format, multiplier: this.multiplier, rotation: this.rotation
			};
		}

        static fromObject(object: any) {
			var result = new barcodeTool(1, object.x, object.y, object.width, object.height);
			result.name = object.name;
			result.text = object.text;
			result.format = object.format;
			result.multiplier = object.multiplier;
			result.rotation = object.rotation;

			return result;
		}
	}
}