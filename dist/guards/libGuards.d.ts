/// <reference types="node" />
import { z } from "zod";
export declare enum LogLevel {
    NONE = 0,
    NORMAL = 1,
    VERBOSE = 2
}
declare const isOptimizeBufferOptions: z.ZodObject<{
    tile: z.ZodOptional<z.ZodObject<{
        size: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        size?: number | undefined;
    }, {
        size?: number | undefined;
    }>>;
    logs: z.ZodOptional<z.ZodNativeEnum<typeof LogLevel>>;
    output: z.ZodOptional<z.ZodObject<{
        tileset: z.ZodOptional<z.ZodObject<{
            prefix: z.ZodOptional<z.ZodString>;
            suffix: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        }, {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        tileset?: {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        } | undefined;
    }, {
        tileset?: {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
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
}, {
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
}>;
export type OptimizeBufferOptions = z.infer<typeof isOptimizeBufferOptions>;
declare const isOptimizeOptions: z.ZodObject<z.extendShape<{
    tile: z.ZodOptional<z.ZodObject<{
        size: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        size?: number | undefined;
    }, {
        size?: number | undefined;
    }>>;
    logs: z.ZodOptional<z.ZodNativeEnum<typeof LogLevel>>;
    output: z.ZodOptional<z.ZodObject<{
        tileset: z.ZodOptional<z.ZodObject<{
            prefix: z.ZodOptional<z.ZodString>;
            suffix: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        }, {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        tileset?: {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        } | undefined;
    }, {
        tileset?: {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        } | undefined;
    }>>;
}, {
    output: z.ZodOptional<z.ZodObject<{
        map: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
        }, {
            name?: string | undefined;
        }>>;
        path: z.ZodOptional<z.ZodString>;
        tileset: z.ZodOptional<z.ZodObject<{
            prefix: z.ZodOptional<z.ZodString>;
            suffix: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        }, {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        path?: string | undefined;
        map?: {
            name?: string | undefined;
        } | undefined;
        tileset?: {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        } | undefined;
    }, {
        path?: string | undefined;
        map?: {
            name?: string | undefined;
        } | undefined;
        tileset?: {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        } | undefined;
    }>>;
}>, "strip", z.ZodTypeAny, {
    tile?: {
        size?: number | undefined;
    } | undefined;
    logs?: LogLevel | undefined;
    output?: {
        path?: string | undefined;
        map?: {
            name?: string | undefined;
        } | undefined;
        tileset?: {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        } | undefined;
    } | undefined;
}, {
    tile?: {
        size?: number | undefined;
    } | undefined;
    logs?: LogLevel | undefined;
    output?: {
        path?: string | undefined;
        map?: {
            name?: string | undefined;
        } | undefined;
        tileset?: {
            size?: number | undefined;
            prefix?: string | undefined;
            suffix?: string | undefined;
        } | undefined;
    } | undefined;
}>;
export type OptimizeOptions = z.infer<typeof isOptimizeOptions>;
declare const isOptimizedMapFiles: z.ZodObject<{
    map: z.ZodObject<{
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
                propertytype?: string | undefined;
                value?: unknown;
                name: string;
                type: string;
            }, {
                propertytype?: string | undefined;
                value?: unknown;
                name: string;
                type: string;
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
                    propertytype?: string | undefined;
                    value?: unknown;
                    name: string;
                    type: string;
                }, {
                    propertytype?: string | undefined;
                    value?: unknown;
                    name: string;
                    type: string;
                }>, "many">>;
            }, "passthrough", z.ZodTypeAny, {
                animation?: {
                    duration: number;
                    tileid: number;
                }[] | undefined;
                properties?: {
                    propertytype?: string | undefined;
                    value?: unknown;
                    name: string;
                    type: string;
                }[] | undefined;
                id: number;
            }, {
                animation?: {
                    duration: number;
                    tileid: number;
                }[] | undefined;
                properties?: {
                    propertytype?: string | undefined;
                    value?: unknown;
                    name: string;
                    type: string;
                }[] | undefined;
                id: number;
            }>, "many">>;
        }, "passthrough", z.ZodTypeAny, {
            properties?: {
                propertytype?: string | undefined;
                value?: unknown;
                name: string;
                type: string;
            }[] | undefined;
            tiles?: {
                animation?: {
                    duration: number;
                    tileid: number;
                }[] | undefined;
                properties?: {
                    propertytype?: string | undefined;
                    value?: unknown;
                    name: string;
                    type: string;
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
                propertytype?: string | undefined;
                value?: unknown;
                name: string;
                type: string;
            }[] | undefined;
            tiles?: {
                animation?: {
                    duration: number;
                    tileid: number;
                }[] | undefined;
                properties?: {
                    propertytype?: string | undefined;
                    value?: unknown;
                    name: string;
                    type: string;
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
            propertytype?: string | undefined;
            value?: unknown;
            name: string;
            type: string;
        }, {
            propertytype?: string | undefined;
            value?: unknown;
            name: string;
            type: string;
        }>, "many">>;
        layers: z.ZodArray<z.ZodType<import("./mapGuards").MapLayer, z.ZodTypeDef, import("./mapGuards").MapLayer>, "many">;
    }, "strip", z.ZodTypeAny, {
        properties?: {
            propertytype?: string | undefined;
            value?: unknown;
            name: string;
            type: string;
        }[] | undefined;
        type: "map";
        tileheight: number;
        tilewidth: number;
        layers: import("./mapGuards").MapLayer[];
        tilesets: {
            properties?: {
                propertytype?: string | undefined;
                value?: unknown;
                name: string;
                type: string;
            }[] | undefined;
            tiles?: {
                animation?: {
                    duration: number;
                    tileid: number;
                }[] | undefined;
                properties?: {
                    propertytype?: string | undefined;
                    value?: unknown;
                    name: string;
                    type: string;
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
            propertytype?: string | undefined;
            value?: unknown;
            name: string;
            type: string;
        }[] | undefined;
        type: "map";
        tileheight: number;
        tilewidth: number;
        layers: import("./mapGuards").MapLayer[];
        tilesets: {
            properties?: {
                propertytype?: string | undefined;
                value?: unknown;
                name: string;
                type: string;
            }[] | undefined;
            tiles?: {
                animation?: {
                    duration: number;
                    tileid: number;
                }[] | undefined;
                properties?: {
                    propertytype?: string | undefined;
                    value?: unknown;
                    name: string;
                    type: string;
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
    tilesetsBuffer: z.ZodMap<z.ZodString, z.ZodType<Buffer, z.ZodTypeDef, Buffer>>;
}, "strip", z.ZodTypeAny, {
    map: {
        properties?: {
            propertytype?: string | undefined;
            value?: unknown;
            name: string;
            type: string;
        }[] | undefined;
        type: "map";
        tileheight: number;
        tilewidth: number;
        layers: import("./mapGuards").MapLayer[];
        tilesets: {
            properties?: {
                propertytype?: string | undefined;
                value?: unknown;
                name: string;
                type: string;
            }[] | undefined;
            tiles?: {
                animation?: {
                    duration: number;
                    tileid: number;
                }[] | undefined;
                properties?: {
                    propertytype?: string | undefined;
                    value?: unknown;
                    name: string;
                    type: string;
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
    };
    tilesetsBuffer: Map<string, Buffer>;
}, {
    map: {
        properties?: {
            propertytype?: string | undefined;
            value?: unknown;
            name: string;
            type: string;
        }[] | undefined;
        type: "map";
        tileheight: number;
        tilewidth: number;
        layers: import("./mapGuards").MapLayer[];
        tilesets: {
            properties?: {
                propertytype?: string | undefined;
                value?: unknown;
                name: string;
                type: string;
            }[] | undefined;
            tiles?: {
                animation?: {
                    duration: number;
                    tileid: number;
                }[] | undefined;
                properties?: {
                    propertytype?: string | undefined;
                    value?: unknown;
                    name: string;
                    type: string;
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
    };
    tilesetsBuffer: Map<string, Buffer>;
}>;
export type OptimizedMapFiles = z.infer<typeof isOptimizedMapFiles>;
export {};
