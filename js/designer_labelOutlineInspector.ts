module bo {
	export class LabelOutlineInspector {
		private toolsViewContainer: JQuery;

		constructor(private designer: LabelDesigner, private container: JQuery) {
			this.toolsViewContainer = this.buildToolsViewContainer(container);

			this.designer.updating.on((tool) => this.update(tool));
		}


		public update(activeElement: bo.designerTools.Tool) {
			let self = this;

			this.toolsViewContainer.html("");
			for (let element of this.designer.elements) {
				if (element != null) {
					$("<div></div>")
						.addClass("label-inspector-item")
						.append(element === activeElement ? $("<b></b>").html(element.name) : $("<span></span>").html(element.name))
						.on("click", { "item": element }, (event) => {
							self.designer.activeElement = event.data.item;
							self.designer.updateCanvas();
						})
						.appendTo(this.toolsViewContainer);
				}
			}
		}

		private buildToolsViewContainer(container: JQuery) {
			return $("<div></div>").addClass("designerLabelContent").appendTo(container);
		}
	}
}