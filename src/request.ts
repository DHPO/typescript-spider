import * as superagent from "superagent";
import config from "./config";
import sleep from "./sleep";

export const remoteGet = async (url: string) => {
    console.log(`GET ${url}`);
    await sleep(config.spider.interval * 1000);
    return await superagent.get(url);
};
