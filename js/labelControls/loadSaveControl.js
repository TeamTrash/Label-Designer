var bo;
(function (bo) {
    var helpers;
    (function (helpers) {
        var LoadSaveControl = (function () {
            function LoadSaveControl(designer) {
                this.designer = designer;
                this.workspace = this.buildWorkspace();
                this.loadController = this.buildLoadController(designer);
                this.saveController = this.buildSaveController(designer);
                this.fileInput = this.buildFileInput(designer);
            }
            LoadSaveControl.prototype.buildWorkspace = function () {
                return $("<div></div>").addClass("label-toolbar-group").attr("title", "Label Load/Save");
            };
            LoadSaveControl.prototype.buildSaveController = function (designer) {
                var container = $("<div></div>").addClass("label-size-element").appendTo(this.workspace);
                return $("<button><span class='glyphicon glyphicon-floppy-disk'></span></button>")
                    .addClass("btn btn-default")
                    .appendTo(container)
                    .on("click", function (e) {
                    e.preventDefault();
                    window.saveAs(new File([designer.saveToJson()], "label.json"));
                });
            };
            LoadSaveControl.prototype.buildLoadController = function (designer) {
                var _this = this;
                var container = $("<div></div>").addClass("label-size-element").appendTo(this.workspace);
                return $("<button><span class='glyphicon glyphicon-folder-open'></span></button>")
                    .addClass("btn btn-default")
                    .appendTo(container)
                    .on("click", function (e) {
                    e.preventDefault();
                    _this.fileInput.trigger("click");
                });
            };
            LoadSaveControl.prototype.buildFileInput = function (designer) {
                var _this = this;
                return $("<input type=\"file\" />")
                    .on("change", function () {
                    var input = _this.fileInput[0];
                    if (input.files[0]) {
                        var file = input.files[0];
                        var reader_1 = new FileReader();
                        reader_1.onloadend = function () {
                            designer.loadFromJson(reader_1.result);
                        };
                        reader_1.readAsText(file);
                    }
                });
            };
            return LoadSaveControl;
        }());
        helpers.LoadSaveControl = LoadSaveControl;
    })(helpers = bo.helpers || (bo.helpers = {}));
})(bo || (bo = {}));
//# sourceMappingURL=loadSaveControl.js.map