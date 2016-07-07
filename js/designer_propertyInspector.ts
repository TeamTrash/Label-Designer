module bo {
	export class PropertyInspector {
		private activeElement: bo.designerTools.Tool;
		private propertyNodes: any;
		private propertyView: JQuery;

		constructor(private designer: LabelDesigner, private container: JQuery) {
			this.activeElement = null;
			this.propertyNodes = {};

			this.propertyView = this.buildPropertyView(container);

			this.designer.updating.on((tool) => this.update(tool));
		}

		public update(activeElement) {
			let self = this;

			let same = this.activeElement === activeElement;

			this.activeElement = activeElement;

			if (this.activeElement == null) { return; }

			if (same) {
				for (let item of activeElement.properties) {
					if (!item.readonly) {
						this.propertyNodes[item.name].val(item.get(activeElement));
					}
				}
			} else {
				this.propertyView.html("");

				let table = $("<table>").addClass("table table-responsive table-striped");
				$("<thead><tr><th>key</th><th>value</th><td></thead>").appendTo(table);
				$("<tbody>").appendTo(table);

				for (let item of activeElement.properties) {
					let row = $("<tr></tr>");

					let editor: JQuery = null;
					if (item.type === "text" || item.type === "number") {
						editor = $(`<input class='form-control' type='text' name='${item.name}'' value='${item.get(activeElement)}'>`);
					} else if (item.type === "options") {
						editor = $(`<select class='form-control' name='${item.name}'' value='${item.get(activeElement)}'>`);
						for (let option of item.options) {
							editor.append($(`<option value='${option}'>${option}</option>`));
						}
					}

					if (!item.readonly) {
						editor.on("change", { "objectProperty": item.name }, function (event) {
							let data = self.activeElement[event.data.objectProperty];
							self.activeElement[event.data.objectProperty] = (data === parseInt(data, 10)) ? parseInt($(this).val(), 10) : $(this).val();
							self.designer.updateCanvas();
						});
					}

					row.append($(`<td>${item.text}</td>`))
						.append($(`<td></td>`).append(editor))
						.appendTo(table);

					this.propertyNodes[item.name] = editor;
				}

				this.propertyView.append(table);
			}
		}

		private buildPropertyView(container: JQuery): JQuery {
			return $("<div></div>")
				.appendTo(container);
		}
	}
}
