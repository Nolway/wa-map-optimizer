import { z } from "zod";
import { isMap } from "./mapGuards";

export enum LogLevel {
    NONE = 0,
    NORMAL = 1,
    VERBOSE = 2,
}

const isLogLevel = z.nativeEnum(LogLevel);

const isOptimizeBufferOptions = z.object({
    tile: z
        .object({
            size: z.number().positive().optional(),
        })
        .optional(),
    logs: isLogLevel.optional(),
    output: z
        .object({
            tileset: z
                .object({
                    prefix: z.string().optional(),
                    suffix: z.string().optional(),
                    size: z.number().gte(32).multipleOf(8).optional(),
                })
                .optional(),
        })
        .optional(),
});

export type OptimizeBufferOptions = z.infer<typeof isOptimizeBufferOptions>;

const isOptimizeOptions = isOptimizeBufferOptions.extend({
    output: z
        .object({
            map: z
                .object({
                    name: z.string().optional(),
                })
                .optional(),
            path: z.string().optional(),
            tileset: z
                .object({
                    prefix: z.string().optional(),
                    suffix: z.string().optional(),
                    size: z.number().gte(32).multipleOf(8).optional(),
                })
                .optional(),
        })
        .optional(),
});

export type OptimizeOptions = z.infer<typeof isOptimizeOptions>;

const isOptimizedMapFiles = z.object({
    map: isMap,
    tilesetsBuffer: z.map(z.string(), z.instanceof(Buffer)),
});

export type OptimizedMapFiles = z.infer<typeof isOptimizedMapFiles>;
