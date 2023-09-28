import { optimize } from "../src";

async function run() {
    await optimize("./example/map.tmj", {
        logs: 2,
        output: {
            tileset: {
                compress: {
                    quality: [0.9, 1],
                },
            },
        },
    });
    console.log("Optimization finished");
}

run();
