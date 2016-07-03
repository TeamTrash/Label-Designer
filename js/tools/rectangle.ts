module bo.designerTools {
	import point = bo.helpers.point;

	export class rectangleFactory implements toolFactory {
		constructor() {
			this.button = $("<div></div>").addClass("designerToolbarRectangle designerToolbarButton").attr("title", "Rectangle").append($("<div></div>"));
		}

		private button: JQuery;
		private counter: number;

		object(x: number, y: number, width: number, height: number): bo.designerTools.tool {
			this.counter = this.counter || 1;
			this.button.removeClass("designerToolbarButtonActive");

			return new rectangleTool(this.counter++, x, y, width, height);
		}

		activate(window:toolsWindow){}
		
		activateTool():void{
			this.button.addClass("designerToolbarButtonActive");
		}
		
		deactivateTool():void{
			this.button.removeClass("designerToolbarButtonActive");
		}
	}

	export class rectangleTool implements tool {
		constructor(counter: number, x: number, y: number, width: number, height: number) {
			this.name = "Rectangle " + counter;
			this.x = x;
			this.y = y;
			this.width = width > 30 ? width : 30;
			this.height = height > 30 ? height : 30;
			this.rotation = 0;
			this.canResize = true;

			this.properties = [
				{
					name: "name", text: "name", readonly: false, type: "text"
					, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; }
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
					name: "width", text: "width", readonly: false, type: "text"
					, get: function (obj) { return obj.width; }, set: function (obj, value) { obj.width = value; }
				},
				{
					name: "height", text: "height", readonly: false, type: "text"
					, get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; }
				}
			];
		}

		name: string;
		x: number;
		y: number;
		width: number;
		height: number;
		rotation: number;
		canResize: boolean;
		properties: any;

		draw(context: any, width?: number, height?: number) {
			context.fillRect(this.x, this.y, this.width, this.height);
		}

		drawActive(context: any): void {
			context.dashedStroke(this.x - 5, this.y - 5, this.x + this.width + 5, this.y + this.height + 5, [2, 2]);
		}

		hitTest(coords: point): boolean {
			return (coords.x >= this.x && coords.x <= this.x + this.width && coords.y >= this.y && coords.y <= this.y + this.height);
		}

        toSerializable(): any {
			return {
				type: "rectangleTool", name: this.name, x: this.x, y: this.y, width: this.width,
				height: this.height
			};
		}

        static fromObject(object: any) {
			var result = new rectangleTool(1, object.x, object.y, object.width, object.height);
			result.name = object.name;

			return result;
		}
	}
}