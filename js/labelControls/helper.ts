module bo.helpers {
    export class MathHelper {
        public static rotate(origin: Point, pointToRotate: Point, angle: number): Point {
            let radians = (Math.PI / 180) * angle,
                cos = Math.cos(radians),
                sin = Math.sin(radians),
                nx = (cos * (pointToRotate.x - origin.x)) - (sin * (pointToRotate.y - origin.y)) + origin.x,
                ny = (cos * (pointToRotate.y - origin.y)) + (sin * (pointToRotate.x - origin.x)) + origin.y;

            return new Point(nx, ny);
        }

		public static isPointWithinPolygon(point: Point, vs: Array<Point>) {
			// ray-casting algorithm based on
			// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

			let inside = false;
			for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
				let xi = vs[i].x, yi = vs[i].y;
				let xj = vs[j].x, yj = vs[j].y;

				let intersect = ((yi > point.y) !== (yj > point.y))
					&& (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

				if (intersect) { inside = !inside; };
			}

			return inside;
		};
	}

	export class Point {
		constructor(public x: number, public y: number) { }

		public round(): Point {
			return new Point(Math.round(this.x), Math.round(this.y));
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
