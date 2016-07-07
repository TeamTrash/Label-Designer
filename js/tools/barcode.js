var bo;
(function (bo) {
    var designerTools;
    (function (designerTools) {
        var point = bo.helpers.Point;
        var mathHelper = bo.helpers.MathHelper;
        var BarcodeFactory = (function () {
            function BarcodeFactory() {
                this.button = $("<button></button>").append($("<span></span>").addClass("glyphicon glyphicon-barcode"));
            }
            BarcodeFactory.prototype.object = function (x, y, width, height) {
                this.counter = this.counter || 1;
                this.deactivateTool();
                return new BarcodeTool(this.counter++, x, y, width, height);
            };
            BarcodeFactory.prototype.activate = function (window) { };
            BarcodeFactory.prototype.activateTool = function () {
                this.button.addClass("active");
            };
            BarcodeFactory.prototype.deactivateTool = function () {
                this.button.removeClass("active");
            };
            return BarcodeFactory;
        }());
        designerTools.BarcodeFactory = BarcodeFactory;
        var BarcodeTool = (function () {
            function BarcodeTool(counter, x, y, width, height) {
                width = 100;
                this.canvasHolder = $("<canvas></canvas>").prop("width", "100").prop("height", "1");
                this.name = "Barcode " + counter;
                this.text = "BARCODE";
                this.x = x;
                this.y = y;
                this.height = 100;
                this.format = "CODE128";
                this.multiplier = 2;
                this.rotation = 0;
                this.canResize = true;
                this.properties = [
                    {
                        name: "name", text: "name", readonly: false, type: "text",
                        get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; },
                    },
                    {
                        name: "text", text: "text", readonly: false, type: "text",
                        get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; },
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
                        name: "height", text: "height", readonly: false, type: "text",
                        get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; },
                    },
                    {
                        name: "format", text: "format", readonly: false, type: "options",
                        options: ["CODE128B", "CODE128C", "CODE39", "EAN", "UPC", "ITF", "ITF14"],
                        get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value; },
                    },
                    {
                        name: "multiplier", text: "size", readonly: false, type: "options",
                        options: [1, 2, 3],
                        get: function (obj) { return obj.multiplier; }, set: function (obj, value) { obj.multiplier = value; },
                    },
                    {
                        name: "rotation", text: "rotation", readonly: false, type: "options",
                        options: [0, 90, 180, 270],
                        get: function (obj) { return obj.rotation; }, set: function (obj, value) { obj.rotation = value; },
                    }
                ];
            }
            BarcodeTool.fromObject = function (object) {
                var result = new BarcodeTool(1, object.x, object.y, object.width, object.height);
                result.name = object.name;
                result.text = object.text;
                result.format = object.format;
                result.multiplier = object.multiplier;
                result.rotation = object.rotation;
                return result;
            };
            BarcodeTool.prototype.draw = function (context, width, height) {
                this.canvasHolder.JsBarcode(this.text, { displayValue: false, format: this.format, height: this.height, margin: 0, width: this.multiplier });
                var cwidth = this.canvasHolder[0].width;
                this.width = cwidth;
                context.save();
                context.translate(this.x, this.y);
                context.rotate((this.rotation * Math.PI) / 180);
                context.drawImage(this.canvasHolder[0], 0, 0);
                context.restore();
            };
            BarcodeTool.prototype.drawActive = function (context) {
                context.save();
                context.translate(this.x, this.y);
                context.rotate((this.rotation * Math.PI) / 180);
                context.dashedStroke(-5, -5, this.width + 5, this.height + 5, [2, 2]);
                context.restore();
            };
            BarcodeTool.prototype.hitTest = function (coords) {
                var originX = this.x;
                var originY = this.y + this.height / 2;
                var rotation = this.rotation;
                var rotatedTopLeft = mathHelper.rotate(new point(originX, originY), new point(this.x, this.y), rotation);
                var rotatedBottomLeft = mathHelper.rotate(new point(originX, originY), new point(this.x, this.y + this.height), rotation);
                var rotatedTopRight = mathHelper.rotate(new point(originX, originY), new point(this.x + this.width, this.y), rotation);
                var rotatedBottomRight = mathHelper.rotate(new point(originX, originY), new point(this.x + this.width, this.y + this.height), rotation);
                var area = [rotatedTopLeft, rotatedBottomLeft, rotatedBottomRight, rotatedTopRight];
                var hitTest = mathHelper.isPointWithinPolygon(new point(coords.x, coords.y), area);
                return hitTest;
            };
            BarcodeTool.prototype.toSerializable = function () {
                return {
                    type: "barcodeTool", name: this.name, text: this.text, x: this.x, y: this.y,
                    height: this.height, format: this.format, multiplier: this.multiplier, rotation: this.rotation
                };
            };
            return BarcodeTool;
        }());
        designerTools.BarcodeTool = BarcodeTool;
    })(designerTools = bo.designerTools || (bo.designerTools = {}));
})(bo || (bo = {}));
//# sourceMappingURL=barcode.js.map