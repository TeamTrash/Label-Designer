module bo.helpers {

	export class SizeControl {
		private workspace: JQuery;
		private widthInput: JQuery;
		private widthController: JQuery;
		private heightInput: JQuery;
		private heightController: JQuery;
		private dpiInput: JQuery;
		private dpiController: JQuery;

		constructor(public designer: LabelDesigner) {
			this.workspace = this.buildWorkspace();
			this.buildWidthController(designer);
			this.buildHeightController(designer);
			this.buildDpiController(designer);
		}

		public update() {
			this.widthInput.val(this.designer.labelWidth / this.designer.dpi);
			this.heightInput.val(this.designer.labelHeight / this.designer.dpi);
		}

		private buildWorkspace(): JQuery {
			return $("<div></div>").addClass("label-toolbar-group").attr("title", "Label Size");
		}

		private buildWidthController(designer: any): void {
			let self = this;

			this.widthInput = $("<input type=\"text\" class=\"form-control\" />")
				.css({ width: "50px" })
				.val(designer.labelWidth / designer.dpi)
				.on("blur", () => self.updateDesigner())
				.on("keypress", (e) => {
					if (e.which === 13) {
						e.preventDefault();
						self.updateDesigner();
					}
				});

			this.widthController = $("<div></div>").addClass("label-size-element")
				.append($("<div></div>").addClass("input-group")
					.append($("<span></span>").addClass("input-group-addon").html("width: "))
					.append(this.widthInput))
				.appendTo(this.workspace);
		}

		private buildHeightController(designer: any): void {
			let self = this;

			this.heightInput = $("<input type=\"text\" class=\"form-control\" />")
				.css({ width: "50px" })
				.val(designer.labelHeight / designer.dpi)
				.on("blur", () => self.updateDesigner())
				.on("keypress", (e) => {
					if (e.which === 13) {
						e.preventDefault();
						self.updateDesigner();
					}
				});

			this.heightController = $("<div></div>").addClass("label-size-element")
				.append($("<div></div>").addClass("input-group")
					.append($("<span></span>").addClass("input-group-addon").html("height: "))
					.append(this.heightInput))
				.appendTo(this.workspace);
		}

		private buildDpiController(designer: any) {
			let self = this;

			this.dpiInput = $("<input type=\"text\" class=\"form-control\" />")
				.css({ width: "50px" })
				.val(designer.dpi)
				.on("blur", () => self.updateDesigner())
				.on("keypress", (e) => {
					if (e.which === 13) {
						e.preventDefault();
						self.updateDesigner();
					}
				});

			this.dpiController = $("<div></div>").addClass("label-size-element")
				.append($("<div></div>").addClass("input-group")
					.append($("<span></span>").addClass("input-group-addon").html("dpi: "))
					.append(this.dpiInput))
				.appendTo(this.workspace);
		}

		private updateDesigner() {
			let dpi = this.designer.dpi;

			if (!isNaN(this.dpiInput.val())) { dpi = this.dpiInput.val(); };
			this.designer.dpi = dpi;

			let width = this.designer.labelWidth / this.designer.dpi;
			let height = this.designer.labelHeight / this.designer.dpi;

			if (!isNaN(this.widthInput.val())) { width = this.widthInput.val(); };
			if (!isNaN(this.heightInput.val())) { height = this.heightInput.val(); };

			this.designer.updateLabelSize(width, height);
			this.widthController.val(width);
			this.heightController.val(height);
		}
	}
}
