/// <reference types="node" />
import { OptimizeBufferOptions, OptimizedMapFiles } from "./guards/libGuards";
import { Map as MapFormat, MapTileset } from "./guards/mapGuards";
export declare class Optimizer {
    private readonly tilesetsBuffers;
    private optimizedMap;
    private optimizedTiles;
    private optimizedTilesets;
    private currentTilesetOptimization;
    private currentExtractedTiles;
    private tileSize;
    private tilesetMaxColumns;
    private tilesetMaxLines;
    private tilesetName;
    private allowLogs;
    constructor(map: MapFormat, tilesetsBuffers: Map<MapTileset, Buffer>, options?: OptimizeBufferOptions | undefined);
    optimize(): Promise<OptimizedMapFiles>;
    private optimizeLayers;
    private generateNextTileset;
    private generateNewTilesetBuffer;
    private optimizeNewTile;
    private extractTile;
    private checkCurrentTileset;
    private currentTilesetRendering;
}
