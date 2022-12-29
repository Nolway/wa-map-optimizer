import { PNG } from "pngjs";
import sharp, { Sharp } from "sharp";
import { LogLevel, OptimizeBufferOptions, OptimizedMapFiles } from "./guards/libGuards";
import { Map as MapFormat, MapLayer, MapTileset, MapTilesetTile } from "./guards/mapGuards";

sharp.cache(false);

export class Optimizer {
    private optimizedMap: MapFormat;
    private optimizedTiles: Map<number, number>;
    private optimizedTilesets: Map<MapTileset, Buffer>;
    private currentTilesetOptimization: MapTileset;
    private currentExtractedTiles: Promise<Buffer>[];
    private tileSize: number;
    private tilesetMaxTileCount: number;
    private tilesetName: string;
    private logLevel: LogLevel;

    constructor(
        map: MapFormat,
        private readonly tilesetsBuffers: Map<MapTileset, Sharp>,
        options: OptimizeBufferOptions | undefined = undefined
    ) {
        this.optimizedMap = map;
        this.optimizedTiles = new Map<number, number>();
        this.optimizedTilesets = new Map<MapTileset, Buffer>();
        this.tileSize = options?.tile?.size ?? 32;
        this.tilesetMaxTileCount = Math.pow(options?.output?.tileset?.size ?? 1024 / this.tileSize, 2);
        this.tilesetName = options?.output?.tileset?.name ?? "chunk";
        this.logLevel = options?.logs ?? LogLevel.NORMAL;

        this.currentTilesetOptimization = this.generateNextTileset();
        this.currentExtractedTiles = [];

        for (const tileset of [...tilesetsBuffers.keys()]) {
            if (tileset.tileheight !== this.tileSize || tileset.tilewidth !== this.tileSize) {
                throw Error(`Tileset ${tileset.name} not compatible! Accept only ${this.tileSize} tile size`);
            }
        }
    }

    public async optimize(): Promise<OptimizedMapFiles> {
        if (this.logLevel) {
            console.log("Start tiles optimization...");
        }

        await this.optimizeLayers(this.optimizedMap.layers);

        await this.currentTilesetRendering();

        const tilesetsBuffer = new Map<string, Buffer>();
        this.optimizedMap.tilesets = [];

        for (const currentTileset of this.optimizedTilesets) {
            this.optimizedMap.tilesets.push(currentTileset[0]);
            tilesetsBuffer.set(currentTileset[0].image, currentTileset[1]);
        }

        if (this.logLevel) {
            console.log("Tiles optimization has been done");
        }

        return {
            map: this.optimizedMap,
            tilesetsBuffer,
        };
    }

    private async optimizeLayers(layers: MapLayer[]): Promise<void> {
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
                const tileId = layer.data[y];

                if (tileId === 0) {
                    continue;
                }

                await this.checkCurrentTileset();

                const newTileId = this.optimizeNewTile(tileId);

                layer.data[y] = newTileId;
            }
        }
    }

    private generateNextTileset(): MapTileset {
        if (this.logLevel === LogLevel.VERBOSE) {
            console.log("Generate a new tileset data");
        }

        const tilesetCount = this.optimizedTilesets.size + 1;
        return {
            columns: 1,
            firstgid: this.optimizedTiles.size + 1,
            image: `${this.tilesetName}-${tilesetCount}.png`,
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

    private optimizeNewTile(tileId: number): number {
        if (this.logLevel === LogLevel.VERBOSE) {
            console.log(`${tileId} tile is optimizing...`);
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

        const existantNewTileId = this.optimizedTiles.get(unflippedTileId);

        if (existantNewTileId) {
            return existantNewTileId + minBitId;
        }

        let oldTileset: MapTileset | undefined;

        for (const tileset of this.tilesetsBuffers.keys()) {
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

        const newTileId = this.optimizedTiles.size + 1;

        this.optimizedTiles.set(unflippedTileId, newTileId);

        let newTileData: MapTilesetTile | undefined = undefined;

        this.currentExtractedTiles.push(this.extractTile(oldTileset, unflippedTileId));

        const oldTileIdInTileset = unflippedTileId - oldTileset.firstgid;
        const newTileIdInTileset = this.currentExtractedTiles.length - 1;

        if (oldTileset.properties) {
            newTileData = {
                id: newTileIdInTileset,
                properties: [...oldTileset.properties],
            };
            this.currentTilesetOptimization.tiles?.push(newTileData);
        }

        if (!oldTileset.tiles) {
            return newTileId + minBitId;
        }

        const tileData = oldTileset.tiles.find((tile) => tile.id === oldTileIdInTileset);

        if (!tileData) {
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
        }

        if (tileData.animation) {
            newTileData.animation = [];
            for (const frame of tileData.animation) {
                const newAnimationId = this.optimizeNewTile(oldTileset.firstgid + frame.tileid);

                if (!newAnimationId) {
                    throw new Error(
                        "Oops! An anmiation was beetween 2 tilesets, please modify the tileset output sizes"
                    );
                }

                newTileData.animation.push({
                    duration: frame.duration,
                    tileid: this.currentExtractedTiles.length - 1,
                });
            }
        }

        return newTileId + minBitId;
    }

    private async extractTile(tileset: MapTileset, tileId: number): Promise<Buffer> {
        const tileSizeSpaced = this.tileSize + tileset.spacing;
        const tilesetColumns = Math.floor((tileset.imagewidth - tileset.margin + tileset.spacing) / tileSizeSpaced);
        const tilesetTileId = tileId - tileset.firstgid + 1;

        const estimateLeft = tilesetTileId <= tilesetColumns ? tilesetTileId : tilesetTileId % tilesetColumns;
        const leftStartPoint =
            (estimateLeft === 0 ? tilesetColumns : estimateLeft) * tileSizeSpaced - tileSizeSpaced + tileset.margin;
        let topStartPoint = tileset.margin;
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

        const tileCount = this.currentExtractedTiles.length;
        const size = Math.ceil(Math.sqrt(tileCount));
        const imageSize = size * this.tileSize;

        this.currentTilesetOptimization.columns = size;
        this.currentTilesetOptimization.imagewidth = imageSize;
        this.currentTilesetOptimization.imageheight = imageSize;
        this.currentTilesetOptimization.tilecount = tileCount;

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

        this.optimizedTilesets.set(
            this.currentTilesetOptimization,
            await sharpTileset.composite(sharpComposites).toBuffer()
        );

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
