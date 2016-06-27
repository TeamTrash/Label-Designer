module bo {
	export class labelInspector {
		constructor(private designer: any, private canvas: HTMLElement) {
			var self = this;
			this.canvasElement = $(canvas);
			this.boundingBox = null;

			this.inspectorWindow = this.buildInspectorWindow(canvas);
			this.toolsViewContainer = this.buildToolsViewContainer();
		}

		private inspectorWindow: JQuery;
		private toolsViewContainer: JQuery;
		private canvasElement: JQuery;
		private boundingBox: any;

		updatePosition(xchange) {
			this.inspectorWindow.css("width", parseInt(this.inspectorWindow.css("width")) + xchange);
			this.boundingBox = this.inspectorWindow[0].getBoundingClientRect();
		}

		update(activeElement: any) {
			this.toolsViewContainer.html('');
			for (var element of this.designer.elements) {
				if (element != null) {
					$('<div></div>').html(element.name).appendTo(this.toolsViewContainer);
				}
			}
		}

		private buildInspectorWindow(canvas:any){
			return $('<div></div>')
				.addClass("designerUtilityToolbar designerUtilityLabelInspector")
				.css({
					"left": this.canvas.getBoundingClientRect().left - 90,
					"top": this.canvas.getBoundingClientRect().top + 350
				})
				//.draggable({handle: "div.designerPropertyTitle"})
				.insertAfter(this.canvasElement);
		}

		private buildToolsViewContainer(){
			return $('<div></div>').addClass("designerLabelContent").appendTo(this.inspectorWindow);
		}
	}
}