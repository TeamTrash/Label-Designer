module bo {
	export class toolsWindow {
		constructor(public designer: labelDesigner, private canvas: HTMLElement) {
			this.canvasElement = $(canvas);
			this.boundingBox = null;

			this.toolsWindow = this.buildToolsWindow(canvas, this.canvasElement);
			this.toolsViewContainer = this.buildToolsViewContainer(this.toolsWindow);
			this.buttonView = this.buildButtomView(this.toolsViewContainer);

			this.updatePosition(0);
		}

		boundingBox: any;

		private toolsWindow: JQuery;
		private toolsViewContainer: JQuery;
		private canvasElement: JQuery;
		private buttonView: JQuery;

		setTool(controller:bo.designerTools.toolFactory) {
			if (this.designer.newObjectController == controller) {
				this.designer.setNewObject(null);
				controller.deactivateTool();
			}
			else {
				if (this.designer.newObjectController) this.designer.newObjectController.deactivateTool;
				this.designer.setNewObject(controller);
				if (controller) {
					controller.activateTool();

					if (controller.activate) controller.activate(this);
				}
			}
		};

		addTool(controller:any) {
			var self = this;
			controller.button.on("click", { tool: controller }, function (event) {
				self.setTool(event.data.tool);
			});

			this.buttonView.append(controller.button);
		}

		updatePosition(xchange:number) {
			this.boundingBox = this.toolsWindow[0].getBoundingClientRect();
		}

		update(activeElement:any) { }

		private buildToolsWindow(canvas: HTMLElement, canvasElement: JQuery): JQuery {
			return $('<div></div>')
				.addClass("designerUtilityToolbar")
				.css({
					"left": canvas.getBoundingClientRect().left - 90,
					"top": canvas.getBoundingClientRect().top
				})
				.insertAfter(this.canvasElement);
		}

		private buildToolsViewContainer(toolsWindow: JQuery): JQuery {
			return $('<div></div>')
				.addClass("designerToolbarContent")
				.appendTo(toolsWindow);
		}

		private buildButtomView(toolsViewContainer: JQuery): JQuery {
			return $('<div></div>').appendTo(toolsViewContainer);
		}
	}
}