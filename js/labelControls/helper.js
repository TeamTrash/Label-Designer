var bo;
(function (bo) {
    var helpers;
    (function (helpers) {
        var MathHelper = (function () {
            function MathHelper() {
            }
            MathHelper.rotate = function (origin, pointToRotate, angle) {
                var radians = (Math.PI / 180) * angle, cos = Math.cos(radians), sin = Math.sin(radians), nx = (cos * (pointToRotate.x - origin.x)) - (sin * (pointToRotate.y - origin.y)) + origin.x, ny = (cos * (pointToRotate.y - origin.y)) + (sin * (pointToRotate.x - origin.x)) + origin.y;
                return new Point(nx, ny);
            };
            MathHelper.isPointWithinPolygon = function (point, vs) {
                // ray-casting algorithm based on
                // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
                var inside = false;
                for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                    var xi = vs[i].x, yi = vs[i].y;
                    var xj = vs[j].x, yj = vs[j].y;
                    var intersect = ((yi > point.y) !== (yj > point.y))
                        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
                    if (intersect) {
                        inside = !inside;
                    }
                    ;
                }
                return inside;
            };
            ;
            return MathHelper;
        }());
        helpers.MathHelper = MathHelper;
        var Point = (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            Point.prototype.round = function () {
                return new Point(Math.round(this.x), Math.round(this.y));
            };
            return Point;
        }());
        helpers.Point = Point;
        var LiteEvent = (function () {
            function LiteEvent() {
                this.handlers = [];
            }
            LiteEvent.prototype.on = function (handler) {
                this.handlers.push(handler);
            };
            LiteEvent.prototype.off = function (handler) {
                this.handlers = this.handlers.filter(function (h) { return h !== handler; });
            };
            LiteEvent.prototype.trigger = function (data) {
                this.handlers.slice(0).forEach(function (h) { return h(data); });
            };
            return LiteEvent;
        }());
        helpers.LiteEvent = LiteEvent;
    })(helpers = bo.helpers || (bo.helpers = {}));
})(bo || (bo = {}));
//# sourceMappingURL=helper.js.map