if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.labelControl)
	com.logicpartners.labelControl = {};
	
com.logicpartners.labelControl.helper = function() {
	var self = this;
	
    this.rotate = function(cx, cy, x, y, angle){
        var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
        return [nx, ny];
    }

    this.isPointWithinPolygon  = function (x, y, vs) {
    		// ray-casting algorithm based on
    		// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
			var inside = false;
			for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
				var xi = vs[i][0], yi = vs[i][1];
				var xj = vs[j][0], yj = vs[j][1];
				
				var intersect = ((yi > y) != (yj > y))
					&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
					
				if (intersect) inside = !inside;
			}
			
			return inside;
		};
}