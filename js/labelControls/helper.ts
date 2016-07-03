module bo.helpers {
    export class mathHelper {
		static rotate(origin: point, pointToRotate: point, angle: number): point {
            var radians = (Math.PI / 180) * angle,
				cos = Math.cos(radians),
				sin = Math.sin(radians),
				nx = (cos * (pointToRotate.x - origin.x)) - (sin * (pointToRotate.y - origin.y)) + origin.x,
				ny = (cos * (pointToRotate.y - origin.y)) + (sin * (pointToRotate.x - origin.x)) + origin.y;

			return new point(nx, ny);
        }

		static isPointWithinPolygon(point: point, vs: Array<point>) {
			// ray-casting algorithm based on
			// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

			var inside = false;
			for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
				var xi = vs[i].x, yi = vs[i].y;
				var xj = vs[j].x, yj = vs[j].y;

				var intersect = ((yi > point.y) != (yj > point.y))
					&& (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

				if (intersect) inside = !inside;
			}

			return inside;
		};
	}

	export class point {
		constructor(public x: number, public y: number) { }

		round(): point {
			return new point(Math.round(this.x), Math.round(this.y))
		}
	}

	export interface ILiteEvent<T> {
		on(handler: { (data?: T): void }): void;
		off(handler: { (data?: T): void }): void;
	}

	export class LiteEvent<T> implements ILiteEvent<T> {
		private handlers: { (data?: T): void; }[] = [];

		public on(handler: { (data?: T): void }) {
			this.handlers.push(handler);
		}

		public off(handler: { (data?: T): void }) {
			this.handlers = this.handlers.filter(h => h !== handler);
		}

		public trigger(data?: T) {
			this.handlers.slice(0).forEach(h => h(data));
		}
	}
}