module bo {
	export class LabelSizeInspector {
		private buttonView: JQuery;

		constructor(private designer: LabelDesigner, private container: JQuery) {
			this.buttonView = this.buildButtonView(container);
		}

		public update(activeElement) { }

		public addTool(controller) {
			this.buttonView.append(controller.workspace);
		}

		private buildButtonView(container: JQuery): JQuery {
			let top = $("<nav></nav>")
				.addClass("navbar navbar-default")
				.appendTo(container);
			let fluid = $("<div></div>").addClass("container-fluid").appendTo(top);
			$("<div></div>").addClass("navbar-header")
				.append($("<span></span>").addClass("navbar-brand").html("Label Designer"))
				.appendTo(fluid);
			let navbar = $("<div></div>")
				.addClass("collapse navbar-collapse")
				.appendTo(fluid);
			let form = $("<form></form>").addClass("navbar-form").appendTo(navbar);

			return form;
		}
	}
}