var bo;
(function (bo) {
    var designerTools;
    (function (designerTools) {
        designerTools.typeMapping = {
            "textTool": designerTools.TextTool,
            "rectangleTool": designerTools.RectangleTool,
            "barcodeTool": designerTools.BarcodeTool,
            "imageTool": designerTools.ImageTool,
        };
    })(designerTools = bo.designerTools || (bo.designerTools = {}));
})(bo || (bo = {}));
//# sourceMappingURL=tool.js.map