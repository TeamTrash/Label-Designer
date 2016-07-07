var bo;
(function (bo) {
    var LabelOutlineInspector = (function () {
        function LabelOutlineInspector(designer, container) {
            var _this = this;
            this.designer = designer;
            this.container = container;
            this.toolsViewContainer = this.buildToolsViewContainer(container);
            this.designer.updating.on(function (tool) { return _this.update(tool); });
        }
        LabelOutlineInspector.prototype.update = function (activeElement) {
            var self = this;
            this.toolsViewContainer.html("");
            for (var _i = 0, _a = this.designer.elements; _i < _a.length; _i++) {
                var element = _a[_i];
                if (element != null) {
                    $("<div></div>")
                        .addClass("label-inspector-item")
                        .append(element === activeElement ? $("<b></b>").html(element.name) : $("<span></span>").html(element.name))
                        .on("click", { "item": element }, function (event) {
                        self.designer.activeElement = event.data.item;
                        self.designer.updateCanvas();
                    })
                        .appendTo(this.toolsViewContainer);
                }
            }
        };
        LabelOutlineInspector.prototype.buildToolsViewContainer = function (container) {
            return $("<div></div>").addClass("designerLabelContent").appendTo(container);
        };
        return LabelOutlineInspector;
    }());
    bo.LabelOutlineInspector = LabelOutlineInspector;
})(bo || (bo = {}));
//# sourceMappingURL=designer_labelOutlineInspector.js.map