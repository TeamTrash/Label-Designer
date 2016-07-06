module bo.helpers {

	export class LoadSaveControl {
		private workspace: JQuery;
		private loadController: JQuery;
		private saveController: JQuery;
		private fileInput: JQuery;

		constructor(public designer: LabelDesigner) {
			this.workspace = this.buildWorkspace();
			this.loadController = this.buildLoadController(designer);
			this.saveController = this.buildSaveController(designer);
			this.fileInput = this.buildFileInput(designer);
		}

		private buildWorkspace(): JQuery {
			return $("<div></div>").addClass("label-toolbar-group").attr("title", "Label Load/Save");
		}

		private buildSaveController(designer: LabelDesigner): JQuery {
			let container = $("<div></div>").addClass("label-size-element").appendTo(this.workspace);
			return $("<button><span class='glyphicon glyphicon-floppy-disk'></span></button>")
				.addClass("btn btn-default")
				.appendTo(container)
				.on("click", (e) => {
					e.preventDefault();
					window.saveAs(new File([designer.saveToJson()], "label.json"));
				});
		}

		private buildLoadController(designer: LabelDesigner): JQuery {
			let container = $("<div></div>").addClass("label-size-element").appendTo(this.workspace);
			return $("<button><span class='glyphicon glyphicon-folder-open'></span></button>")
				.addClass("btn btn-default")
				.appendTo(container)
				.on("click", (e) => {
					e.preventDefault();
					this.fileInput.trigger("click");
				});
		}

		private buildFileInput(designer: LabelDesigner): JQuery {
			return $("<input type=\"file\" />")
				.on("change", () => {
					let input = this.fileInput[0] as any;
					if (input.files[0]) {
						let file = input.files[0];
						let reader = new FileReader();
						reader.onloadend = () => {
							designer.loadFromJson(reader.result);
						};
						reader.readAsText(file);
					}
				});
		}
	}
}
