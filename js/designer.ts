interface HTMLCanvasElement {
	relativeMouse(event: any): bo.helpers.Point;
}
interface Window {
	CanvasRenderingContext2D: any;
	saveAs(file: File);
}
interface CanvasRenderingContext2D {
	dashedLine(x: number, y: number, x2: number, y2: number, dashArray: Array<number>);
	dashedStroke(x: number, y: number, x2: number, y2: number, dashArray: Array<number>);
}

module bo {
	import Tool = bo.designerTools.Tool;
	import ToolFactory = bo.designerTools.ToolFactory;

	// http://stackoverflow.com/a/5932203/697477
	HTMLCanvasElement.prototype.relativeMouse = function (event) {
		let totalOffsetX = 0;
		let totalOffsetY = 0;
		let canvasX = 0;
		let canvasY = 0;
		let currentElement = this;

		do {
			totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
			totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
		}
		while (currentElement = currentElement.offsetParent);

		canvasX = event.clientX - totalOffsetX;
		canvasY = event.clientY - totalOffsetY;

		return new bo.helpers.Point(canvasX, canvasY);
	};

	// From http://stackoverflow.com/a/4577326/697477
	let CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
	if (CP && CP.lineTo) {
		CP.dashedLine = function (x, y, x2, y2, dashArray) {
			if (!dashArray) {
				dashArray = [10, 5];
			}
			let dashCount = dashArray.length;
			this.moveTo(x, y);
			let dx = (x2 - x), dy = (y2 - y);
			let slope = dx ? dy / dx : 1e15;
			let distRemaining = Math.sqrt(dx * dx + dy * dy);
			let dashIndex = 0, draw = true;
			while (distRemaining >= 0.1) {
				let dashLength = dashArray[dashIndex++ % dashCount];
				if (dashLength > distRemaining) {
					dashLength = distRemaining;
				}
				let xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
				if (dx < 0) {
					xStep = -xStep;
				}
				x += xStep;
				y += slope * xStep;
				this[draw ? "lineTo" : "moveTo"](x, y);
				distRemaining -= dashLength;
				draw = !draw;
			}

			// Ensure that the last segment is closed for proper stroking
			this.moveTo(0, 0);
		};

		CP.dashedStroke = function (x, y, x2, y2, dashArray) {
			this.beginPath();
			this.dashedLine(x, y, x2, y, dashArray);
			this.dashedLine(x2, y, x2, y2, dashArray);
			this.dashedLine(x2, y2, x, y2, dashArray);
			this.dashedLine(x, y, x, y2, dashArray);
			this.stroke();
		};
	}

	export class LabelDesigner {
		public dpi: number;
		public labelWidth: number;
		public labelHeight: number;
		public elements: Array<Tool>;
		public activeElement: Tool;
		public toolbar: bo.ToolsWindow;
		public newObjectController: ToolFactory;

		private canvas: HTMLCanvasElement;
		private canvasElement: JQuery;
		private onUpdating = new bo.helpers.LiteEvent<bo.designerTools.Tool>();
		private drawingContext: CanvasRenderingContext2D;
		private currentLayer: number;
		private labelX: number;
		private labelY: number;
		private dragStartPosition: bo.helpers.Point;
		private dragStartTime: number;
		private dragLastPosition: bo.helpers.Point;
		private dragElementOffset: bo.helpers.Point;
		private dragAction: number;
		private dragging: boolean;

		constructor(canvasid: string, labelWidth: number, labelHeight: number) {
			this.canvas = document.getElementById(canvasid) as HTMLCanvasElement;
			this.canvasElement = $(this.canvas);

			this.labelWidth = labelWidth * this.dpi;
			this.labelHeight = labelHeight * this.dpi;
			this.dpi = 200;

			this.drawingContext = this.canvas.getContext("2d");
			this.elements = [];
			this.currentLayer = 0;
			this.activeElement = null;

			this.labelX = this.canvas.width / 2 - this.labelWidth / 2;
			this.labelY = 5;

			this.dragStartPosition = new bo.helpers.Point(0, 0);
			this.dragStartTime = 0;
			this.dragLastPosition = new bo.helpers.Point(0, 0);
			this.dragElementOffset = new bo.helpers.Point(0, 0);
			this.dragAction = 0;
			this.dragging = false;

			this.attachCanvasEvents();
			this.updateLabelSize(labelWidth, labelHeight);
			this.updateCanvas();
		}

