var bo;
(function (bo) {
    var designerTools;
    (function (designerTools) {
        var ImageFactory = (function () {
            function ImageFactory() {
                this.button = $("<button></button>").append($("<span></span>").addClass("glyphicon glyphicon-picture"));
            }
            ImageFactory.prototype.object = function (x, y, width, height) {
                this.button.removeClass("active");
                return this.internalObject(x, y, width, height, null);
            };
            ImageFactory.prototype.activateTool = function () {
                this.button.addClass("active");
            };
            ImageFactory.prototype.deactivateTool = function () {
                this.button.removeClass("active");
            };
            ImageFactory.prototype.activate = function (toolbar) {
                this.data = null;
                var self = this;
                // Open up a dialog to get the image
                var toolbarCopy = toolbar;
                var dialogBody = $("<div></div>").addClass("modal-body");
                var dialog = $("<div></div>").addClass("modal fade").prop("tabindex", -1).prop("role", "dialog")
                    .append($("<div></div>").addClass("modal-dialog")
                    .append($("<div></div>").addClass("modal-content")
                    .append($("<div></div>").addClass("modal-header")
                    .append($("<button></button>").prop("type", "button").addClass("close")
                    .on("click", function () {
                    dialog.modal("hide");
                })
                    .append($("<span></span>").html("&times;")))
                    .append($("<h4></h4>").addClass("modal-title").html("Add Image")))
                    .append(dialogBody)
                    .append($("<div></div>").addClass("modal-footer")
                    .append($("<button></button>").prop("type", "button").addClass("btn btn-default").html("Close")
                    .on("click", function () {
                    dialog.modal("hide");
                }))
                    .append($("<button></button>").prop("type", "button").addClass("btn btn-default").html("Add")
                    .on("click", function () {
                    toolbarCopy.designer.addObject(self.internalObject(0, 0, self.width, self.height, self.data));
                    dialog.modal("hide");
                })))));
                var imageLeft = null;
                var imageRight = null;
                var imageFile = $("<input type=\"file\" />").css({ width: 400 })
                    .on("change", function () {
                    var input = imageFile[0];
                    if (!input.files[0]) {
                        alert("Please select a file to insert.");
                    }
                    else {
                        var file = input.files[0];
                        var reader_1 = new FileReader();
                        var insertImg_1 = imageLeft;
                        var canvasResult_1 = imageRight;
                        reader_1.onloadend = function () {
                            var canvas = canvasResult_1;
                            var imgSelf = insertImg_1;
                            insertImg_1.css({ "width": "auto", "height": "auto", "max-width": 200, "max-height": 200 });
                            canvas.css({ "width": "auto", "height": "auto" });
                            insertImg_1[0].onload = function () {
                                var tCanvas = $("<canvas />");
                                tCanvas[0].width = imgSelf[0].width;
                                tCanvas[0].height = imgSelf[0].height;
                                canvas[0].width = imgSelf[0].width;
                                canvas[0].height = imgSelf[0].height;
                                var tctx = tCanvas[0].getContext("2d");
                                var ctx = canvas[0].getContext("2d");
                                tctx.drawImage(imgSelf[0], 0, 0, tCanvas[0].width, tCanvas[0].height);
                                var tImgData = tctx.getImageData(0, 0, tCanvas[0].width, tCanvas[0].height);
                                var imgData = ctx.getImageData(0, 0, tCanvas[0].width, tCanvas[0].height);
                                // Convert the canvas data to GRF.
                                for (var y = 0; y < tCanvas[0].height; y++) {
                                    for (var x = 0; x < tCanvas[0].width; x++) {
                                        var pixelStart = 4 * (tCanvas[0].width * y + x);
                                        var luminance = tImgData.data[pixelStart] * 0.299 + tImgData.data[pixelStart + 1] * 0.587 + tImgData.data[pixelStart + 2] * 0.114;
                                        if (luminance > 127) {
                                            imgData.data[pixelStart] = 255;
                                            imgData.data[pixelStart + 1] = 255;
                                            imgData.data[pixelStart + 2] = 255;
                                            imgData.data[pixelStart + 3] = 255;
                                        }
                                        else {
                                            imgData.data[pixelStart] = 0;
                                            imgData.data[pixelStart + 1] = 0;
                                            imgData.data[pixelStart + 2] = 0;
                                            imgData.data[pixelStart + 3] = 255;
                                        }
                                    }
                                }
                                self.width = canvas[0].width;
                                self.height = canvas[0].height;
                                self.data = imgData.data;
                                ctx.putImageData(imgData, 0, 0);
                            };
                            insertImg_1[0].src = reader_1.result;
                        };
                        reader_1.readAsDataURL(file);
                    }
                }).appendTo(dialogBody);
                var imageContainer = $("<div></div>").css({ "padding-top": "5px" });
                imageLeft = $("<img />").prop("src", "images/blank.png").prop("border", "none").css({ border: "1px solid #DDDDDD", float: "left", height: 200, width: 200 }).appendTo(imageContainer);
                imageRight = $("<canvas />").css({ border: "1px solid #DDDDDD", float: "right", height: 200, width: 200 }).appendTo(imageContainer);
                $("<br style='clear:both'></br>").appendTo(imageContainer);
                imageContainer.appendTo(dialogBody);
                dialog.modal("show")
                    .on("hidden.bs.modal", { toolbar: toolbar }, function (event) {
                    event.data.toolbar.setTool(null);
                });
            };
            ;
            ImageFactory.prototype.internalObject = function (x, y, width, height, data) {
                this.counter = this.counter || 1;
                var result = new ImageTool(this.counter++, x, y, width, height);
                result.data = data;
                return result;
            };
            return ImageFactory;
        }());
        designerTools.ImageFactory = ImageFactory;
        var ImageTool = (function () {
            function ImageTool(counter, x, y, width, height) {
                this.uniqueID = counter;
                this.name = "Image " + counter;
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                x;
                this.rotation = 0;
                this.canResize = true;
                this.properties = [
                    {
                        name: "name", text: "name", readonly: false, type: "text",
                        get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; },
                    },
                    {
                        name: "x", text: "x", readonly: false, type: "number",
                        get: function (obj) { return obj.x; }, set: function (obj, value) { obj.x = value; },
                    },
                    {
                        name: "y", text: "y", readonly: false, type: "number",
                        get: function (obj) { return obj.y; }, set: function (obj, value) { obj.y = value; },
                    },
                    {
                        name: "width", text: "width", readonly: true, type: "text",
                        get: function (obj) { return obj.width; }, set: function (obj, value) { obj.width = value; },
                    },
                    {
                        name: "height", text: "height", readonly: true, type: "text",
                        get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; },
                    },
                ];
            }
            ImageTool.fromObject = function (object) {
                var result = new ImageTool(object.uniqueID, object.x, object.y, object.width, object.height);
                result.data = object.data;
                result.name = object.name;
                return result;
            };
            ImageTool.prototype.draw = function (context, width, height) {
                var ctxData = context.getImageData(0, 0, width, height);
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        if (this.x + x >= 0 && this.x + x < width
                            && this.y + y >= 0 && this.y + y < height) {
                            var drawPoint = 4 * (width * (this.y + y) + this.x + x);
                            var drawFromPoint = 4 * (this.width * y + x);
                            ctxData.data[drawPoint] = this.data[drawFromPoint];
                            ctxData.data[drawPoint + 1] = this.data[drawFromPoint + 1];
                            ctxData.data[drawPoint + 2] = this.data[drawFromPoint + 2];
                            ctxData.data[drawPoint + 3] = this.data[drawFromPoint + 3];
                        }
                    }
                }
                context.putImageData(ctxData, 0, 0);
            };
            ImageTool.prototype.drawActive = function (context) {
                context.dashedStroke((this.x - 5), (this.y - 5), (this.x) + (this.width) + 5, (this.y) + (this.height) + 5, [2, 2]);
            };
            ImageTool.prototype.hitTest = function (coords) {
                return (coords.x >= (this.x) && coords.x <= (this.x) + (this.width) && coords.y >= (this.y) && coords.y <= (this.y) + (this.height));
            };
            ImageTool.prototype.toSerializable = function () {
                return {
                    data: this.data, height: this.height, name: this.name, type: "imageTool", uniqueID: this.uniqueID, width: this.width, x: this.x, y: this.y,
                };
            };
            return ImageTool;
        }());
        designerTools.ImageTool = ImageTool;
    })(designerTools = bo.designerTools || (bo.designerTools = {}));
})(bo || (bo = {}));
//# sourceMappingURL=image.js.map