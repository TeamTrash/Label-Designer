var bo;
(function (bo) {
    var designerTools;
    (function (designerTools) {
        var rectangleFactory = (function () {
            function rectangleFactory() {
                this.button = $("<div></div>").addClass("designerToolbarRectangle designerToolbarButton").attr("title", "Rectangle").append($("<div></div>"));
            }
            rectangleFactory.prototype.object = function (x, y, width, height) {
                this.counter = this.counter || 1;
                return new rectangleTool(this.counter++, x, y, width, height);
            };
            return rectangleFactory;
        }());
        designerTools.rectangleFactory = rectangleFactory;
        var rectangleTool = (function () {
            function rectangleTool(counter, x, y, width, height) {
                this.name = "Rectangle " + counter;
                this.x = x;
                this.y = y;
                this.width = width > 30 ? width : 30;
                this.height = height > 30 ? height : 30;
                this.rotation = 0;
                this.canResize = true;
                this.properties = [
                    {
                        name: "name", text: "name", readonly: false, type: "text",
                        get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; }
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
                        name: "width", text: "width", readonly: false, type: "text",
                        get: function (obj) { return obj.width; }, set: function (obj, value) { obj.width = value; }
                    },
                    {
                        name: "height", text: "height", readonly: false, type: "text",
                        get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; }
                    }
                ];
            }
            rectangleTool.prototype.draw = function (context, width, height) {
                context.fillRect(this.x, this.y, this.width, this.height);
            };
            rectangleTool.prototype.drawActive = function (context) {
                context.dashedStroke(this.x - 5, this.y - 5, this.x + this.width + 5, this.y + this.height + 5, [2, 2]);
            };
            rectangleTool.prototype.hitTest = function (coords) {
                return (coords.x >= this.x && coords.x <= this.x + this.width && coords.y >= this.y && coords.y <= this.y + this.height);
            };
            rectangleTool.prototype.toSerializable = function () {
                return {
                    type: "rectangleTool", name: this.name, x: this.x, y: this.y, width: this.width,
                    height: this.height
                };
            };
            rectangleTool.fromObject = function (object) {
                var result = new rectangleTool(1, object.x, object.y, object.width, object.height);
                result.name = object.name;
                return result;
            };
            return rectangleTool;
        }());
        designerTools.rectangleTool = rectangleTool;
    })(designerTools = bo.designerTools || (bo.designerTools = {}));
})(bo || (bo = {}));
//# sourceMappingURL=rectangle.js.map