module bo.helpers {
	
	export class sizeControl {
		constructor(public designer: labelDesigner) {
			var self = this;
			this.workspace = this.buildWorkspace();
			this.widthContainer = this.buildWidthContainer();
			this.widthController = this.buildWidthController(this.widthContainer, designer);
			this.heightContainer = this.buildHeightContainer();
			this.heightController = this.buildHeightController(this.heightContainer, designer);
			this.dpiContainer = this.buildDpiContainer();
			this.dpiController = this.buildDpiController(this.dpiContainer, designer);
		}

		private workspace: JQuery;
		private widthContainer: JQuery;
		private widthController: JQuery;
		private heightContainer: JQuery;
		private heightController: JQuery;
		private dpiContainer: JQuery;
		private dpiController: JQuery;

		private buildWorkspace(): JQuery {
			return $("<div></div>").addClass("designerLabelControl").attr("title", "Label Size");
		}

		private buildWidthContainer(): JQuery {
			return $("<div>Width: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
		}

		private buildWidthController(widthContainer: JQuery, designer: any): JQuery {
			var self = this;

			return $("<input type=\"text\" />")
				.addClass("designerLabelControlElement")
				.css({ width: "50px" })
				.val(designer.labelWidth / designer.dpi)
				.appendTo(widthContainer)
				.on("blur", () => self.updateDesigner())
				.on("keypress", (e) => {
					if (e.which == 13) {
						e.preventDefault();
						self.updateDesigner();
					}
				});
		}

		private buildHeightContainer(): JQuery {
			return $("<div>Height: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
		}

		private buildHeightController(heightContainer: JQuery, designer: any): JQuery {
			var self = this;
			return $("<input type=\"text\" />")
				.addClass("designerLabelControlElement")
				.css({ width: "50px" })
				.val(designer.labelHeight / designer.dpi)
				.appendTo(heightContainer)
				.on("blur", () => self.updateDesigner())
				.on("keypress", (e) => {
					if (e.which == 13) {
						e.preventDefault();
						self.updateDesigner();
					}
				});
		}

		private buildDpiContainer() {
			return $("<div>DPI: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
		}

		private buildDpiController(dpiContainer: JQuery, designer: any) {
			var self = this;
			return $("<input type=\"text\" />")
				.addClass("designerLabelControlElement")
				.css({ width: "50px" })
				.val(designer.dpi)
				.appendTo(dpiContainer)
				.on("blur", () => self.updateDesigner())
				.on("keypress", (e) => {
					if (e.which == 13) {
						e.preventDefault();
						self.updateDesigner();
					}
				});
		}

		private updateDesigner() {
			var dpi = this.designer.dpi;

			if (!isNaN(this.dpiController.val())) dpi = this.dpiController.val();
			this.designer.dpi = dpi;

			var width = this.designer.labelWidth / this.designer.dpi;
			var height = this.designer.labelHeight / this.designer.dpi;

			if (!isNaN(this.widthController.val())) width = this.widthController.val();
			if (!isNaN(this.heightController.val())) height = this.heightController.val();

			this.designer.updateLabelSize(width, height);
			this.widthController.val(width);
			this.heightController.val(height);
		}

		public update() {
			this.widthController.val(this.designer.labelWidth / this.designer.dpi);
			this.heightController.val(this.designer.labelHeight / this.designer.dpi);
		}
	}
}