		get updating(): bo.helpers.ILiteEvent<Tool> { return this.onUpdating; }

		public updateLabelSize(width: number, height: number): void {
			this.labelWidth = width * this.dpi;
			this.labelHeight = height * this.dpi;
			this.canvasElement.prop("width", this.labelWidth + 10).prop("height", this.labelHeight + 10);
			this.labelX = this.canvas.width / 2 - this.labelWidth / 2;
			this.labelY = 5;
			this.updateCanvas();
		}


		public addObject(tool: Tool): void {
			this.elements[this.currentLayer++] = tool;
			this.activeElement = this.elements[this.currentLayer - 1];
			this.updateCanvas();
		}

		public reset(): void {
			this.elements = [];
			this.currentLayer = 1;
			this.activeElement = null;
			this.updateCanvas();
		}

		public saveToJson(): string {
			let elements = this.elements
				.filter((value: Tool) => { return value != null; })
				.map((value: Tool) => {
					return value != null ? value.toSerializable() : null;
				});

			let saveModel = { dpi: this.dpi, height: this.labelHeight, items: elements, width: this.labelWidth };

			return JSON.stringify(saveModel);
		}

		public loadFromJson(json: string): void {
			let model = JSON.parse(json);
			let elements = model.items.map((item: any) => {
				return bo.designerTools.typeMapping[item.type].fromObject(item);
			});

			this.reset();
			this.dpi = model.dpi;
			this.updateLabelSize(model.width / model.dpi, model.height / model.dpi);

			for (let element of elements) {
				this.addObject(element);
			}
		}

		public updateCanvas(): void {
			this.onUpdating.trigger(this.activeElement);

			this.drawingContext.fillStyle = "#FFFFFF";
			this.drawingContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

			// Draw the boundary.
			this.drawingContext.strokeStyle = "#FF0000";
			this.drawingContext.lineWidth = 1;
			this.drawingContext.strokeRect(this.labelX, this.labelY, this.labelWidth, this.labelHeight);
			this.drawingContext.strokeStyle = "#000000";
			this.drawingContext.fillStyle = "#000000";

			for (let i = 0; i < this.currentLayer; i++) {
				if (this.elements[i]) {
					this.elements[i].draw(this.drawingContext, this.canvas.width, this.canvas.height);
				}
			}

			this.drawingContext.strokeStyle = "#FF0000";
			this.drawingContext.lineCap = "butt";
			this.drawingContext.lineWidth = 2;
			if (this.activeElement) {
				this.activeElement.drawActive(this.drawingContext);
			}
		}

		public setNewObject(controller: ToolFactory): void {
			if (controller) {
				this.newObjectController = controller;
			} else {
				this.newObjectController = null;
			}
		}

		private deleteActiveElement(): void {
			if (this.activeElement) {
				for (let i = 0; i < this.currentLayer; i++) {
					if (this.elements[i] && this.elements[i] === this.activeElement) {
						this.elements[i] = null;
						this.activeElement = null;
					}
				}
			}
		}

		private setActiveElement() {
			let coordinates = this.canvas.relativeMouse(event);
			if (!this.activeElement || this.getHandle(coordinates) === 0) {
				this.activeElement = null;
				for (let i = this.currentLayer - 1; i >= 0; i--) {
					if (this.elements[i] && this.elements[i].hitTest(coordinates)) {
						this.activeElement = this.elements[i];
						break;
					}
				}
			}

			this.updateCanvas();
		}

