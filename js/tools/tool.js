var bo;
(function (bo) {
    var designerTools;
    (function (designerTools) {
        designerTools.typeMapping = {
            'textTool': designerTools.textTool,
            'rectangleTool': designerTools.rectangleTool,
            'barcodeTool': designerTools.barcodeTool,
            'imageTool': designerTools.imageTool
        };
    })(designerTools = bo.designerTools || (bo.designerTools = {}));
})(bo || (bo = {}));
//# sourceMappingURL=tool.js.map