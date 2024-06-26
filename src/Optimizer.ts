import {
    ITiledMap,
    ITiledMapEmbeddedTileset,
    ITiledMapLayer,
    ITiledMapTile,
} from "@workadventure/tiled-map-type-guard";
import { PNG } from "pngjs";
import sharp, { Sharp } from "sharp";
import { LogLevel, OptimizeBufferOptions } from "./guards/libGuards.js";

sharp.cache(false);

export class Optimizer {
    private optimizedMap: ITiledMap;
    /**
     * A map mapping the old tile id to the new tile id (global) and to the new tile id in the current tileset
     * @private
     */
    private optimizedTiles: Map<number, { global: number; local: number }>;
    private optimizedTilesets: ITiledMapEmbeddedTileset[];
    private currentTilesetOptimization: ITiledMapEmbeddedTileset;
    private currentExtractedTiles: Promise<Buffer>[];
    private tileSize: number;
    private outputSize: number;
    private tilesetMaxTileCount: number;
    private tilesetPrefix: string;
    private tilesetSuffix?: string;
    private logLevel: LogLevel;

    constructor(
        map: ITiledMap,
        private readonly tilesetsBuffers: Map<ITiledMapEmbeddedTileset, Sharp>,
        options: OptimizeBufferOptions | undefined = undefined,
        private readonly outputPath: string
    ) {
        this.optimizedMap = map;
        this.optimizedTiles = new Map<number, { global: number; local: number }>();
        this.optimizedTilesets = [];
        this.tileSize = options?.tile?.size ?? 32;
        this.outputSize = options?.output?.tileset?.size ? options?.output?.tileset?.size : 512;
        const maxColumns = this.outputSize / 32;
        this.tilesetMaxTileCount = maxColumns * maxColumns;
        this.tilesetPrefix = options?.output?.tileset?.prefix ?? "chunk";
        this.tilesetSuffix = options?.output?.tileset?.suffix;
        this.logLevel = options?.logs ?? LogLevel.NORMAL;

        this.currentTilesetOptimization = this.generateNextTileset();
        this.currentExtractedTiles = [];

        for (const tileset of [...tilesetsBuffers.keys()]) {
            if (tileset.tileheight !== this.tileSize || tileset.tilewidth !== this.tileSize) {
                throw Error(`Tileset ${tileset.name} not compatible! Accept only ${this.tileSize} tile size`);
            }
        }
    }

    public async optimize(): Promise<ITiledMap> {
        if (this.logLevel) {
            console.log("Start tiles optimization...");
        }

        await this.optimizeLayers(this.optimizedMap.layers);

        await this.optimizeNamedTiles();

        if (this.currentExtractedTiles.length > 0) {
            await this.currentTilesetRendering();
        }

        this.optimizedMap.tilesets = [];

        for (const currentTileset of this.optimizedTilesets) {
            this.optimizedMap.tilesets.push(currentTileset);
        }

        if (this.logLevel) {
            console.log("Tiles optimization has been done");
        }

        return this.optimizedMap;
    }

    private async optimizeLayers(layers: ITiledMapLayer[]): Promise<void> {
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];

            if (layer.type === "group") {
                if (!layer.layers) {
                    continue;
                }

                await this.optimizeLayers(layer.layers);
                continue;
            }

            if (layer.type !== "tilelayer") {
                continue;
            }

            if (!layer.data) {
                continue;
            }

