import { z } from "zod";

export const isProperty = z.object({
    name: z.string(),
    type: z.string(),
    propertytype: z.string().optional(),
    value: z.unknown(),
});

export const isMapTilesetTileAnimation = z.object({
    duration: z.number(),
    tileid: z.number(),
});

export const isMapTilesetTile = z.object({
    animation: isMapTilesetTileAnimation.array().optional(),
    id: z.number(),
    properties: isProperty.passthrough().array().optional(),
});

export type MapTilesetTile = z.infer<typeof isMapTilesetTile>;

export const isMapTileset = z.object({
    columns: z.number(),
    firstgid: z.number(),
    image: z.string(),
    imageheight: z.number().multipleOf(32),
    imagewidth: z.number().multipleOf(32),
    margin: z.number(),
    name: z.string(),
    properties: isProperty.passthrough().array().optional(),
    spacing: z.number(),
    tilecount: z.number(),
    tileheight: z.number().multipleOf(32),
    tilewidth: z.number().multipleOf(32),
    tiles: isMapTilesetTile.passthrough().array().optional(),
});

export type MapTileset = z.infer<typeof isMapTileset>;

export type MapLayer = {
    type?: string;
    layers?: MapLayer[];
    data?: number[];
};

export const isMapLayer: z.ZodType<MapLayer> = z.lazy(() =>
    z
        .object({
            type: z.string().optional(),
            layers: z.array(isMapLayer).optional(),
            data: z.number().gte(0).array().optional(),
        })
        .passthrough()
);

export const isMap = z.object({
    tilesets: isMapTileset.passthrough().array(),
    type: z.literal("map"),
    tileheight: z.number(),
    tilewidth: z.number(),
    properties: isProperty.passthrough().array().optional(),
    layers: isMapLayer.array(),
});

export type Map = z.infer<typeof isMap>;
