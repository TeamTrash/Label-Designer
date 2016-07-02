var bo;
(function (bo) {
    var labelSizeInspector = (function () {
        function labelSizeInspector(designer, canvas) {
            this.designer = designer;
            this.canvas = canvas;
            this.canvas = canvas;
            this.canvasElement = $(canvas);
            this.designer = designer;
            var self = this;
            this.boundingBox = null;
            this.inspectorWindow = this.buildInspectorWindow(designer, canvas, this.canvasElement);
            this.toolsViewContainer = this.buildToolsViewContainer(this.inspectorWindow);
            this.buttonView = this.buildButtonView(this.toolsViewContainer);
        }
        labelSizeInspector.prototype.updatePosition = function (xchange) {
            this.inspectorWindow.css("width", parseInt(this.inspectorWindow.css("width")) + xchange);
            this.boundingBox = this.inspectorWindow[0].getBoundingClientRect();
        };
        labelSizeInspector.prototype.update = function (activeElement) {
        };
        labelSizeInspector.prototype.addTool = function (controller) {
            this.buttonView.append(controller.workspace);
        };
        labelSizeInspector.prototype.buildInspectorWindow = function (designer, canvas, canvasElement) {
            return $('<div></div>')
                .addClass("designerUtilityToolbar designerUtilityLabelSizeInspector")
                .css({
                "left": designer.toolbar.boundingBox.left,
                "top": canvas.getBoundingClientRect().top - 50,
                "width": designer.propertyInspector.boundingBox.right - designer.toolbar.boundingBox.left
            })
                .insertAfter(canvasElement);
        };
        labelSizeInspector.prototype.buildToolsViewContainer = function (inspectorWindow) {
            return $('<div></div>')
                .addClass("designerLabelContent")
                .appendTo(inspectorWindow);
        };
        labelSizeInspector.prototype.buildButtonView = function (toolsViewContainer) {
            return $('<div></div>').appendTo(toolsViewContainer);
        };
        return labelSizeInspector;
    }());
    bo.labelSizeInspector = labelSizeInspector;
})(bo || (bo = {}));
//# sourceMappingURL=designer_labelSizeInspector.js.map