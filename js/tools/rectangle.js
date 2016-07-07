var bo;
(function (bo) {
    var designerTools;
    (function (designerTools) {
        var RectangleFactory = (function () {
            function RectangleFactory() {
                this.button = $("<button></button>").append($("<span></span>").addClass("glyphicon glyphicon-stop"));
            }
            RectangleFactory.prototype.object = function (x, y, width, height) {
                this.counter = this.counter || 1;
                return new RectangleTool(this.counter++, x, y, width, height);
            };
            RectangleFactory.prototype.activate = function (window) { };
            RectangleFactory.prototype.activateTool = function () {
                this.button.addClass("active");
            };
            RectangleFactory.prototype.deactivateTool = function () {
                this.button.removeClass("active");
            };
            return RectangleFactory;
        }());
        designerTools.RectangleFactory = RectangleFactory;
        var RectangleTool = (function () {
            function RectangleTool(counter, x, y, width, height) {
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
                        name: "width", text: "width", readonly: false, type: "text",
                        get: function (obj) { return obj.width; }, set: function (obj, value) { obj.width = value; },
                    },
                    {
                        name: "height", text: "height", readonly: false, type: "text",
                        get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; },
                    },
                ];
            }
            RectangleTool.fromObject = function (object) {
                var result = new RectangleTool(1, object.x, object.y, object.width, object.height);
                result.name = object.name;
                return result;
            };
            RectangleTool.prototype.draw = function (context, width, height) {
                context.fillRect(this.x, this.y, this.width, this.height);
            };
            RectangleTool.prototype.drawActive = function (context) {
                context.dashedStroke(this.x - 5, this.y - 5, this.x + this.width + 5, this.y + this.height + 5, [2, 2]);
            };
            RectangleTool.prototype.hitTest = function (coords) {
                return (coords.x >= this.x && coords.x <= this.x + this.width && coords.y >= this.y && coords.y <= this.y + this.height);
            };
            RectangleTool.prototype.toSerializable = function () {
                return {
                    height: this.height, name: this.name, type: "rectangleTool", width: this.width, x: this.x, y: this.y,
                };
            };
            return RectangleTool;
        }());
        designerTools.RectangleTool = RectangleTool;
    })(designerTools = bo.designerTools || (bo.designerTools = {}));
})(bo || (bo = {}));
//# sourceMappingURL=rectangle.js.map