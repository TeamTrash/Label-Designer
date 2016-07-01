module bo.helpers {

	export class loadSaveControl {
		constructor(public designer: labelDesigner) {
			var self = this;
			this.workspace = this.buildWorkspace();
			this.loadController = this.buildLoadController(designer);
			this.saveController = this.buildSaveController(designer);
			this.fileInput = this.buildFileInput(designer);
		}

		private workspace: JQuery;
		private loadController: JQuery;
		private saveController: JQuery;
		private fileInput: JQuery;

		private buildWorkspace(): JQuery {
			return $("<div></div>").addClass("designerLabelControl").attr("title", "Label Load/Save");
		}

		private buildWidthContainer(): JQuery {
			return $("<div>Width: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
		}

		private buildSaveController(designer: labelDesigner): JQuery {
			var container = $("<div></div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
			return $("<button><i class='fa fa-save'></i></button>")
				.addClass("designerLabelControlElement designerLabelActionElement")
				.appendTo(container)
				.on("click", () => {
					window.saveAs(new File([designer.saveToJson()], "label.json"))
				});
		}

		private buildLoadController(designer: labelDesigner): JQuery {
			var self = this;
			var container = $("<div></div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
			return $("<button><i class='fa fa-folder-open-o'></i></button>")
				.addClass("designerLabelControlElement designerLabelActionElement")
				.appendTo(container)
				.on("click", () => {
					this.fileInput.trigger("click");
				});
		}

		private buildFileInput(designer: labelDesigner): JQuery {
			return $("<input type=\"file\" />").css({ width: 400 })
				.on("change", () => {
					var input = this.fileInput[0] as any;
					if (input.files[0]) {
						var file = input.files[0];
						var reader = new FileReader();
						reader.onloadend = () => {
							designer.loadFromJson(reader.result);
						}
						reader.readAsText(file);
					}
				})
		}
	}
}