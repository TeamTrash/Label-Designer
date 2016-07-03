module bo.designerTools {
	export class imageFactory implements toolFactory {
		constructor() {
			this.button = $("<div></div>").addClass("designerToolbarImage designerToolbarButton").attr("title", "Image").append($("<div></div>"));
		}

		width: number;
		height: number;

		private button: JQuery;
		private counter: number;
		private data: any;

		object(x: number, y: number, width: number, height: number): bo.designerTools.tool {
			this.button.removeClass("designerToolbarButtonActive");

			return this.internalObject(x, y, width, height, null);
		}
		
		activateTool():void{
			this.button.addClass("designerToolbarButtonActive");
		}
		
		deactivateTool():void{
			this.button.removeClass("designerToolbarButtonActive");
		}

		private internalObject(x: number, y: number, width: number, height: number, data: any): bo.designerTools.tool {
			this.counter = this.counter || 1;
			var result = new imageTool(this.counter++, x, y, width, height);
			result.data = data;
			return result;
		}

		activate(toolbar: toolsWindow) {
			this.data = null;
			var self = this;

			// Open up a dialog to get the image
			var dialog = $("<div></div>").prop("title", "Add Image") as any;
			var imageFile = $("<input type=\"file\" />").css({ width: 400 })
				.on("change", function () {
					var input = imageFile[0] as any;
					if (!input.files[0]) {
						alert('Please select a file to insert.');
					}
					else {
						var file = input.files[0];
						var reader = new FileReader();
						var insertImg = imageLeft as any;
						var canvasResult = imageRight;
						reader.onloadend = function () {
							var canvas = canvasResult as any;
							var imgSelf = insertImg as any;
							insertImg.css({ "width": "auto", "height": "auto", "max-width": 200, "max-height": 200 });
							canvas.css({ "width": "auto", "height": "auto" });
							insertImg[0].onload = function () {
								var tCanvas = $("<canvas />") as any;
								tCanvas[0].width = imgSelf[0].width;
								tCanvas[0].height = imgSelf[0].height;
								canvas[0].width = imgSelf[0].width;
								canvas[0].height = imgSelf[0].height;
								var tctx = tCanvas[0].getContext("2d");
								var ctx = canvas[0].getContext("2d");
								tctx.drawImage(imgSelf[0], 0, 0, tCanvas[0].width, tCanvas[0].height);
								var tImgData = tctx.getImageData(0, 0, tCanvas[0].width, tCanvas[0].height);
								var imgData = ctx.getImageData(0, 0, tCanvas[0].width, tCanvas[0].height);

								// Convert the canvas data to GRF.
								for (var y = 0; y < tCanvas[0].height; y++) {
									for (var x = 0; x < tCanvas[0].width; x++) {
										var pixelStart = 4 * (tCanvas[0].width * y + x);
										var luminance = tImgData.data[pixelStart] * 0.299 + tImgData.data[pixelStart + 1] * 0.587 + tImgData.data[pixelStart + 2] * 0.114;

										if (luminance > 127) {
											imgData.data[pixelStart] = 255;
											imgData.data[pixelStart + 1] = 255;
											imgData.data[pixelStart + 2] = 255;
											imgData.data[pixelStart + 3] = 255;
										}
										else {
											imgData.data[pixelStart] = 0;
											imgData.data[pixelStart + 1] = 0;
											imgData.data[pixelStart + 2] = 0;
											imgData.data[pixelStart + 3] = 255;
										}
									}
								}
								self.width = canvas[0].width;
								self.height = canvas[0].height;
								self.data = imgData.data;

								ctx.putImageData(imgData, 0, 0);
							}
							insertImg[0].src = reader.result;
						}
						reader.readAsDataURL(file);
					}
				}).appendTo(dialog);
			var imageContainer = $("<div></div>").css({ "padding-top": "5px" });
			var imageLeft = $("<img />").prop("src", "images/blank.gif").prop("border", "none").css({ float: "left", width: 200, height: 200, border: "1px solid #DDDDDD" }).appendTo(imageContainer);
			var imageRight = $("<canvas />").css({ float: "right", width: 200, height: 200, border: "1px solid #DDDDDD" }).appendTo(imageContainer);

			imageContainer.appendTo(dialog);

			var Toolbar = toolbar;
			dialog.dialog({
				modal: true,
				width: 470,
				height: 400,
				buttons: {
					"Insert": function () {
						// Insert the image onto the screen.
						Toolbar.designer.addObject(self.internalObject(0, 0, self.width, self.height, self.data));
						($(this) as any).dialog("close");
					},
					"Cancel": function () {
						self.data = null;
						($(this) as any).dialog("close");
					}
				}
			})
				.on("dialogclose", { toolbar: toolbar }, function (event) {
					self.button.removeClass("designerToolbarButtonActive");
					event.data.toolbar.setTool(null);
				});
		};
	}

	export class imageTool implements tool {
		constructor(counter: number, x: number, y: number, width: number, height: number) {
			this.uniqueID = counter;
			this.name = "Image " + counter;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height; x
			this.rotation = 0;
			this.canResize = true;

			this.properties = [
				{
					name: "name", text: "name", readonly: false, type: "text"
					, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; }
				},
				{
					name: "x", text: "x", readonly: false, type: "number"
					, get: function (obj) { return obj.x; }, set: function (obj, value) { obj.x = value }
				},
				{
					name: "y", text: "y", readonly: false, type: "number"
					, get: function (obj) { return obj.y; }, set: function (obj, value) { obj.y = value }
				},
				{
					name: "width", text: "width", readonly: true, type: "text"
					, get: function (obj) { return obj.width; }, set: function (obj, value) { obj.width = value; }
				},
				{
					name: "height", text: "height", readonly: true, type: "text"
					, get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; }
				}
			];
		}

		name: string;
		x: number;
		y: number;
		width: number;
		height: number;
		data: any;
		rotation: number;
		canResize: boolean;
		properties: any;
		uniqueID: number;

		draw(context: any, width: number, height: number) {
			var ctxData = context.getImageData(0, 0, width, height);
			for (var y = 0; y < this.height; y++) {
				for (var x = 0; x < this.width; x++) {
					if (this.x + x >= 0 && this.x + x < width
						&& this.y + y >= 0 && this.y + y < height) {
						var drawPoint = 4 * (width * (this.y + y) + this.x + x);
						var drawFromPoint = 4 * (this.width * y + x);
						ctxData.data[drawPoint] = this.data[drawFromPoint];
						ctxData.data[drawPoint + 1] = this.data[drawFromPoint + 1];
						ctxData.data[drawPoint + 2] = this.data[drawFromPoint + 2];
						ctxData.data[drawPoint + 3] = this.data[drawFromPoint + 3];
					}
				}
			}

			context.putImageData(ctxData, 0, 0);
		}

		drawActive(context: any) {
			context.dashedStroke((this.x - 5), (this.y - 5), (this.x) + (this.width) + 5, (this.y) + (this.height) + 5, [2, 2]);
		}

		hitTest(coords: any) {
			return (coords.x >= (this.x) && coords.x <= (this.x) + (this.width) && coords.y >= (this.y) && coords.y <= (this.y) + (this.height));
		}

        toSerializable(): any {
			return {
				type: "imageTool", uniqueID: this.uniqueID, name: this.name, x: this.x, y: this.y,
				width: this.width, height: this.height, data: this.data
			};
		}

        static fromObject(object: any) {
			var result = new imageTool(object.uniqueID, object.x, object.y, object.width, object.height);
			result.data = object.data;
			result.name = object.name;

			return result;
		}
	}
}