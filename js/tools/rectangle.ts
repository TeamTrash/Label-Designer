module bo.designerTools {
	import Point = bo.helpers.Point;

	export class RectangleFactory implements ToolFactory {
		private button: JQuery;
		private counter: number;

		constructor() {
			this.button = $("<button></button>").append($("<span></span>").addClass("glyphicon glyphicon-stop"));
		}

		public object(x: number, y: number, width: number, height: number): Tool {
			this.counter = this.counter || 1;

			return new RectangleTool(this.counter++, x, y, width, height);
		}

		public activate(window: ToolsWindow) { }

		public activateTool(): void {
			this.button.addClass("active");
		}

		public deactivateTool(): void {
			this.button.removeClass("active");
		}
	}

	export class RectangleTool implements Tool {
		public name: string;
		public x: number;
		public y: number;
		public width: number;
		public height: number;
		public rotation: number;
		public canResize: boolean;
		public properties: any;

        public static fromObject(object: any) {
			let result = new RectangleTool(1, object.x, object.y, object.width, object.height);
			result.name = object.name;

			return result;
		}

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
					, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; },
				},
				{
					name: "x", text: "x", readonly: false, type: "number"
					, get: function (obj) { return obj.x; }, set: function (obj, value) { obj.x = value; },
				},
				{
					name: "y", text: "y", readonly: false, type: "number"
					, get: function (obj) { return obj.y; }, set: function (obj, value) { obj.y = value; },
				},
				{
					name: "width", text: "width", readonly: false, type: "text"
					, get: function (obj) { return obj.width; }, set: function (obj, value) { obj.width = value; },
				},
				{
					name: "height", text: "height", readonly: false, type: "text"
					, get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; },
				},
			];
		}

		public draw(context: any, width?: number, height?: number) {
			context.fillRect(this.x, this.y, this.width, this.height);
		}

		public drawActive(context: any): void {
			context.dashedStroke(this.x - 5, this.y - 5, this.x + this.width + 5, this.y + this.height + 5, [2, 2]);
		}

		public hitTest(coords: Point): boolean {
			return (coords.x >= this.x && coords.x <= this.x + this.width && coords.y >= this.y && coords.y <= this.y + this.height);
		}

        public toSerializable(): any {
			return {
				height: this.height, name: this.name, type: "rectangleTool", width: this.width, x: this.x, y: this.y,
			};
		}
	}
}
