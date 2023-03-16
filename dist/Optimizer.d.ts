import { ITiledMap, ITiledMapEmbeddedTileset } from "@workadventure/tiled-map-type-guard";
import { Sharp } from "sharp";
import { LogLevel } from "./guards/libGuards";
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
    constructor(map: ITiledMap, tilesetsBuffers: Map<ITiledMapEmbeddedTileset, Sharp>, options: {
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
    optimize(): Promise<ITiledMap>;
    private optimizeLayers;
    private generateNextTileset;
    private generateNewTilesetBuffer;
    private optimizeNewTile;
    private extractTile;
    private checkCurrentTileset;
    private currentTilesetRendering;
}