		/**
		 * Parameters: Coordinates on canvas.
		 * 
		 * Returns: 0 if not on resize zone.
		 *          1 top left     2 top     3 top right
		 *          4 left                   5 right
		 *          6 bottom left  7 bottom  8 bottom right
		 */
		private setActiveHandle(coords: bo.helpers.Point): void {
			this.dragAction = this.getHandle(coords);
		}

		private getHandle(coords: bo.helpers.Point): number {
			let result = 0;

			if (this.activeElement.canResize !== true) { return result; };

			let leftEdge = coords.x > this.activeElement.x - 5 && coords.x < this.activeElement.x + 5;
			let rightEdge = coords.x > this.activeElement.x + this.activeElement.width - 5 && coords.x < this.activeElement.x + this.activeElement.width + 5;
			let topEdge = coords.y > this.activeElement.y - 5 && coords.y < this.activeElement.y + 5;
			let bottomEdge = coords.y > this.activeElement.y + this.activeElement.height - 5 && coords.y < this.activeElement.y + this.activeElement.height + 5;

			let verticalHit = coords.y > this.activeElement.y && coords.y < this.activeElement.y + this.activeElement.height;
			let horizontalHit = coords.x > this.activeElement.x && coords.x < this.activeElement.x + this.activeElement.width;

			if (leftEdge && topEdge) {
				result = 1;
			} else if (rightEdge && topEdge) {
				result = 3;
			} else if (leftEdge && bottomEdge) {
				result = 6;
			} else if (rightEdge && bottomEdge) {
				result = 8;
			} else if (topEdge && horizontalHit) {
				result = 2;
			} else if (leftEdge && verticalHit) {
				result = 4;
			} else if (rightEdge && verticalHit) {
				result = 5;
			} else if (bottomEdge && horizontalHit) {
				result = 7;
			}

			return result;
		}

		private move(point: bo.helpers.Point) {
			this.activeElement.x = point.x;
			this.activeElement.y = point.y;
		}

		private resize(xchange: number, ychange: number): void {
			switch (this.dragAction) {
				case 1: // Top Left
					this.activeElement.x += xchange;
					this.activeElement.y += ychange;
					this.activeElement.width = (this.activeElement.width - xchange);
					this.activeElement.height = (this.activeElement.height - ychange);
					break;
				case 2: // Top
					this.activeElement.y += ychange;
					this.activeElement.height = (this.activeElement.height - ychange);
					break;
				case 3: // Top Right
					this.activeElement.width = (this.activeElement.width + xchange);
					this.activeElement.y += ychange;
					this.activeElement.height = (this.activeElement.height - ychange);
					break;
				case 4: // Left
					this.activeElement.x += xchange;
					this.activeElement.width = (this.activeElement.width - xchange);
					break;
				case 5: // Right
					this.activeElement.width = (this.activeElement.width + xchange);
					break;
				case 6: // Bottom Left
					this.activeElement.x += xchange;
					this.activeElement.width = (this.activeElement.width - xchange);
					this.activeElement.height = (this.activeElement.height + ychange);
					break;
				case 7: // Bottom
					this.activeElement.height = (this.activeElement.height + ychange);
					break;
				case 8: // Bottom Right
					this.activeElement.width = (this.activeElement.width + xchange);
					this.activeElement.height = (this.activeElement.height + ychange);
					break;
			}

			if (this.activeElement.width === 0) {
				this.activeElement.width = (-1);
				this.activeElement.x += 1;
			}

			if (this.activeElement.height === 0) {
				this.activeElement.height = (-1);
				this.activeElement.y += 1;
			}

			if (this.activeElement.width < 0) {
				this.activeElement.x = this.activeElement.x + this.activeElement.width;
				this.activeElement.width = (this.activeElement.width * -1);
				this.swapActionHorizontal();
			}

			if (this.activeElement.height < 0) {
				this.activeElement.y = this.activeElement.y + this.activeElement.height;
				this.activeElement.height = (this.activeElement.height * -1);
				this.swapActionVertical();
			}
		}