            for (let y = 0; y < layer.data.length; y++) {
                if (typeof layer.data === "string") {
                    continue;
                }

                const tileId = layer.data[y];

                if (tileId === 0) {
                    continue;
                }

                await this.checkCurrentTileset();

                const newTileId = await this.optimizeNewTile(Number(tileId));

                layer.data[y] = newTileId;
            }
        }
    }

    private async optimizeNamedTiles(): Promise<void> {
        for (const tileset of this.tilesetsBuffers.keys()) {
            if (!tileset.tiles) {
                continue;
            }

            if (!tileset.firstgid) {
                throw new Error(`firstgid property is undefined on ${tileset.name} tileset`);
            }

            for (const tile of tileset.tiles) {
                const tileId = tileset.firstgid + tile.id;

                if (this.optimizedTiles.has(tileId)) {
                    continue;
                }

                if (!tile.properties) {
                    continue;
                }

                if (tile.properties.find((property) => property.name === "name")) {
                    await this.optimizeNewTile(tileId);
                }
            }
        }
    }

    private generateNextTileset(): ITiledMapEmbeddedTileset {
        if (this.logLevel === LogLevel.VERBOSE) {
            console.log("Generate a new tileset data");
        }

        const tilesetCount = this.optimizedTilesets.length + 1;
        return {
            columns: 1,
            firstgid: this.optimizedTiles.size + 1,
            image: `${this.tilesetPrefix}-${tilesetCount}${this.tilesetSuffix ? "-" + this.tilesetSuffix : ""}.png`,
            imageheight: 0,
            imagewidth: 0,
            margin: 0,
            name: `Chunk ${tilesetCount}`,
            properties: [],
            spacing: 0,
            tilecount: 0,
            tileheight: this.tileSize,
            tilewidth: this.tileSize,
            tiles: [],
        };
    }

    private async generateNewTilesetBuffer(size: number): Promise<Buffer> {
        const newFile = new PNG({
            width: size,
            height: size,
        });

        return await newFile.pack().pipe(sharp()).toBuffer();
    }

    private async optimizeNewTile(tileId: number): Promise<number> {
        if (this.logLevel === LogLevel.VERBOSE) {
            //console.log(`${tileId} tile is optimizing...`);
        }

        let minBitId;

        // 3758096384 = 29 & 30 & 31
        // 3221225472 = 30 & 31
        // 2684354560 = 29 & 31
        // 2147483648 = 31
        // 1610612736 = 29 & 30
        // 1073741824 = 30
        // 536870912 = 29

        const bit29 = Math.pow(2, 29);
        const bit30 = Math.pow(2, 30);
        const bit31 = Math.pow(2, 31);
        const bit32 = Math.pow(2, 32);

        if (tileId < bit29) {
            minBitId = 0;
        } else if (tileId < bit30) {
            minBitId = bit29;
        } else if (tileId < bit29 + bit30) {
            minBitId = bit30;
        } else if (tileId < bit31) {
            minBitId = bit29 + bit30;
        } else if (tileId < bit29 + bit31) {
            minBitId = bit31;
        } else if (tileId < bit30 + bit31) {
            minBitId = bit29 + bit31;
        } else if (tileId < bit29 + bit30 + bit31) {
            minBitId = bit30 + bit31;
        } else if (tileId < bit32) {
            minBitId = bit29 + bit30 + bit31;
        } else {
            throw new Error(`Something was wrong with flipped tile id ${tileId}`);
        }

        const unflippedTileId = tileId - minBitId;

        const existantNewTileId = this.optimizedTiles.get(unflippedTileId)?.global;

        if (existantNewTileId) {
            return existantNewTileId + minBitId;
        }

        let oldTileset: ITiledMapEmbeddedTileset | undefined;

        for (const tileset of this.tilesetsBuffers.keys()) {
            if (!tileset.firstgid) {
                throw new Error(`firstgid property is undefined on ${tileset.name} tileset`);
            }

            if (!tileset.tilecount) {
                throw new Error(`tilecount property is undefined on ${tileset.name} tileset`);
            }

            if (tileset.firstgid <= unflippedTileId && tileset.firstgid + tileset.tilecount > unflippedTileId) {
                oldTileset = tileset;
                break;
            }
        }

        if (!oldTileset) {
            if (this.logLevel) {
                console.error(`${tileId} undefined! Corrupted layers or undefined in tilesets`);
                console.error("This tile has been replaced by a empty tile");
            }
            return 0;
        }

        if (!oldTileset.firstgid) {
            throw new Error(`firstgid property is undefined on ${oldTileset.name} tileset`);
        }

        const oldFirstgid = oldTileset.firstgid;
        const oldTileIdInTileset = unflippedTileId - oldFirstgid;

        let tileData: ITiledMapTile | undefined = undefined;

        if (oldTileset.tiles) {
            tileData = oldTileset.tiles.find((tile) => tile.id === oldTileIdInTileset);

            if (tileData && tileData.animation) {
                if (tileData.animation.length + this.currentExtractedTiles.length > this.tilesetMaxTileCount) {
                    for (let i = 1; i < this.tilesetMaxTileCount - this.currentExtractedTiles.length; i++) {
                        this.optimizedTiles.set(-1, {
                            global: this.optimizedTiles.size + i,
                            local: 0,
                        });
                    }

                    await this.currentTilesetRendering();
                }
            }
        }

        const newTileId = this.optimizedTiles.size + 1;

        this.optimizedTiles.set(unflippedTileId, {
            global: newTileId,
            local: this.currentExtractedTiles.length,
        });

        let newTileData: ITiledMapTile | undefined = undefined;

        this.currentExtractedTiles.push(this.extractTile(oldTileset, unflippedTileId));

        const newTileIdInTileset = this.currentExtractedTiles.length - 1;

        if (oldTileset.properties) {
            newTileData = {
                id: newTileIdInTileset,
                properties: [...oldTileset.properties],
            };
        }

        if (!oldTileset.tiles) {
            if (newTileData) {
                this.currentTilesetOptimization.tiles?.push(newTileData);
            }
            return newTileId + minBitId;
        }

        if (!tileData) {
            if (newTileData) {
                this.currentTilesetOptimization.tiles?.push(newTileData);
            }
            return newTileId + minBitId;
        }

        if (!newTileData) {
            newTileData = {
                id: newTileIdInTileset,
            };
            this.currentTilesetOptimization.tiles?.push(newTileData);
        }

        if (tileData.properties) {
            newTileData.properties
                ? newTileData.properties.push(...tileData.properties)
                : (newTileData.properties = [...tileData.properties]);
            this.currentTilesetOptimization.tiles?.push(newTileData);
        }

        if (tileData.animation) {
            newTileData.animation = [];
            for (const frame of tileData.animation) {
                await this.optimizeNewTile(oldFirstgid + frame.tileid);
                const newTile = this.optimizedTiles.get(oldFirstgid + frame.tileid)?.local;
                if (newTile === undefined) {
                    throw new Error(`Undefined tile in animation for ${oldFirstgid + frame.tileid}`);
                }

                newTileData.animation.push({
                    duration: frame.duration,
                    tileid: newTile,
                });
            }
        }

        return newTileId + minBitId;
    }

    private async extractTile(tileset: ITiledMapEmbeddedTileset, tileId: number): Promise<Buffer> {
        if (!tileset.imagewidth) {
            throw new Error(`imagewidth property is undefined on ${tileset.name} tileset`);
        }

        if (!tileset.firstgid) {
            throw new Error(`firstgid property is undefined on ${tileset.name} tileset`);
        }

        const tileSizeSpaced = this.tileSize + (tileset.spacing || 0);
        const tilesetColumns = Math.floor(
            (tileset.imagewidth - (tileset.margin || 0) + (tileset.spacing || 0)) / tileSizeSpaced
        );
        const tilesetTileId = tileId - tileset.firstgid + 1;

        const estimateLeft = tilesetTileId <= tilesetColumns ? tilesetTileId : tilesetTileId % tilesetColumns;
        const leftStartPoint =
            (estimateLeft === 0 ? tilesetColumns : estimateLeft) * tileSizeSpaced -
            tileSizeSpaced +
            (tileset.margin || 0);
        let topStartPoint = tileset.margin || 0;
        let state = tilesetTileId;

        while (state > tilesetColumns) {
            state -= tilesetColumns;
            topStartPoint += tileSizeSpaced;
        }

        const sharpObject = this.tilesetsBuffers.get(tileset);

        if (!sharpObject) {
            throw new Error("Undefined sharp object");
        }

        return await sharpObject
            .extract({
                left: leftStartPoint,
                top: topStartPoint,
                width: this.tileSize,
                height: this.tileSize,
            })
            .toBuffer();
    }

    private async checkCurrentTileset(): Promise<void> {
        if (this.currentExtractedTiles.length < this.tilesetMaxTileCount) {
            return;
        }
        await this.currentTilesetRendering();
    }

    private async currentTilesetRendering(): Promise<void> {
        if (this.logLevel) {
            console.log(`Rendering of ${this.currentTilesetOptimization.name} tileset...`);
        }

        this.currentTilesetOptimization.tilecount = this.currentExtractedTiles.length;
        const columnCount = Math.ceil(Math.sqrt(this.currentTilesetOptimization.tilecount));
        const imageSize = columnCount * this.tileSize;
        this.currentTilesetOptimization.columns = columnCount;
        this.currentTilesetOptimization.imagewidth = imageSize;
        this.currentTilesetOptimization.imageheight = imageSize;

        const tilesetBuffer = await this.generateNewTilesetBuffer(imageSize);

        if (this.logLevel === LogLevel.VERBOSE) {
            console.log("Empty image generated");
        }

        const sharpTileset = sharp(tilesetBuffer);

        if (this.logLevel === LogLevel.VERBOSE) {
            console.log("Loading of all tiles who will be optimized...");
        }

        const tileBuffers = await Promise.all(this.currentExtractedTiles);

        if (this.logLevel === LogLevel.VERBOSE) {
            console.log("Tiles loading finished");
            console.log("Tileset optimized image generating...");
        }

        const sharpComposites: sharp.OverlayOptions[] = [];

        let x = 0;
        let y = 0;

        for (const tileBuffer of tileBuffers) {
            if (x === imageSize) {
                y += this.tileSize;
                x = 0;
            }

            sharpComposites.push({
                input: tileBuffer,
                top: y,
                left: x,
            });

            x += this.tileSize;
        }

        await sharpTileset
            .composite(sharpComposites)
            .toFile(`${this.outputPath}/${this.currentTilesetOptimization.image}`);

        this.optimizedTilesets.push(this.currentTilesetOptimization);

        if (this.logLevel === LogLevel.VERBOSE) {
            console.log("Tileset optimized image generated");
        }

        if (this.logLevel) {
            console.log("The tileset has been rendered");
        }

        this.currentTilesetOptimization = this.generateNextTileset();
        this.currentExtractedTiles = [];
    }
}
