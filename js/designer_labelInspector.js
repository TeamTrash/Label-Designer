var bo;
(function (bo) {
    var labelInspector = (function () {
        function labelInspector(designer, canvas) {
            this.designer = designer;
            this.canvas = canvas;
            var self = this;
            this.canvasElement = $(canvas);
            this.boundingBox = null;
            this.inspectorWindow = this.buildInspectorWindow(canvas);
            this.toolsViewContainer = this.buildToolsViewContainer();
        }
        labelInspector.prototype.updatePosition = function (xchange) {
            this.inspectorWindow.css("width", parseInt(this.inspectorWindow.css("width")) + xchange);
            this.boundingBox = this.inspectorWindow[0].getBoundingClientRect();
        };
        labelInspector.prototype.update = function (activeElement) {
            this.toolsViewContainer.html('');
            for (var _i = 0, _a = this.designer.elements; _i < _a.length; _i++) {
                var element = _a[_i];
                if (element != null) {
                    $('<div></div>').html(element.name).appendTo(this.toolsViewContainer);
                }
            }
        };
        labelInspector.prototype.buildInspectorWindow = function (canvas) {
            return $('<div></div>')
                .addClass("designerUtilityToolbar designerUtilityLabelInspector")
                .css({
                "left": this.canvas.getBoundingClientRect().left - 90,
                "top": this.canvas.getBoundingClientRect().top + 350
            })
                .insertAfter(this.canvasElement);
        };
        labelInspector.prototype.buildToolsViewContainer = function () {
            return $('<div></div>').addClass("designerLabelContent").appendTo(this.inspectorWindow);
        };
        return labelInspector;
    }());
    bo.labelInspector = labelInspector;
})(bo || (bo = {}));
//# sourceMappingURL=designer_labelInspector.js.map