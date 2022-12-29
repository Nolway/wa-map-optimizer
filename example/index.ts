import { optimize } from "../src";

async function run() {
    await optimize("./example/map.json", { logs: 2 });
    console.log("Optimization finished");
}

run();
