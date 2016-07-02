var bo;
(function (bo) {
    var helpers;
    (function (helpers) {
        var sizeControl = (function () {
            function sizeControl(designer) {
                this.designer = designer;
                var self = this;
                this.workspace = this.buildWorkspace();
                this.widthContainer = this.buildWidthContainer();
                this.widthController = this.buildWidthController(this.widthContainer, designer);
                this.heightContainer = this.buildHeightContainer();
                this.heightController = this.buildHeightController(this.heightContainer, designer);
                this.dpiContainer = this.buildDpiContainer();
                this.dpiController = this.buildDpiController(this.dpiContainer, designer);
            }
            sizeControl.prototype.buildWorkspace = function () {
                return $("<div></div>").addClass("designerLabelControl").attr("title", "Label Size");
            };
            sizeControl.prototype.buildWidthContainer = function () {
                return $("<div>Width: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
            };
            sizeControl.prototype.buildWidthController = function (widthContainer, designer) {
                var self = this;
                return $("<input type=\"text\" />")
                    .addClass("designerLabelControlElement")
                    .css({ width: "50px" })
                    .val(designer.labelWidth / designer.dpi)
                    .appendTo(widthContainer)
                    .on("blur", function () { return self.updateDesigner(); })
                    .on("keypress", function (e) {
                    if (e.which == 13) {
                        e.preventDefault();
                        self.updateDesigner();
                    }
                });
            };
            sizeControl.prototype.buildHeightContainer = function () {
                return $("<div>Height: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
            };
            sizeControl.prototype.buildHeightController = function (heightContainer, designer) {
                var self = this;
                return $("<input type=\"text\" />")
                    .addClass("designerLabelControlElement")
                    .css({ width: "50px" })
                    .val(designer.labelHeight / designer.dpi)
                    .appendTo(heightContainer)
                    .on("blur", function () { return self.updateDesigner(); })
                    .on("keypress", function (e) {
                    if (e.which == 13) {
                        e.preventDefault();
                        self.updateDesigner();
                    }
                });
            };
            sizeControl.prototype.buildDpiContainer = function () {
                return $("<div>DPI: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
            };
            sizeControl.prototype.buildDpiController = function (dpiContainer, designer) {
                var self = this;
                return $("<input type=\"text\" />")
                    .addClass("designerLabelControlElement")
                    .css({ width: "50px" })
                    .val(designer.dpi)
                    .appendTo(dpiContainer)
                    .on("blur", function () { return self.updateDesigner(); })
                    .on("keypress", function (e) {
                    if (e.which == 13) {
                        e.preventDefault();
                        self.updateDesigner();
                    }
                });
            };
            sizeControl.prototype.updateDesigner = function () {
                var dpi = this.designer.dpi;
                if (!isNaN(this.dpiController.val()))
                    dpi = this.dpiController.val();
                this.designer.dpi = dpi;
                var width = this.designer.labelWidth / this.designer.dpi;
                var height = this.designer.labelHeight / this.designer.dpi;
                if (!isNaN(this.widthController.val()))
                    width = this.widthController.val();
                if (!isNaN(this.heightController.val()))
                    height = this.heightController.val();
                this.designer.updateLabelSize(width, height);
                this.widthController.val(width);
                this.heightController.val(height);
            };
            sizeControl.prototype.update = function () {
                this.widthController.val(this.designer.labelWidth / this.designer.dpi);
                this.heightController.val(this.designer.labelHeight / this.designer.dpi);
            };
            return sizeControl;
        }());
        helpers.sizeControl = sizeControl;
    })(helpers = bo.helpers || (bo.helpers = {}));
})(bo || (bo = {}));
//# sourceMappingURL=sizeControl.js.map