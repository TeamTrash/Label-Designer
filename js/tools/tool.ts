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
    }

    export interface toolFactory {
        button: JQuery;
        object(x: number, y: number, width: number, height: number): bo.designerTools.tool;
    }
}