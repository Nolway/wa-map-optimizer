import { z } from "zod";

const isOptimizeOptions = z.object({
    tile: z
        .object({
            size: z.number().positive().optional(),
        })
        .optional(),
    output: z
        .object({
            path: z.string().optional(),
            mapName: z.string().optional(),
            tilesetName: z.string().optional(),
        })
        .optional(),
});

export type OptimizeOptions = z.infer<typeof isOptimizeOptions>;
