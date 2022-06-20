"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeToBuffer = exports.optimize = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importStar(require("path"));
const libGuards_1 = require("./guards/libGuards");
const mapGuards_1 = require("./guards/mapGuards");
const Optimizer_1 = require("./Optimizer");
async function getMap(mapFilePath) {
    let mapFile;
    try {
        mapFile = await fs_1.default.promises.readFile(mapFilePath);
    }
    catch (err) {
        throw Error(`Cannot get the map file: ${err}`);
    }
    const isRealMap = mapGuards_1.isMap.passthrough().safeParse(JSON.parse(mapFile.toString("utf-8")));
    if (!isRealMap.success) {
        console.error(isRealMap.error.issues);
        throw Error("Bad format on map file");
    }
    return isRealMap.data;
}
const optimize = async (mapFilePath, options = undefined) => {
    const map = await getMap(mapFilePath);
    const mapDirectoyPath = (0, path_1.resolve)(mapFilePath.substring(0, mapFilePath.lastIndexOf("/")));
    const tilesets = new Map();
    const mapName = path_1.default.parse(mapFilePath).name;
    const logLevel = options?.logs ?? libGuards_1.LogLevel.NORMAL;
    if (logLevel) {
        console.log(`${mapName} optimization is started!`);
    }
    for (const tileset of map.tilesets) {
        try {
            tilesets.set(tileset, await fs_1.default.promises.readFile((0, path_1.resolve)(`${mapDirectoyPath}/${tileset.image}`)));
        }
        catch (err) {
            throw Error(`Undefined tileset file: ${tileset.image}`);
        }
    }
    const optimizer = new Optimizer_1.Optimizer(map, tilesets, options);
    const result = await optimizer.optimize();
    const outputMapName = (options?.output?.map?.name ?? mapName) + ".json";
    const ouputPath = mapDirectoyPath + "/" + (options?.output?.path ?? "dist");
    if (!fs_1.default.existsSync(ouputPath)) {
        fs_1.default.mkdirSync(ouputPath, { recursive: true });
    }
    const tilesetsPromises = [];
    for (const tileset of result.tilesetsBuffer) {
        tilesetsPromises.push(fs_1.default.promises.writeFile(`${ouputPath}/${tileset[0]}`, tileset[1]));
    }
    if (logLevel) {
        console.log(`${mapName} file render is in progress!`);
    }
    await Promise.all([
        fs_1.default.promises.writeFile(`${ouputPath}/${outputMapName}`, JSON.stringify(map, null, 0)),
        ...tilesetsPromises,
    ]);
};
exports.optimize = optimize;
const optimizeToBuffer = async (map, tilesetsBuffers, options = undefined) => {
    const optimizer = new Optimizer_1.Optimizer(map, tilesetsBuffers, options);
    return await optimizer.optimize();
};
exports.optimizeToBuffer = optimizeToBuffer;
