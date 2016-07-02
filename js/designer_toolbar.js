var bo;
(function (bo) {
    var toolsWindow = (function () {
        function toolsWindow(designer, canvas) {
            this.designer = designer;
            this.canvas = canvas;
            this.canvasElement = $(canvas);
            this.boundingBox = null;
            this.toolsWindow = this.buildToolsWindow(canvas, this.canvasElement);
            this.toolsViewContainer = this.buildToolsViewContainer(this.toolsWindow);
            this.buttonView = this.buildButtomView(this.toolsViewContainer);
            this.updatePosition(0);
        }
        toolsWindow.prototype.setTool = function (controller) {
            if (this.designer.newObjectController == controller) {
                this.designer.setNewObject(null);
                controller.button.removeClass("designerToolbarButtonActive");
            }
            else {
                if (this.designer.newObjectController)
                    this.designer.newObjectController.button.removeClass("designerToolbarButtonActive");
                this.designer.setNewObject(controller);
                if (controller) {
                    controller.button.addClass("designerToolbarButtonActive");
                    if (controller.activate)
                        controller.activate(this);
                }
            }
        };
        ;
        toolsWindow.prototype.addTool = function (controller) {
            var self = this;
            controller.button.on("click", { tool: controller }, function (event) {
                self.setTool(event.data.tool);
            });
            this.buttonView.append(controller.button);
        };
        toolsWindow.prototype.updatePosition = function (xchange) {
            this.boundingBox = this.toolsWindow[0].getBoundingClientRect();
        };
        toolsWindow.prototype.update = function (activeElement) { };
        toolsWindow.prototype.buildToolsWindow = function (canvas, canvasElement) {
            return $('<div></div>')
                .addClass("designerUtilityToolbar")
                .css({
                "left": canvas.getBoundingClientRect().left - 90,
                "top": canvas.getBoundingClientRect().top
            })
                .insertAfter(this.canvasElement);
        };
        toolsWindow.prototype.buildToolsViewContainer = function (toolsWindow) {
            return $('<div></div>')
                .addClass("designerToolbarContent")
                .appendTo(toolsWindow);
        };
        toolsWindow.prototype.buildButtomView = function (toolsViewContainer) {
            return $('<div></div>').appendTo(toolsViewContainer);
        };
        return toolsWindow;
    }());
    bo.toolsWindow = toolsWindow;
})(bo || (bo = {}));
//# sourceMappingURL=designer_toolbar.js.map