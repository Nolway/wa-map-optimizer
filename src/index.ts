import fs from "fs";
import path, { resolve } from "path";
import sharp, { Sharp } from "sharp";
import { LogLevel, OptimizeBufferOptions, OptimizedMapFiles, OptimizeOptions } from "./guards/libGuards";
import { isMap, Map as MapFormat, MapTileset } from "./guards/mapGuards";
import { Optimizer } from "./Optimizer";

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

export const optimize = async (
    mapFilePath: string,
    options: OptimizeOptions | undefined = undefined
): Promise<void> => {
    const map: MapFormat = await getMap(mapFilePath);
    const mapDirectoyPath = resolve(mapFilePath.substring(0, mapFilePath.lastIndexOf("/")));
    const tilesets = new Map<MapTileset, Sharp>();
    const mapName = path.parse(mapFilePath).name;
    const mapExtension = path.parse(mapFilePath).ext;
    const logLevel = options?.logs ?? LogLevel.NORMAL;

    if (logLevel) {
        console.log(`${mapName} optimization is started!`);
    }

    for (const tileset of map.tilesets) {
        try {
            const { data, info } = await sharp(resolve(`${mapDirectoyPath}/${tileset.image}`))
                .raw()
                .toBuffer({ resolveWithObject: true });

            tilesets.set(
                tileset,
                sharp(new Uint8ClampedArray(data.buffer), {
                    raw: {
                        width: info.width,
                        height: info.height,
                        channels: info.channels,
                    },
                }).png()
            );
        } catch (err) {
            throw Error(`Undefined tileset file: ${tileset.image}`);
        }
    }

    const optimizer = new Optimizer(map, tilesets, options);
    const result = await optimizer.optimize();

    const outputMapName = (options?.output?.map?.name ?? mapName) + mapExtension;
    const ouputPath = options?.output?.path ?? `${mapDirectoyPath}/dist`;

    if (!fs.existsSync(ouputPath)) {
        fs.mkdirSync(ouputPath, { recursive: true });
    }

    const tilesetsPromises: Promise<void>[] = [];

    for (const [tilesetName, tilesetBuffer] of result.tilesetsBuffer) {
        tilesetsPromises.push(fs.promises.writeFile(`${ouputPath}/${tilesetName}`, tilesetBuffer));
    }

    if (logLevel) {
        console.log(`${mapName} file render is in progress!`);
    }

    await Promise.all([
        fs.promises.writeFile(`${ouputPath}/${outputMapName}`, JSON.stringify(map, null, 0)),
        ...tilesetsPromises,
    ]);
};

export const optimizeToBuffer = async (
    map: MapFormat,
    tilesetsBuffers: Map<MapTileset, Buffer>,
    options: OptimizeBufferOptions | undefined = undefined
): Promise<OptimizedMapFiles> => {
    const tilesets = new Map<MapTileset, Sharp>();

    for (const tileset of tilesetsBuffers.keys()) {
        const { data, info } = await sharp(tilesetsBuffers.get(tileset)).raw().toBuffer({ resolveWithObject: true });
        tilesets.set(
            tileset,
            sharp(new Uint8ClampedArray(data.buffer), {
                raw: {
                    width: info.width,
                    height: info.height,
                    channels: info.channels,
                },
            }).png()
        );
    }

    const optimizer = new Optimizer(map, tilesets, options);
    return await optimizer.optimize();
};
