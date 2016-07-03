module bo {
	export class propertyInspector {
		constructor(private designer: labelDesigner, private canvas: HTMLElement) {
			this.canvasElement = $(canvas);
			this.activeElement = null;
			this.propertyNodes = {};
			this.boundingBox = null;

			this.propertyInspector = this.buildPropertyInspector(canvas, this.canvasElement);
			this.propertyViewContainer = this.buildPropertyViewContainer(this.propertyInspector);
			this.titleBar = this.buildTitleBar(this.propertyViewContainer);
			this.propertyView = this.buildPropertyView(this.propertyViewContainer);

			this.designer.updating.on((tool) => this.update(tool));

			this.updatePosition(0);
		}

		boundingBox: any;

		private canvasElement: JQuery;
		private activeElement: bo.designerTools.tool;
		private propertyNodes: any;
		private propertyInspector: JQuery;
		private titleBar: JQuery;
		private propertyView: JQuery;
		private propertyViewContainer: JQuery;

		updatePosition(xchange: number) {
			this.propertyInspector.css("left", parseInt(this.propertyInspector.css("left")) + xchange);
			this.boundingBox = this.propertyInspector[0].getBoundingClientRect();
		}


		update(activeElement) {
			var self = this;

			var same = this.activeElement == activeElement;

			this.activeElement = activeElement;

			if (this.activeElement == null) return;

			if (same) {
				for (var item of activeElement.properties) {
					if (!item.readonly) {
						this.propertyNodes[item.name].val(item.get(activeElement));
					}
				}
			}
			else {
				this.propertyView.html('');

				var table = $("<table>");
				$("<thead><tr><th>key</th><th>value</th><td></thead>").appendTo(table);
				var tBody = $("<tbody>").appendTo(table);

				for (var item of activeElement.properties) {
					var row = $("<tr></tr>");

					var editor: JQuery = null;
					if (item.type == "text" || item.type == "number") {
						var editor = $(`<input type='text' name='${item.name}'' value='${item.get(activeElement)}'>`);
					}
					else if (item.type == "options") {
						var editor = $(`<select name='${item.name}'' value='${item.get(activeElement)}'>`);
						for (var option of item.options) {
							editor.append($(`<option value='${option}'>${option}</option>`))
						}
					}

					if (!item.readonly) {
						editor.on("change", { "objectProperty": item.name }, function (event) {
							var data = self.activeElement[event.data.objectProperty];
							self.activeElement[event.data.objectProperty] = (data === parseInt(data, 10)) ? parseInt($(this).val()) : $(this).val();
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

		private buildPropertyViewContainer(propertyInspector: JQuery): JQuery {
			return $('<div></div>')
				.addClass("designerPropertyContainer")
				.appendTo(propertyInspector);
		}

		private buildPropertyInspector(canvas: HTMLElement, canvasElement: JQuery) {
			return $('<div></div>')
				.addClass("designerUtilityWindow")
				.css({
					"left": this.canvas.getBoundingClientRect().right + 5,
					"top": this.canvas.getBoundingClientRect().top
				})
				.insertAfter(this.canvasElement);
		}

		private buildTitleBar(propertyViewContainer: JQuery): JQuery {
			return $('<div>Property Inspector</div>')
				.addClass("designerPropertyTitle")
				.prependTo(this.propertyInspector)
				.on("dblclick", function () {
					propertyViewContainer.toggle();
				});
		}

		private buildPropertyView(propertyViewContainer: JQuery): JQuery {
			return $('<div></div>')
				.addClass("designerPropertyContent")
				.appendTo(propertyViewContainer);;
		}
	}
}