var bo;
(function (bo) {
    var LabelSizeInspector = (function () {
        function LabelSizeInspector(designer, container) {
            this.designer = designer;
            this.container = container;
            this.buttonView = this.buildButtonView(container);
        }
        LabelSizeInspector.prototype.update = function (activeElement) { };
        LabelSizeInspector.prototype.addTool = function (controller) {
            this.buttonView.append(controller.workspace);
        };
        LabelSizeInspector.prototype.buildButtonView = function (container) {
            var top = $("<nav></nav>")
                .addClass("navbar navbar-default")
                .appendTo(container);
            var fluid = $("<div></div>").addClass("container-fluid").appendTo(top);
            $("<div></div>").addClass("navbar-header")
                .append($("<span></span>").addClass("navbar-brand").html("Label Designer"))
                .appendTo(fluid);
            var navbar = $("<div></div>")
                .addClass("collapse navbar-collapse")
                .appendTo(fluid);
            var form = $("<form></form>").addClass("navbar-form").appendTo(navbar);
            return form;
        };
        return LabelSizeInspector;
    }());
    bo.LabelSizeInspector = LabelSizeInspector;
})(bo || (bo = {}));
//# sourceMappingURL=designer_labelSizeInspector.js.map