var bo;
(function (bo) {
    var PropertyInspector = (function () {
        function PropertyInspector(designer, container) {
            var _this = this;
            this.designer = designer;
            this.container = container;
            this.activeElement = null;
            this.propertyNodes = {};
            this.propertyView = this.buildPropertyView(container);
            this.designer.updating.on(function (tool) { return _this.update(tool); });
        }
        PropertyInspector.prototype.update = function (activeElement) {
            var self = this;
            var same = this.activeElement === activeElement;
            this.activeElement = activeElement;
            if (this.activeElement == null) {
                return;
            }
            if (same) {
                for (var _i = 0, _a = activeElement.properties; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (!item.readonly) {
                        this.propertyNodes[item.name].val(item.get(activeElement));
                    }
                }
            }
            else {
                this.propertyView.html("");
                var table = $("<table>").addClass("table table-responsive table-striped");
                $("<thead><tr><th>key</th><th>value</th><td></thead>").appendTo(table);
                $("<tbody>").appendTo(table);
                for (var _b = 0, _c = activeElement.properties; _b < _c.length; _b++) {
                    var item = _c[_b];
                    var row = $("<tr></tr>");
                    var editor = null;
                    if (item.type === "text" || item.type === "number") {
                        editor = $("<input class='form-control' type='text' name='" + item.name + "'' value='" + item.get(activeElement) + "'>");
                    }
                    else if (item.type === "options") {
                        editor = $("<select class='form-control' name='" + item.name + "'' value='" + item.get(activeElement) + "'>");
                        for (var _d = 0, _e = item.options; _d < _e.length; _d++) {
                            var option = _e[_d];
                            editor.append($("<option value='" + option + "'>" + option + "</option>"));
                        }
                    }
                    if (!item.readonly) {
                        editor.on("change", { "objectProperty": item.name }, function (event) {
                            var data = self.activeElement[event.data.objectProperty];
                            self.activeElement[event.data.objectProperty] = (data === parseInt(data, 10)) ? parseInt($(this).val(), 10) : $(this).val();
                            self.designer.updateCanvas();
                        });
                    }
                    row.append($("<td>" + item.text + "</td>"))
                        .append($("<td></td>").append(editor))
                        .appendTo(table);
                    this.propertyNodes[item.name] = editor;
                }
                this.propertyView.append(table);
            }
        };
        PropertyInspector.prototype.buildPropertyView = function (container) {
            return $("<div></div>")
                .appendTo(container);
        };
        return PropertyInspector;
    }());
    bo.PropertyInspector = PropertyInspector;
})(bo || (bo = {}));
//# sourceMappingURL=designer_propertyInspector.js.map