import { z } from "zod";
export declare const isProperty: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    propertytype: z.ZodOptional<z.ZodString>;
    value: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    value?: unknown;
    propertytype?: string | undefined;
    type: string;
    name: string;
}, {
    value?: unknown;
    propertytype?: string | undefined;
    type: string;
    name: string;
}>;
export declare const isMapTilesetTileAnimation: z.ZodObject<{
    duration: z.ZodNumber;
    tileid: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    duration: number;
    tileid: number;
}, {
    duration: number;
    tileid: number;
}>;
export declare const isMapTilesetTile: z.ZodObject<{
    animation: z.ZodOptional<z.ZodArray<z.ZodObject<{
        duration: z.ZodNumber;
        tileid: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        duration: number;
        tileid: number;
    }, {
        duration: number;
        tileid: number;
    }>, "many">>;
    id: z.ZodNumber;
    properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        propertytype: z.ZodOptional<z.ZodString>;
        value: z.ZodUnknown;
    }, "passthrough", z.ZodTypeAny, {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }, {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    animation?: {
        duration: number;
        tileid: number;
    }[] | undefined;
    properties?: {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }[] | undefined;
    id: number;
}, {
    animation?: {
        duration: number;
        tileid: number;
    }[] | undefined;
    properties?: {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }[] | undefined;
    id: number;
}>;
export type MapTilesetTile = z.infer<typeof isMapTilesetTile>;
export declare const isMapTileset: z.ZodObject<{
    columns: z.ZodNumber;
    firstgid: z.ZodNumber;
    image: z.ZodString;
    imageheight: z.ZodNumber;
    imagewidth: z.ZodNumber;
    margin: z.ZodNumber;
    name: z.ZodString;
    properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        propertytype: z.ZodOptional<z.ZodString>;
        value: z.ZodUnknown;
    }, "passthrough", z.ZodTypeAny, {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }, {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }>, "many">>;
    spacing: z.ZodNumber;
    tilecount: z.ZodNumber;
    tileheight: z.ZodNumber;
    tilewidth: z.ZodNumber;
    tiles: z.ZodOptional<z.ZodArray<z.ZodObject<{
        animation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            duration: z.ZodNumber;
            tileid: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            duration: number;
            tileid: number;
        }, {
            duration: number;
            tileid: number;
        }>, "many">>;
        id: z.ZodNumber;
        properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            propertytype: z.ZodOptional<z.ZodString>;
            value: z.ZodUnknown;
        }, "passthrough", z.ZodTypeAny, {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }, {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }>, "many">>;
    }, "passthrough", z.ZodTypeAny, {
        animation?: {
            duration: number;
            tileid: number;
        }[] | undefined;
        properties?: {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }[] | undefined;
        id: number;
    }, {
        animation?: {
            duration: number;
            tileid: number;
        }[] | undefined;
        properties?: {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }[] | undefined;
        id: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    properties?: {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }[] | undefined;
    tiles?: {
        animation?: {
            duration: number;
            tileid: number;
        }[] | undefined;
        properties?: {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }[] | undefined;
        id: number;
    }[] | undefined;
    name: string;
    columns: number;
    firstgid: number;
    image: string;
    imageheight: number;
    imagewidth: number;
    margin: number;
    spacing: number;
    tilecount: number;
    tileheight: number;
    tilewidth: number;
}, {
    properties?: {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }[] | undefined;
    tiles?: {
        animation?: {
            duration: number;
            tileid: number;
        }[] | undefined;
        properties?: {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }[] | undefined;
        id: number;
    }[] | undefined;
    name: string;
    columns: number;
    firstgid: number;
    image: string;
    imageheight: number;
    imagewidth: number;
    margin: number;
    spacing: number;
    tilecount: number;
    tileheight: number;
    tilewidth: number;
}>;
export type MapTileset = z.infer<typeof isMapTileset>;
export type MapLayer = {
    type?: string;
    layers?: MapLayer[];
    data?: number[];
};
export declare const isMapLayer: z.ZodType<MapLayer>;
export declare const isMap: z.ZodObject<{
    tilesets: z.ZodArray<z.ZodObject<{
        columns: z.ZodNumber;
        firstgid: z.ZodNumber;
        image: z.ZodString;
        imageheight: z.ZodNumber;
        imagewidth: z.ZodNumber;
        margin: z.ZodNumber;
        name: z.ZodString;
        properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            propertytype: z.ZodOptional<z.ZodString>;
            value: z.ZodUnknown;
        }, "passthrough", z.ZodTypeAny, {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }, {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }>, "many">>;
        spacing: z.ZodNumber;
        tilecount: z.ZodNumber;
        tileheight: z.ZodNumber;
        tilewidth: z.ZodNumber;
        tiles: z.ZodOptional<z.ZodArray<z.ZodObject<{
            animation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                duration: z.ZodNumber;
                tileid: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                duration: number;
                tileid: number;
            }, {
                duration: number;
                tileid: number;
            }>, "many">>;
            id: z.ZodNumber;
            properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
                propertytype: z.ZodOptional<z.ZodString>;
                value: z.ZodUnknown;
            }, "passthrough", z.ZodTypeAny, {
                value?: unknown;
                propertytype?: string | undefined;
                type: string;
                name: string;
            }, {
                value?: unknown;
                propertytype?: string | undefined;
                type: string;
                name: string;
            }>, "many">>;
        }, "passthrough", z.ZodTypeAny, {
            animation?: {
                duration: number;
                tileid: number;
            }[] | undefined;
            properties?: {
                value?: unknown;
                propertytype?: string | undefined;
                type: string;
                name: string;
            }[] | undefined;
            id: number;
        }, {
            animation?: {
                duration: number;
                tileid: number;
            }[] | undefined;
            properties?: {
                value?: unknown;
                propertytype?: string | undefined;
                type: string;
                name: string;
            }[] | undefined;
            id: number;
        }>, "many">>;
    }, "passthrough", z.ZodTypeAny, {
        properties?: {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }[] | undefined;
        tiles?: {
            animation?: {
                duration: number;
                tileid: number;
            }[] | undefined;
            properties?: {
                value?: unknown;
                propertytype?: string | undefined;
                type: string;
                name: string;
            }[] | undefined;
            id: number;
        }[] | undefined;
        name: string;
        columns: number;
        firstgid: number;
        image: string;
        imageheight: number;
        imagewidth: number;
        margin: number;
        spacing: number;
        tilecount: number;
        tileheight: number;
        tilewidth: number;
    }, {
        properties?: {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }[] | undefined;
        tiles?: {
            animation?: {
                duration: number;
                tileid: number;
            }[] | undefined;
            properties?: {
                value?: unknown;
                propertytype?: string | undefined;
                type: string;
                name: string;
            }[] | undefined;
            id: number;
        }[] | undefined;
        name: string;
        columns: number;
        firstgid: number;
        image: string;
        imageheight: number;
        imagewidth: number;
        margin: number;
        spacing: number;
        tilecount: number;
        tileheight: number;
        tilewidth: number;
    }>, "many">;
    type: z.ZodLiteral<"map">;
    tileheight: z.ZodNumber;
    tilewidth: z.ZodNumber;
    properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        propertytype: z.ZodOptional<z.ZodString>;
        value: z.ZodUnknown;
    }, "passthrough", z.ZodTypeAny, {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }, {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }>, "many">>;
    layers: z.ZodArray<z.ZodType<MapLayer, z.ZodTypeDef, MapLayer>, "many">;
}, "strip", z.ZodTypeAny, {
    properties?: {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }[] | undefined;
    type: "map";
    tileheight: number;
    tilewidth: number;
    layers: MapLayer[];
    tilesets: {
        properties?: {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }[] | undefined;
        tiles?: {
            animation?: {
                duration: number;
                tileid: number;
            }[] | undefined;
            properties?: {
                value?: unknown;
                propertytype?: string | undefined;
                type: string;
                name: string;
            }[] | undefined;
            id: number;
        }[] | undefined;
        name: string;
        columns: number;
        firstgid: number;
        image: string;
        imageheight: number;
        imagewidth: number;
        margin: number;
        spacing: number;
        tilecount: number;
        tileheight: number;
        tilewidth: number;
    }[];
}, {
    properties?: {
        value?: unknown;
        propertytype?: string | undefined;
        type: string;
        name: string;
    }[] | undefined;
    type: "map";
    tileheight: number;
    tilewidth: number;
    layers: MapLayer[];
    tilesets: {
        properties?: {
            value?: unknown;
            propertytype?: string | undefined;
            type: string;
            name: string;
        }[] | undefined;
        tiles?: {
            animation?: {
                duration: number;
                tileid: number;
            }[] | undefined;
            properties?: {
                value?: unknown;
                propertytype?: string | undefined;
                type: string;
                name: string;
            }[] | undefined;
            id: number;
        }[] | undefined;
        name: string;
        columns: number;
        firstgid: number;
        image: string;
        imageheight: number;
        imagewidth: number;
        margin: number;
        spacing: number;
        tilecount: number;
        tileheight: number;
        tilewidth: number;
    }[];
}>;
export type Map = z.infer<typeof isMap>;
