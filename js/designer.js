var bo;
(function (bo) {
    // http://stackoverflow.com/a/5932203/697477
    HTMLCanvasElement.prototype.relativeMouse = function (event) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = this;
        do {
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        } while (currentElement = currentElement.offsetParent);
        canvasX = event.clientX - totalOffsetX;
        canvasY = event.clientY - totalOffsetY;
        return new bo.helpers.point(canvasX, canvasY);
    };
    // From http://stackoverflow.com/a/4577326/697477
    var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
    if (CP && CP.lineTo) {
        CP.dashedLine = function (x, y, x2, y2, dashArray) {
            if (!dashArray)
                dashArray = [10, 5];
            if (dashLength == 0)
                dashLength = 0.001; // Hack for Safari
            var dashCount = dashArray.length;
            this.moveTo(x, y);
            var dx = (x2 - x), dy = (y2 - y);
            var slope = dx ? dy / dx : 1e15;
            var distRemaining = Math.sqrt(dx * dx + dy * dy);
            var dashIndex = 0, draw = true;
            while (distRemaining >= 0.1) {
                var dashLength = dashArray[dashIndex++ % dashCount];
                if (dashLength > distRemaining)
                    dashLength = distRemaining;
                var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
                if (dx < 0)
                    xStep = -xStep;
                x += xStep;
                y += slope * xStep;
                this[draw ? 'lineTo' : 'moveTo'](x, y);
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
    var labelDesigner = (function () {
        function labelDesigner(canvasid, labelWidth, labelHeight) {
            this.canvas = document.getElementById(canvasid);
            this.canvasElement = $(this.canvas);
            this.labelWidth = labelWidth * this.dpi;
            this.labelHeight = labelHeight * this.dpi;
            this.propertyInspector = new bo.propertyInspector(this, this.canvas);
            this.toolbar = new bo.toolsWindow(this, this.canvas);
            this.labelSizeInspector = new bo.labelSizeInspector(this, this.canvas);
            this.labelInspector = new bo.labelInspector(this, this.canvas);
            this.dpi = 200;
            this.drawingContext = this.canvas.getContext("2d");
            this.elements = [];
            this.currentLayer = 0;
            this.activeElement = null;
            this.activeTool = null;
            this.labelX = this.canvas.width / 2 - this.labelWidth / 2;
            this.labelY = 5;
            this.dragStartPosition = new bo.helpers.point(0, 0);
            this.dragStartTime = 0;
            this.dragLastPosition = new bo.helpers.point(0, 0);
            this.dragElementOffset = new bo.helpers.point(0, 0);
            this.dragAction = 0;
            this.dragging = false;
            this.attachCanvasEvents();
            this.updateLabelSize(labelWidth, labelHeight);
            this.updateCanvas();
        }
        labelDesigner.prototype.updateLabelSize = function (width, height) {
            var xchange = (width * this.dpi + 10) - parseInt(this.canvasElement.prop("width"));
            this.labelWidth = width * this.dpi;
            this.labelHeight = height * this.dpi;
            this.canvasElement.prop("width", this.labelWidth + 10).prop("height", this.labelHeight + 10);
            this.labelX = this.canvas.width / 2 - this.labelWidth / 2;
            this.labelY = 5;
            this.propertyInspector.updatePosition(xchange);
            this.labelSizeInspector.updatePosition(xchange);
            this.labelInspector.updatePosition(xchange);
            this.updateCanvas();
        };
        labelDesigner.prototype.addObject = function (tool) {
            this.elements[this.currentLayer++] = tool;
            this.activeElement = this.elements[this.currentLayer - 1];
            this.updateCanvas();
        };
        labelDesigner.prototype.reset = function () {
            this.elements = [];
            this.currentLayer = 1;
            this.activeElement = null;
            this.updateCanvas();
        };
        labelDesigner.prototype.saveToJson = function () {
            var elements = this.elements
                .filter(function (value) { return value != null; })
                .map(function (value) {
                return value != null ? value.toSerializable() : null;
            });
            var saveModel = { height: this.labelHeight, width: this.labelWidth, dpi: this.dpi, items: elements };
            return JSON.stringify(saveModel);
        };
        labelDesigner.prototype.loadFromJson = function (json) {
            var model = JSON.parse(json);
            var elements = model.items.map(function (item) {
                return bo.designerTools.typeMapping[item.type].fromObject(item);
            });
            this.reset();
            this.dpi = model.dpi;
            this.updateLabelSize(model.width / model.dpi, model.height / model.dpi);
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var element = elements_1[_i];
                this.addObject(element);
            }
        };
        labelDesigner.prototype.deleteActiveElement = function () {
            if (this.activeElement) {
                for (var i = 0; i < this.currentLayer; i++) {
                    if (this.elements[i] && this.elements[i] == this.activeElement) {
                        this.elements[i] = null;
                        this.activeElement = null;
                    }
                }
            }
        };
        labelDesigner.prototype.setActiveElement = function () {
            var coordinates = this.canvas.relativeMouse(event);
            if (!this.activeElement || this.getHandle(coordinates) == 0) {
                this.activeElement = null;
                for (var i = this.currentLayer - 1; i >= 0; i--) {
                    if (this.elements[i] && this.elements[i].hitTest(coordinates)) {
                        this.activeElement = this.elements[i];
                        break;
                    }
                }
            }
            this.updateCanvas();
        };
        /**
         * Parameters: Coordinates on canvas.
         *
         * Returns: 0 if not on resize zone.
         *          1 top left     2 top     3 top right
         *          4 left                   5 right
         *          6 bottom left  7 bottom  8 bottom right
         */
        labelDesigner.prototype.setActiveHandle = function (coords) {
            this.dragAction = this.getHandle(coords);
        };
        labelDesigner.prototype.getHandle = function (coords) {
            var result = 0;
            if (this.activeElement.canResize !== true)
                return result;
            var leftEdge = coords.x > this.activeElement.x - 5 && coords.x < this.activeElement.x + 5;
            var rightEdge = coords.x > this.activeElement.x + this.activeElement.width - 5 && coords.x < this.activeElement.x + this.activeElement.width + 5;
            var topEdge = coords.y > this.activeElement.y - 5 && coords.y < this.activeElement.y + 5;
            var bottomEdge = coords.y > this.activeElement.y + this.activeElement.height - 5 && coords.y < this.activeElement.y + this.activeElement.height + 5;
            var verticalHit = coords.y > this.activeElement.y && coords.y < this.activeElement.y + this.activeElement.height;
            var horizontalHit = coords.x > this.activeElement.x && coords.x < this.activeElement.x + this.activeElement.width;
            if (leftEdge && topEdge)
                result = 1;
            else if (rightEdge && topEdge)
                result = 3;
            else if (leftEdge && bottomEdge)
                result = 6;
            else if (rightEdge && bottomEdge)
                result = 8;
            else if (topEdge && horizontalHit)
                result = 2;
            else if (leftEdge && verticalHit)
                result = 4;
            else if (rightEdge && verticalHit)
                result = 5;
            else if (bottomEdge && horizontalHit)
                result = 7;
            return result;
        };
        labelDesigner.prototype.move = function (point) {
            this.activeElement.x = point.x;
            this.activeElement.y = point.y;
        };
        labelDesigner.prototype.resize = function (xchange, ychange) {
            switch (this.dragAction) {
                case 1:
                    this.activeElement.x += xchange;
                    this.activeElement.y += ychange;
                    this.activeElement.width = (this.activeElement.width - xchange);
                    this.activeElement.height = (this.activeElement.height - ychange);
                    break;
                case 2:
                    this.activeElement.y += ychange;
                    this.activeElement.height = (this.activeElement.height - ychange);
                    break;
                case 3:
                    this.activeElement.width = (this.activeElement.width + xchange);
                    this.activeElement.y += ychange;
                    this.activeElement.height = (this.activeElement.height - ychange);
                    break;
                case 4:
                    this.activeElement.x += xchange;
                    this.activeElement.width = (this.activeElement.width - xchange);
                    break;
                case 5:
                    this.activeElement.width = (this.activeElement.width + xchange);
                    break;
                case 6:
                    this.activeElement.x += xchange;
                    this.activeElement.width = (this.activeElement.width - xchange);
                    this.activeElement.height = (this.activeElement.height + ychange);
                    break;
                case 7:
                    this.activeElement.height = (this.activeElement.height + ychange);
                    break;
                case 8:
                    this.activeElement.width = (this.activeElement.width + xchange);
                    this.activeElement.height = (this.activeElement.height + ychange);
                    break;
            }
            if (this.activeElement.width == 0) {
                this.activeElement.width = (-1);
                this.activeElement.x += 1;
            }
            if (this.activeElement.height == 0) {
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
        };
        labelDesigner.prototype.swapActionVertical = function () {
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
        };
        labelDesigner.prototype.swapActionHorizontal = function () {
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
        };
        labelDesigner.prototype.update = function () {
            this.propertyInspector.update(this.activeElement);
            this.labelInspector.update(this.activeElement);
        };
        labelDesigner.prototype.updateCanvas = function () {
            this.update();
            this.drawingContext.fillStyle = "#FFFFFF";
            this.drawingContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
            // Draw the boundary.
            this.drawingContext.strokeStyle = "#FF0000";
            this.drawingContext.lineWidth = 1;
            this.drawingContext.strokeRect(this.labelX, this.labelY, this.labelWidth, this.labelHeight);
            this.drawingContext.strokeStyle = "#000000";
            this.drawingContext.fillStyle = "#000000";
            for (var i = 0; i < this.currentLayer; i++) {
                if (this.elements[i]) {
                    this.elements[i].draw(this.drawingContext, this.canvas.width, this.canvas.height);
                }
            }
            this.drawingContext.strokeStyle = "#FF0000";
            this.drawingContext.lineCap = 'butt';
            this.drawingContext.lineWidth = 2;
            if (this.activeElement)
                this.activeElement.drawActive(this.drawingContext);
        };
        labelDesigner.prototype.setNewObject = function (controller) {
            if (controller) {
                this.newObjectController = controller;
            }
            else {
                this.newObjectController = null;
            }
        };
        labelDesigner.prototype.attachCanvasEvents = function () {
            var self = this;
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
                    self.newObjectController.button.removeClass("designerToolbarButtonActive");
                    self.newObjectController = null;
                }
                else {
                    self.dragAction = 0;
                    self.setActiveElement();
                    if (self.activeElement) {
                        self.dragElementOffset = new bo.helpers.point(self.activeElement.x - self.dragStartPosition.x, self.activeElement.y - self.dragStartPosition.y);
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
                    var coords = self.canvas.relativeMouse(event);
                    //console.log(self.dragAction);
                    switch (self.dragAction) {
                        case 0:
                            self.move(new bo.helpers.point(coords.x + self.dragElementOffset.x, coords.y + self.dragElementOffset.y));
                            break;
                        default:
                            self.resize(coords.x - self.dragLastPosition.x, coords.y - self.dragLastPosition.y);
                            break;
                    }
                    self.updateCanvas();
                    self.dragLastPosition = coords;
                }
                else if (self.newObjectController != null) {
                    self.canvasElement.css({ cursor: "crosshair" });
                }
                else if (self.activeElement) {
                    var coords = self.canvas.relativeMouse(event);
                    // If cursor is within range of edge, show resize handles
                    var location = self.getHandle(coords);
                    var style = "default";
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
                //event = event || window.event;
                var handled = false;
                switch (event.keyCode) {
                    case 37:
                        if (self.activeElement)
                            self.activeElement.x -= 1;
                        handled = true;
                        break;
                    case 38:
                        if (self.activeElement)
                            self.activeElement.y -= 1;
                        handled = true;
                        break;
                    case 39:
                        if (self.activeElement)
                            self.activeElement.x += 1;
                        handled = true;
                        break;
                    case 40:
                        if (self.activeElement)
                            self.activeElement.y += 1;
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
        };
        return labelDesigner;
    }());
    bo.labelDesigner = labelDesigner;
})(bo || (bo = {}));
//# sourceMappingURL=designer.js.map