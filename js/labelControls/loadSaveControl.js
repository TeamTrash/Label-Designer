var bo;
(function (bo) {
    var helpers;
    (function (helpers) {
        var loadSaveControl = (function () {
            function loadSaveControl(designer) {
                this.designer = designer;
                var self = this;
                this.workspace = this.buildWorkspace();
                this.loadController = this.buildLoadController(designer);
                this.saveController = this.buildSaveController(designer);
                this.fileInput = this.buildFileInput(designer);
            }
            loadSaveControl.prototype.buildWorkspace = function () {
                return $("<div></div>").addClass("designerLabelControl").attr("title", "Label Load/Save");
            };
            loadSaveControl.prototype.buildWidthContainer = function () {
                return $("<div>Width: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
            };
            loadSaveControl.prototype.buildSaveController = function (designer) {
                var container = $("<div></div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
                return $("<button><i class='fa fa-save'></i></button>")
                    .addClass("designerLabelControlElement designerLabelActionElement")
                    .appendTo(container)
                    .on("click", function () {
                    window.saveAs(new File([designer.saveToJson()], "label.json"));
                });
            };
            loadSaveControl.prototype.buildLoadController = function (designer) {
                var _this = this;
                var self = this;
                var container = $("<div></div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
                return $("<button><i class='fa fa-folder-open-o'></i></button>")
                    .addClass("designerLabelControlElement designerLabelActionElement")
                    .appendTo(container)
                    .on("click", function () {
                    _this.fileInput.trigger("click");
                });
            };
            loadSaveControl.prototype.buildFileInput = function (designer) {
                var _this = this;
                return $("<input type=\"file\" />").css({ width: 400 })
                    .on("change", function () {
                    var input = _this.fileInput[0];
                    if (input.files[0]) {
                        var file = input.files[0];
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            designer.loadFromJson(reader.result);
                        };
                        reader.readAsText(file);
                    }
                });
            };
            return loadSaveControl;
        }());
        helpers.loadSaveControl = loadSaveControl;
    })(helpers = bo.helpers || (bo.helpers = {}));
})(bo || (bo = {}));
//# sourceMappingURL=loadSaveControl.js.map