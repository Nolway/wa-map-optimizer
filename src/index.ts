import fs from "fs";
import { PNG } from "pngjs";
import sharp from "sharp";
import { resolve } from "path";
import { isMap, Map as MapFormat, MapTileset, MapTilesetTile } from "./mapGuards";
import { OptimizeOptions } from "./libGuards";

async function getMap(mapFilePath: string): Promise<MapFormat> {
    let mapFile;

    try {
        mapFile = await fs.promises.readFile(mapFilePath);
    } catch (err) {
        throw Error(`Cannot get the map file: ${err}`);
    }
    const isRealMap = isMap.passthrough().safeParse(JSON.parse(mapFile.toString("utf-8")));

    if (!isRealMap.success) {
        console.error(isRealMap.error.issues);
        throw Error("Bad format on map file");
    }

    return isRealMap.data;
}

async function optimizeNewTile(
    map: MapFormat,
    tileId: number,
    tileSize: number,
    tilesetFiles: Map<MapTileset, Buffer>,
    optimizedTileset: MapTileset,
    optimizedTiles: Map<number, number>,
    optimizedTilesetFile: Buffer
): Promise<[number, Buffer]> {
    let oldTileset: MapTileset | undefined;

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

    const tile = await sharp(tilesetFiles.get(oldTileset))
        .extract({
            left: leftStartPoint,
            top: topStartPoint,
            width: tileSize,
            height: tileSize,
        })
        .toBuffer();

    let newOptimizedTilesetFile = await sharp(optimizedTilesetFile).toBuffer();

    if (optimizedTiles.size !== 0) {
        newOptimizedTilesetFile = await sharp(newOptimizedTilesetFile)
            .extend({
                right: tileSize,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .toBuffer();
    }

    newOptimizedTilesetFile = await sharp(newOptimizedTilesetFile)
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

    let newTileData: MapTilesetTile | undefined = undefined;

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
            let newFrameTileId: number;
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

export const optimize = async (
    mapFilePath: string,
    options: OptimizeOptions | undefined = undefined
): Promise<void> => {
    const map: MapFormat = await getMap(mapFilePath);
    const mapDirectoyPath = resolve(mapFilePath.substring(0, mapFilePath.lastIndexOf("/")));
    const tilesetFiles = new Map<MapTileset, Buffer>();
    const tileSize = options?.tile?.size ?? 32;

    for (const tileset of map.tilesets) {
        if (tileset.tileheight !== tileSize || tileset.tilewidth !== tileSize) {
            throw Error(`Tileset ${tileset.name} not compatible! Accept only ${tileSize} tile size`);
        }

        try {
            tilesetFiles.set(tileset, await fs.promises.readFile(resolve(`${mapDirectoyPath}/${tileset.image}`)));
        } catch (err) {
            throw Error(`Undefined tileset file: ${tileset.image}`);
        }
    }

    const optimizedTileset: MapTileset = {
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
    const optimizedTiles = new Map<number, number>();
    const newFile = new PNG({
        width: tileSize,
        height: tileSize,
        filterType: -1,
    });
    let optimizedTilesetFile = await newFile.pack().pipe(sharp()).toBuffer();

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

    if (!fs.existsSync(ouputPath)) {
        fs.mkdirSync(ouputPath, { recursive: true });
    }

    await Promise.all([
        fs.promises.writeFile(`${ouputPath}/${outputMapName}`, JSON.stringify(map, null, 2)),
        fs.promises.writeFile(`${ouputPath}/${outputTilesetName}`, optimizedTilesetFile),
    ]);
};
