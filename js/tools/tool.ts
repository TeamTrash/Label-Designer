module bo.designerTools {
    export interface Tool {
        name: string;
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
        canResize: boolean;
        properties: any;

        draw(context: any, width?: number, height?: number): void;
        drawActive(context): void;
        hitTest(coords): boolean;
        toSerializable(): any;
    }

    export interface ToolFactory {
        activate(window: ToolsWindow);
        activateTool();
        deactivateTool();
        object(x: number, y: number, width: number, height: number): bo.designerTools.Tool;
    }

    export const typeMapping: any = {
        "textTool": TextTool,
        "rectangleTool": RectangleTool,
        "barcodeTool": BarcodeTool,
        "imageTool": ImageTool,
    };
}
