import superagent = require("superagent");
import cheerio = require("cheerio");

export const remoteGet = (url: string) => {
    return new Promise<superagent.Response>((resolve, reject) => {
        superagent.get(url)
            .end((err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    console.log(err);
                    reject(err);
                }
            });
    });
};
