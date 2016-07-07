var bo;
(function (bo) {
    var ToolsWindow = (function () {
        function ToolsWindow(designer, container) {
            this.designer = designer;
            this.container = container;
            this.buttonView = this.buildButtomView(container);
        }
        ToolsWindow.prototype.setTool = function (controller) {
            if (this.designer.newObjectController === controller) {
                this.designer.setNewObject(null);
                controller.deactivateTool();
            }
            else {
                if (this.designer.newObjectController) {
                    this.designer.newObjectController.deactivateTool();
                }
                this.designer.setNewObject(controller);
                if (controller) {
                    controller.activateTool();
                    if (controller.activate) {
                        controller.activate(this);
                    }
                }
            }
        };
        ;
        ToolsWindow.prototype.addTool = function (controller) {
            var self = this;
            controller.button.on("click", { tool: controller }, function (event) {
                self.setTool(event.data.tool);
            });
            this.buttonView.append(controller.button);
        };
        ToolsWindow.prototype.update = function (activeElement) { };
        ToolsWindow.prototype.buildButtomView = function (container) {
            return $("<div></div>").appendTo(container);
        };
        return ToolsWindow;
    }());
    bo.ToolsWindow = ToolsWindow;
})(bo || (bo = {}));
//# sourceMappingURL=designer_toolbar.js.map