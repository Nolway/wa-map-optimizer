import fs from "fs";
import path, { resolve } from "path";
import sharp, { Sharp } from "sharp";
import { LogLevel, OptimizeOptions } from "./guards/libGuards";
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
    const mapDirectoryPath = resolve(mapFilePath.substring(0, mapFilePath.lastIndexOf("/")));
    const tilesets = new Map<MapTileset, Sharp>();
    const mapName = path.parse(mapFilePath).name;
    const mapExtension = path.parse(mapFilePath).ext;
    const logLevel = options?.logs ?? LogLevel.NORMAL;

    if (logLevel) {
        console.log(`${mapName} optimization is started!`);
    }

    for (const tileset of map.tilesets) {
        try {
            const { data, info } = await sharp(resolve(`${mapDirectoryPath}/${tileset.image}`))
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

    const outputPath = options?.output?.path ?? `${mapDirectoryPath}/dist`;

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const optimizer = new Optimizer(map, tilesets, options, outputPath);
    await optimizer.optimize();

    const outputMapName = (options?.output?.map?.name ?? mapName) + mapExtension;

    if (logLevel) {
        console.log(`${mapName} map file render in progress!`);
    }

    await fs.promises.writeFile(`${outputPath}/${outputMapName}`, JSON.stringify(map, null, 2)).then(() => {
        console.log(`${mapName} map file rendered!`);
    });
};
