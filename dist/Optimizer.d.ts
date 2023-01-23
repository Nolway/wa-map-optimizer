import { Sharp } from "sharp";
import { LogLevel } from "./guards/libGuards";
import { Map as MapFormat, MapTileset } from "./guards/mapGuards";
export declare class Optimizer {
    private readonly tilesetsBuffers;
    private readonly outputPath;
    private optimizedMap;
    private optimizedTiles;
    private optimizedTilesets;
    private currentTilesetOptimization;
    private currentExtractedTiles;
    private tileSize;
    private outputSize;
    private tilesetMaxTileCount;
    private tilesetPrefix;
    private tilesetSuffix?;
    private logLevel;
    constructor(map: MapFormat, tilesetsBuffers: Map<MapTileset, Sharp>, options: {
        tile?: {
            size?: number | undefined;
        } | undefined;
        logs?: LogLevel | undefined;
        output?: {
            tileset?: {
                size?: number | undefined;
                prefix?: string | undefined;
                suffix?: string | undefined;
            } | undefined;
        } | undefined;
    } | undefined, outputPath: string);
    optimize(): Promise<MapFormat>;
    private optimizeLayers;
    private generateNextTileset;
    private generateNewTilesetBuffer;
    private optimizeNewTile;
    private extractTile;
    private checkCurrentTileset;
    private currentTilesetRendering;
}
