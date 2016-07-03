module bo {
	export class labelInspector {
		constructor(private designer: labelDesigner, private canvas: HTMLElement) {
			var self = this;
			this.canvasElement = $(canvas);

			this.inspectorWindow = this.buildInspectorWindow(canvas);
			this.toolsViewContainer = this.buildToolsViewContainer();

			this.designer.updating.on((tool) => this.update(tool));
		}

		private inspectorWindow: JQuery;
		private toolsViewContainer: JQuery;
		private canvasElement: JQuery;

		updatePosition(xchange) {
			this.inspectorWindow.css("width", parseInt(this.inspectorWindow.css("width")) + xchange);
		}

		update(activeElement: bo.designerTools.tool) {
			var self = this;

			this.toolsViewContainer.html('');
			for (var element of this.designer.elements) {
				if (element != null) {
					$('<div></div>')
						.addClass("label-inspector-item")
						.append(element == activeElement ? $("<b></b>").html(element.name) : $("<span></span>").html(element.name))
						.on("click", { "item": element }, (event) => {
							self.designer.activeElement = event.data.item;
							self.designer.updateCanvas();
						})
						.appendTo(this.toolsViewContainer);
				}
			}
		}

		private buildInspectorWindow(canvas: HTMLElement) {
			return $('<div></div>')
				.addClass("designerUtilityToolbar designerUtilityLabelInspector")
				.css({
					"left": this.canvas.getBoundingClientRect().left - 90,
					"top": this.canvas.getBoundingClientRect().top + 350
				})
				//.draggable({handle: "div.designerPropertyTitle"})
				.insertAfter(this.canvasElement);
		}

		private buildToolsViewContainer() {
			return $('<div></div>').addClass("designerLabelContent").appendTo(this.inspectorWindow);
		}
	}
}