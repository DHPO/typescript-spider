import * as superagent from "superagent";
import config from "./config";
import sleep from "./sleep";

let sequence = Promise.resolve();

export const remoteGet = async (url: string) => {
    return new Promise<superagent.Response>((resolve, reject) => {
        sequence = sequence.then(() => {
            return sleep(config.spider.interval * 1000);
        }).then(async () => {
            console.log(`GET ${url}`);
            const response = await superagent.get(url);
            resolve(response);
        }).catch((err) => {
            reject(err);
        });
    });
};
