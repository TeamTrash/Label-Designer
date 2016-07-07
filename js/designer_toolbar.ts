module bo {
	export class ToolsWindow {
		private buttonView: JQuery;

		constructor(public designer: LabelDesigner, private container: JQuery) {
			this.buttonView = this.buildButtomView(container);
		}

		public setTool(controller: bo.designerTools.ToolFactory) {
			if (this.designer.newObjectController === controller) {
				this.designer.setNewObject(null);
				controller.deactivateTool();
			} else {
				if (this.designer.newObjectController) { this.designer.newObjectController.deactivateTool(); }
				this.designer.setNewObject(controller);
				if (controller) {
					controller.activateTool();

					if (controller.activate) { controller.activate(this); }
				}
			}
		};

		public addTool(controller: any) {
			let self = this;
			controller.button.on("click", { tool: controller }, function (event) {
				self.setTool(event.data.tool);
			});

			this.buttonView.append(controller.button);
		}

		public update(activeElement: any) { }

		private buildButtomView(container: JQuery): JQuery {
			return $("<div></div>").appendTo(container);
		}
	}
}
