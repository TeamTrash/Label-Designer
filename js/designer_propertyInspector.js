if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};

com.logicpartners.propertyInspector = function (designer, canvas) {
	this.canvas = canvas;
	this.canvasElement = $(canvas);
	this.labelDesigner = designer;
	this.activeElement = null;
	this.propertyNodes = {};
	this.boundingBox = null;
	var self = this;

	// Create the property window.
	this.propertyInspector = $('<div></div>')
		.addClass("designerUtilityWindow")
		.css({
			"left": this.canvas.getBoundingClientRect().right + 5,
			"top": this.canvas.getBoundingClientRect().top
		})
		//.draggable({handle: "div.designerPropertyTitle"})
		.insertAfter(this.canvasElement);

	this.updatePosition = function (xchange) {
		this.propertyInspector.css("left", parseInt(this.propertyInspector.css("left")) + xchange);
		this.boundingBox = this.propertyInspector[0].getBoundingClientRect();
	}


	this.propertyViewContainer = $('<div></div>')
		.addClass("designerPropertyContainer")
		.resizable({
			resize: function (event, ui) {
				ui.size.width = ui.originalSize.width;
			}
		})
		.appendTo(this.propertyInspector);

	this.titleBar = $('<div>Property Inspector</div>')
		.addClass("designerPropertyTitle")
		.prependTo(this.propertyInspector)
		.on("dblclick", function () {
			self.propertyViewContainer.toggle();
		});

	this.propertyView = $('<div></div>')
		.addClass("designerPropertyContent")
		.appendTo(this.propertyViewContainer);

	this.update = function (activeElement) {
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

				var editor = null;
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
						self.labelDesigner.updateCanvas();
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

	this.updatePosition(0);
}