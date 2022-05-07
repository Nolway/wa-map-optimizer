"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimize = void 0;
const fs_1 = __importDefault(require("fs"));
const pngjs_1 = require("pngjs");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = require("path");
const mapGuards_1 = require("./mapGuards");
async function getMap(mapFilePath) {
    let mapFile;
    try {
        mapFile = await fs_1.default.promises.readFile(mapFilePath);
    } catch (err) {
        throw Error(`Cannot get the map file: ${err}`);
    }
    const isRealMap = mapGuards_1.isMap.passthrough().safeParse(JSON.parse(mapFile.toString("utf-8")));
    if (!isRealMap.success) {
        console.error(isRealMap.error.issues);
        throw Error("Bad format on map file");
    }
    return isRealMap.data;
}
async function optimizeNewTile(
    map,
    tileId,
    tileSize,
    tilesetFiles,
    optimizedTileset,
    optimizedTiles,
    optimizedTilesetFile
) {
    let oldTileset;
    for (const tileset of tilesetFiles.keys()) {
        if (tileset.firstgid <= tileId && tileset.firstgid + tileset.tilecount > tileId) {
            oldTileset = tileset;
            break;
        }
    }
    if (!oldTileset) {
        throw Error("Corrupted layers or undefined tileset");
    }
    const tilesetColumns = oldTileset.imagewidth / tileSize;
    const tilesetTileId = tileId - oldTileset.firstgid + 1;
    let leftStartPoint = 0;
    let topStartPoint = 0;
    for (let x = 0; x < tilesetColumns; x++) {
        if (tilesetTileId > tilesetColumns * (x + 1)) {
            topStartPoint += tileSize;
            continue;
        }
        leftStartPoint = (tileId - tilesetColumns * x) * tileSize - tileSize;
        break;
    }
    const tile = await (0, sharp_1.default)(tilesetFiles.get(oldTileset))
        .extract({
            left: leftStartPoint,
            top: topStartPoint,
            width: tileSize,
            height: tileSize,
        })
        .toBuffer();
    let newOptimizedTilesetFile = await (0, sharp_1.default)(optimizedTilesetFile).toBuffer();
    if (optimizedTiles.size !== 0) {
        newOptimizedTilesetFile = await (0, sharp_1.default)(newOptimizedTilesetFile)
            .extend({
                right: tileSize,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .toBuffer();
    }
    newOptimizedTilesetFile = await (0, sharp_1.default)(newOptimizedTilesetFile)
        .composite([
            {
                input: tile,
                top: 0,
                left: tileSize * optimizedTiles.size,
            },
        ])
        .toBuffer();
    const newTileId = optimizedTiles.size + 1;
    optimizedTiles.set(tileId, newTileId);
    let newTileData = undefined;
    if (oldTileset.properties) {
        newTileData = {
            id: newTileId,
            properties: oldTileset.properties,
        };
        optimizedTileset.tiles?.push(newTileData);
    }
    if (!oldTileset.tiles) {
        return [newTileId, newOptimizedTilesetFile];
    }
    const tileData = oldTileset.tiles.find((tile) => tile.id === tileId);
    if (!tileData) {
        return [newTileId, newOptimizedTilesetFile];
    }
    if (!newTileData) {
        newTileData = {
            id: newTileId,
        };
        optimizedTileset.tiles?.push(newTileData);
    }
    if (tileData.properties) {
        newTileData.properties
            ? newTileData.properties.push(...tileData.properties)
            : (newTileData.properties = tileData.properties);
    }
    if (tileData.animation) {
        newTileData.animation = [];
        for (const frame of tileData.animation) {
            let newFrameTileId;
            const existantNewFrameTileId = optimizedTiles.get(frame.tileid);
            if (existantNewFrameTileId) {
                newFrameTileId = existantNewFrameTileId;
            } else {
                const newOptimisedTile = await optimizeNewTile(
                    map,
                    tileId,
                    tileSize,
                    tilesetFiles,
                    optimizedTileset,
                    optimizedTiles,
                    newOptimizedTilesetFile
                );
                newFrameTileId = newOptimisedTile[0];
                newOptimizedTilesetFile = newOptimisedTile[1];
            }
            newTileData.animation.push({
                duration: frame.duration,
                tileid: newFrameTileId,
            });
        }
    }
    return [newTileId, newOptimizedTilesetFile];
}
const optimize = async (mapFilePath, options = undefined) => {
    const map = await getMap(mapFilePath);
    const mapDirectoyPath = (0, path_1.resolve)(mapFilePath.substring(0, mapFilePath.lastIndexOf("/")));
    const tilesetFiles = new Map();
    const tileSize = options?.tile?.size ?? 32;
    for (const tileset of map.tilesets) {
        if (tileset.tileheight !== tileSize || tileset.tilewidth !== tileSize) {
            throw Error(`Tileset ${tileset.name} not compatible! Accept only ${tileSize} tile size`);
        }
        try {
            tilesetFiles.set(
                tileset,
                await fs_1.default.promises.readFile((0, path_1.resolve)(`${mapDirectoyPath}/${tileset.image}`))
            );
        } catch (err) {
            throw Error(`Undefined tileset file: ${tileset.image}`);
        }
    }
    const optimizedTileset = {
        columns: 0,
        firstgid: 1,
        image: "optimized.png",
        imageheight: 0,
        imagewidth: 0,
        margin: 0,
        name: "Optimized",
        properties: [],
        spacing: 0,
        tilecount: 0,
        tileheight: tileSize,
        tilewidth: tileSize,
        tiles: [],
    };
    const optimizedTiles = new Map();
    const newFile = new pngjs_1.PNG({
        width: tileSize,
        height: tileSize,
        filterType: -1,
    });
    let optimizedTilesetFile = await newFile
        .pack()
        .pipe((0, sharp_1.default)())
        .toBuffer();
    for (let i = 0; i < map.layers.length; i++) {
        const layer = map.layers[i];
        if (!layer.data) {
            continue;
        }
        for (let y = 0; y < layer.data.length; y++) {
            const tileId = layer.data[y];
            if (tileId === 0) {
                continue;
            }
            const existantNewTileId = optimizedTiles.get(tileId);
            if (existantNewTileId) {
                layer.data[y] = existantNewTileId;
                continue;
            }
            const updatedData = await optimizeNewTile(
                map,
                tileId,
                tileSize,
                tilesetFiles,
                optimizedTileset,
                optimizedTiles,
                optimizedTilesetFile
            );
            layer.data[y] = updatedData[0];
            optimizedTilesetFile = updatedData[1];
        }
    }
    map.tilesets = [optimizedTileset];
    const ouputPath = mapDirectoyPath + "/" + (options?.output?.path ?? "dist");
    const outputMapName = (options?.output?.mapName ?? "map") + ".json";
    const outputTilesetName = (options?.output?.tilesetName ?? "chunk") + ".png";
    optimizedTileset.columns = optimizedTiles.size;
    optimizedTileset.imageheight = tileSize;
    optimizedTileset.imagewidth = optimizedTiles.size * tileSize;
    optimizedTileset.tilecount = optimizedTiles.size;
    optimizedTileset.image = outputTilesetName;
    if (!fs_1.default.existsSync(ouputPath)) {
        fs_1.default.mkdirSync(ouputPath, { recursive: true });
    }
    await Promise.all([
        fs_1.default.promises.writeFile(`${ouputPath}/${outputMapName}`, JSON.stringify(map, null, 2)),
        fs_1.default.promises.writeFile(`${ouputPath}/${outputTilesetName}`, optimizedTilesetFile),
    ]);
};
exports.optimize = optimize;
