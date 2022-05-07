import { optimize } from "../src";

async function run() {
    await optimize("./example/map.json");
    console.log("Optimization finished");
}

run();
