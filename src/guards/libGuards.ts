import { z } from "zod";
import { isMap } from "./mapGuards";

const isOptimizeBufferOptions = z.object({
    tile: z
        .object({
            size: z.number().positive().optional(),
        })
        .optional(),
    logs: z.boolean().optional(),
    output: z
        .object({
            tileset: z
                .object({
                    name: z.string().optional(),
                    size: z
                        .object({
                            width: z.number().gte(32).multipleOf(8).optional(),
                            height: z.number().gte(32).multipleOf(8).optional(),
                        })
                        .optional(),
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
                    name: z.string().optional(),
                    size: z
                        .object({
                            width: z.number().gte(32).multipleOf(8).optional(),
                            height: z.number().gte(32).multipleOf(8).optional(),
                        })
                        .optional(),
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
