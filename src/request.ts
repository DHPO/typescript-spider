import * as superagent from "superagent";
import config from "./config";
import sleep from "./sleep";

export const remoteGet = async (url: string) => {
    console.log(`GET ${url}`);
    return await superagent.get(url);
};
