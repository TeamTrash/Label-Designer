module bo.designerTools {
    export interface tool {
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

    export interface toolFactory {
        activate(window:toolsWindow);
        activateTool();
        deactivateTool();
        object(x: number, y: number, width: number, height: number): bo.designerTools.tool;
    }

    export const typeMapping: any = {
        'textTool': textTool,
        'rectangleTool': rectangleTool,
        'barcodeTool': barcodeTool,
        'imageTool': imageTool
    };
}