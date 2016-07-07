var bo;
(function (bo) {
    var designerTools;
    (function (designerTools) {
        var Point = bo.helpers.Point;
        var MathHelper = bo.helpers.MathHelper;
        var TextFactory = (function () {
            function TextFactory() {
                this.button = $("<button></button>").append($("<span></span>").addClass("glyphicon glyphicon-font"));
            }
            TextFactory.prototype.object = function (x, y, width, height) {
                this.counter = this.counter || 1;
                return new TextTool(this.counter++, x, y, width, height);
            };
            TextFactory.prototype.activate = function (window) { };
            TextFactory.prototype.activateTool = function () {
                this.button.addClass("active");
            };
            TextFactory.prototype.deactivateTool = function () {
                this.button.removeClass("active");
            };
            return TextFactory;
        }());
        designerTools.TextFactory = TextFactory;
        var TextTool = (function () {
            function TextTool(counter, x, y, width, height) {
                this.name = "Textbox " + counter;
                this.text = this.name;
                this.x = x;
                this.y = y;
                this.fontSize = 30;
                this.fontType = "Arial";
                this.width = 100;
                this.height = 0;
                this.rotation = 0;
                this.canResize = true;
                this.properties = [
                    {
                        name: "name", text: "name", readonly: false, type: "text",
                        get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; }
                    },
                    {
                        name: "text", text: "text", readonly: false, type: "text",
                        get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; }
                    },
                    {
                        name: "x", text: "x", readonly: false, type: "number",
                        get: function (obj) { return obj.x; }, set: function (obj, value) { obj.x = value; }
                    },
                    {
                        name: "y", text: "y", readonly: false, type: "number",
                        get: function (obj) { return obj.y; }, set: function (obj, value) { obj.y = value; }
                    },
                    {
                        name: "fontSize", text: "font size", readonly: false, type: "options", options: [10, 20, 30, 40, 50, 60],
                        get: function (obj) { return obj.fontSize; }, set: function (obj, value) { obj.fontSize = value; }
                    },
                    {
                        name: "rotation", text: "rotation", readonly: false, type: "options", options: [0, 90, 180, 270],
                        get: function (obj) { return obj.rotation; }, set: function (obj, value) { obj.rotation = value; }
                    }
                ];
            }
            TextTool.fromObject = function (object) {
                var result = new TextTool(1, object.x, object.y, object.width, object.height);
                result.name = object.name;
                result.text = object.text;
                result.fontSize = object.fontSize;
                result.fontType = object.fontType;
                result.rotation = object.rotation;
                return result;
            };
            TextTool.prototype.getFontHeight = function () {
                var textMeasure = $("<div></div>").css({
                    "font-size": this.fontSize + "px",
                    "font-family": this.fontType,
                    "opacity": 0,
                }).text("M").appendTo($("body"));
                var height = textMeasure.outerHeight();
                textMeasure.remove();
                return height;
            };
            TextTool.prototype.draw = function (context, width, height) {
                context.font = this.fontSize + "px " + this.fontType;
                var oColor = context.fillStyle;
                context.fillStyle = "white";
                this.height = this.getFontHeight();
                var measuredText = context.measureText(this.text);
                this.width = measuredText.width;
                context.globalCompositeOperation = "difference";
                context.save();
                context.translate(this.x, this.y + (this.height / 2));
                context.rotate((this.rotation * Math.PI) / 180);
                context.fillText(this.text, 0, 0 + (this.height * 0.75) - (this.height / 2));
                context.restore();
                context.globalCompositeOperation = "source-over";
                context.fillStyle = oColor;
            };
            TextTool.prototype.drawActive = function (context) {
                context.save();
                context.translate(this.x, this.y + this.height / 2);
                context.rotate((this.rotation * Math.PI) / 180);
                context.dashedStroke(-5, -5 - (this.height / 2), this.width + 5, (this.height * 0.9) - (this.height / 2) + 5, [2, 2]);
                context.restore();
            };
            TextTool.prototype.hitTest = function (coords) {
                var originX = this.x;
                var originY = this.y + this.height / 2;
                var rotation = this.rotation;
                var rotatedTopLeft = MathHelper.rotate(new Point(originX, originY), new Point(this.x, this.y), rotation);
                var rotatedBottomLeft = MathHelper.rotate(new Point(originX, originY), new Point(this.x, this.y + this.height), rotation);
                var rotatedTopRight = MathHelper.rotate(new Point(originX, originY), new Point(this.x + this.width, this.y), rotation);
                var rotatedBottomRight = MathHelper.rotate(new Point(originX, originY), new Point(this.x + this.width, this.y + this.height), rotation);
                var area = [rotatedTopLeft, rotatedBottomLeft, rotatedBottomRight, rotatedTopRight];
                var hitTest = bo.helpers.MathHelper.isPointWithinPolygon(new Point(coords.x, coords.y), area);
                return hitTest;
            };
            TextTool.prototype.toSerializable = function () {
                return {
                    fontSize: this.fontSize, fontType: this.fontType, height: this.height, name: this.name, rotation: this.rotation,
                    text: this.text, type: "textTool", width: this.width, x: this.x, y: this.y,
                };
            };
            return TextTool;
        }());
        designerTools.TextTool = TextTool;
    })(designerTools = bo.designerTools || (bo.designerTools = {}));
})(bo || (bo = {}));
//# sourceMappingURL=text.js.map