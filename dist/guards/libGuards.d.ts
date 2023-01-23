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
export {};