		private swapActionVertical(): void {
			switch (this.dragAction) {
				case 1:
					this.dragAction = 6;
					break;
				case 2:
					this.dragAction = 7;
					break;
				case 3:
					this.dragAction = 8;
					break;
				case 6:
					this.dragAction = 1;
					break;
				case 7:
					this.dragAction = 2;
					break;
				case 8:
					this.dragAction = 3;
					break;
			}
		}

		private swapActionHorizontal(): void {
			switch (this.dragAction) {
				case 1:
					this.dragAction = 3;
					break;
				case 3:
					this.dragAction = 1;
					break;
				case 4:
					this.dragAction = 5;
					break;
				case 5:
					this.dragAction = 4;
					break;
				case 6:
					this.dragAction = 8;
					break;
				case 8:
					this.dragAction = 6;
					break;
			}
		}

		private attachCanvasEvents(): void {
			let self = this;
			this.canvasElement.on("click", function () {
				self.setActiveElement();
			}).on("mousedown", function () {
				self.dragStartPosition = self.canvas.relativeMouse(event);
				self.dragLastPosition = self.dragStartPosition;

				if (self.newObjectController) {
					// Create new object.
					self.elements[self.currentLayer++] = self.newObjectController.object(self.dragStartPosition.x, self.dragStartPosition.y, 1, 1);
					self.dragAction = 8;
					self.activeElement = self.elements[self.currentLayer - 1];
					self.newObjectController = null;
				} else {
					self.dragAction = 0;

					self.setActiveElement();

					if (self.activeElement) {
						self.dragElementOffset = new bo.helpers.Point(self.activeElement.x - self.dragStartPosition.x, self.activeElement.y - self.dragStartPosition.y);
						self.setActiveHandle(self.dragStartPosition);
					}
				}
				self.dragging = true;
			})
				.on("mouseup", function () {
					self.dragging = false;
				})
				.on("mouseout", function () {
					self.dragging = false;
				})
				.on("mousemove", function () {
					if (self.dragging && self.activeElement) {
						let coords = self.canvas.relativeMouse(event);
						switch (self.dragAction) {
							case 0:
								self.move(new bo.helpers.Point(coords.x + self.dragElementOffset.x, coords.y + self.dragElementOffset.y));
								break;
							default:
								self.resize(coords.x - self.dragLastPosition.x, coords.y - self.dragLastPosition.y);
								break;
						}
						self.updateCanvas();
						self.dragLastPosition = coords;
					} else if (self.newObjectController != null) {
						self.canvasElement.css({ cursor: "crosshair" });
					} else if (self.activeElement) {
						let coords = self.canvas.relativeMouse(event);
						// If cursor is within range of edge, show resize handles
						let location = self.getHandle(coords);
						let style = "default";
						switch (location) {
							case 0:
								style = "default";
								break;
							case 1:
								style = "nw-resize";
								break;
							case 2:
								style = "n-resize";
								break;
							case 3:
								style = "ne-resize";
								break;
							case 4:
								style = "w-resize";
								break;
							case 5:
								style = "e-resize";
								break;
							case 6:
								style = "sw-resize";
								break;
							case 7:
								style = "s-resize";
								break;
							case 8:
								style = "se-resize";
								break;
						}
						self.canvasElement.css({ cursor: style });
					}
				})
				.on("keydown", function (event) {
					let handled = false;
					switch (event.keyCode) {
						case 37: // Left arrow
							if (self.activeElement) {
								self.activeElement.x -= 1;
							}
							handled = true;
							break;
						case 38: // Up arrow
							if (self.activeElement) {
								self.activeElement.y -= 1;
							}
							handled = true;
							break;
						case 39: // Right arrow
							if (self.activeElement) {
								self.activeElement.x += 1;
							}
							handled = true;
							break;
						case 40: // Down arrow
							if (self.activeElement) {
								self.activeElement.y += 1;
							}
							handled = true;
							break;
						case 46:
							if (self.activeElement) {
								self.deleteActiveElement();
								handled = true;
							}
							break;
					}

					if (handled) {
						self.updateCanvas();
						event.preventDefault();
						event.stopPropagation();
					}
				});

		}

	}
}
