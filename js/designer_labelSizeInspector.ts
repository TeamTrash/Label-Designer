module bo {
	export class labelSizeInspector {
		constructor(private designer: labelDesigner, private canvas: HTMLElement) {
			this.canvas = canvas;
			this.canvasElement = $(canvas);
			this.designer = designer;
			var self = this;

			this.inspectorWindow = this.buildInspectorWindow(designer, canvas, this.canvasElement);
			this.toolsViewContainer = this.buildToolsViewContainer(this.inspectorWindow);
			this.buttonView = this.buildButtonView(this.toolsViewContainer);
		}

		private canvasElement: JQuery;
		private inspectorWindow: JQuery;
		private toolsViewContainer: JQuery;
		private buttonView: JQuery

		updatePosition(xchange:number) {
			this.inspectorWindow.css("width", parseInt(this.inspectorWindow.css("width")) + xchange);
		}

		update(activeElement) {
		}

		addTool(controller) {
			this.buttonView.append(controller.workspace);
		}

		private buildInspectorWindow(designer: labelDesigner, canvas: HTMLElement, canvasElement: JQuery): JQuery {
			return $('<div></div>')
				.addClass("designerUtilityToolbar designerUtilityLabelSizeInspector")
				.css({
					"left": designer.toolbar.boundingBox.left,
					"top": canvas.getBoundingClientRect().top - 50,
					"width": designer.propertyInspector.boundingBox.right - designer.toolbar.boundingBox.left
				})
				//.draggable({handle: "div.designerPropertyTitle"})
				.insertAfter(canvasElement);
		}

		private buildToolsViewContainer(inspectorWindow: JQuery): JQuery {
			return $('<div></div>')
				.addClass("designerLabelContent")
				.appendTo(inspectorWindow)
		}

		private buildButtonView(toolsViewContainer: JQuery): JQuery {
			return $('<div></div>').appendTo(toolsViewContainer)
		}
	}
}