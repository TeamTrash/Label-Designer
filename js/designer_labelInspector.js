if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};

com.logicpartners.labelInspector = function (designer, canvas) {
	this.canvas = canvas;
	this.canvasElement = $(canvas);
	this.labelDesigner = designer;
	var self = this;
	this.boundingBox = null;

	this.updatePosition = function (xchange) {
		this.inspectorWindow.css("width", parseInt(this.inspectorWindow.css("width")) + xchange);
		this.boundingBox = this.inspectorWindow[0].getBoundingClientRect();
	}

	// Create the property window.
	this.inspectorWindow = $('<div></div>')
		.addClass("designerUtilityToolbar designerUtilityLabelInspector")
		.css({
			"left": this.canvas.getBoundingClientRect().left - 90,
			"top": this.canvas.getBoundingClientRect().top + 350
		})
		//.draggable({handle: "div.designerPropertyTitle"})
		.insertAfter(this.canvasElement);


	this.toolsViewContainer = $('<div></div>')
		.addClass("designerLabelContent")
		.appendTo(this.inspectorWindow);

	this.update = function (activeElement) {
		this.toolsViewContainer.html('');
		for (element of this.labelDesigner.elements) {
			if (element != null) {
				$('<div></div>').html(element.name).appendTo(this.toolsViewContainer);
			}
		}
	}
}