var bo;
(function (bo) {
    var helpers;
    (function (helpers) {
        var mathHelper = (function () {
            function mathHelper() {
            }
            mathHelper.rotate = function (origin, pointToRotate, angle) {
                var radians = (Math.PI / 180) * angle, cos = Math.cos(radians), sin = Math.sin(radians), nx = (cos * (pointToRotate.x - origin.x)) - (sin * (pointToRotate.y - origin.y)) + origin.x, ny = (cos * (pointToRotate.y - origin.y)) + (sin * (pointToRotate.x - origin.x)) + origin.y;
                return new point(nx, ny);
            };
            mathHelper.isPointWithinPolygon = function (point, vs) {
                // ray-casting algorithm based on
                // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
                var inside = false;
                for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                    var xi = vs[i].x, yi = vs[i].y;
                    var xj = vs[j].x, yj = vs[j].y;
                    var intersect = ((yi > point.y) != (yj > point.y))
                        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
                    if (intersect)
                        inside = !inside;
                }
                return inside;
            };
            ;
            return mathHelper;
        }());
        helpers.mathHelper = mathHelper;
        var point = (function () {
            function point(x, y) {
                this.x = x;
                this.y = y;
            }
            point.prototype.round = function () {
                return new point(Math.round(this.x), Math.round(this.y));
            };
            return point;
        }());
        helpers.point = point;
    })(helpers = bo.helpers || (bo.helpers = {}));
})(bo || (bo = {}));
//# sourceMappingURL=helper.js.map