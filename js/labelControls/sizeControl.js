var bo;
(function (bo) {
    var helpers;
    (function (helpers) {
        var SizeControl = (function () {
            function SizeControl(designer) {
                this.designer = designer;
                this.workspace = this.buildWorkspace();
                this.buildWidthController(designer);
                this.buildHeightController(designer);
                this.buildDpiController(designer);
            }
            SizeControl.prototype.update = function () {
                this.widthInput.val(this.designer.labelWidth / this.designer.dpi);
                this.heightInput.val(this.designer.labelHeight / this.designer.dpi);
            };
            SizeControl.prototype.buildWorkspace = function () {
                return $("<div></div>").addClass("label-toolbar-group").attr("title", "Label Size");
            };
            SizeControl.prototype.buildWidthController = function (designer) {
                var self = this;
                this.widthInput = $("<input type=\"text\" class=\"form-control\" />")
                    .css({ width: "50px" })
                    .val(designer.labelWidth / designer.dpi)
                    .on("blur", function () { return self.updateDesigner(); })
                    .on("keypress", function (e) {
                    if (e.which === 13) {
                        e.preventDefault();
                        self.updateDesigner();
                    }
                });
                this.widthController = $("<div></div>").addClass("label-size-element")
                    .append($("<div></div>").addClass("input-group")
                    .append($("<span></span>").addClass("input-group-addon").html("width: "))
                    .append(this.widthInput))
                    .appendTo(this.workspace);
            };
            SizeControl.prototype.buildHeightController = function (designer) {
                var self = this;
                this.heightInput = $("<input type=\"text\" class=\"form-control\" />")
                    .css({ width: "50px" })
                    .val(designer.labelHeight / designer.dpi)
                    .on("blur", function () { return self.updateDesigner(); })
                    .on("keypress", function (e) {
                    if (e.which === 13) {
                        e.preventDefault();
                        self.updateDesigner();
                    }
                });
                this.heightController = $("<div></div>").addClass("label-size-element")
                    .append($("<div></div>").addClass("input-group")
                    .append($("<span></span>").addClass("input-group-addon").html("height: "))
                    .append(this.heightInput))
                    .appendTo(this.workspace);
            };
            SizeControl.prototype.buildDpiController = function (designer) {
                var self = this;
                this.dpiInput = $("<input type=\"text\" class=\"form-control\" />")
                    .css({ width: "50px" })
                    .val(designer.dpi)
                    .on("blur", function () { return self.updateDesigner(); })
                    .on("keypress", function (e) {
                    if (e.which === 13) {
                        e.preventDefault();
                        self.updateDesigner();
                    }
                });
                this.dpiController = $("<div></div>").addClass("label-size-element")
                    .append($("<div></div>").addClass("input-group")
                    .append($("<span></span>").addClass("input-group-addon").html("dpi: "))
                    .append(this.dpiInput))
                    .appendTo(this.workspace);
            };
            SizeControl.prototype.updateDesigner = function () {
                var dpi = this.designer.dpi;
                if (!isNaN(this.dpiInput.val())) {
                    dpi = this.dpiInput.val();
                }
                ;
                this.designer.dpi = dpi;
                var width = this.designer.labelWidth / this.designer.dpi;
                var height = this.designer.labelHeight / this.designer.dpi;
                if (!isNaN(this.widthInput.val())) {
                    width = this.widthInput.val();
                }
                ;
                if (!isNaN(this.heightInput.val())) {
                    height = this.heightInput.val();
                }
                ;
                this.designer.updateLabelSize(width, height);
                this.widthController.val(width);
                this.heightController.val(height);
            };
            return SizeControl;
        }());
        helpers.SizeControl = SizeControl;
    })(helpers = bo.helpers || (bo.helpers = {}));
})(bo || (bo = {}));
//# sourceMappingURL=sizeControl.js.map