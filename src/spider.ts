import * as cheerio from "cheerio";
import config from "./config";
import {News} from "./Model/news";
import {mongodb} from "./mongodb";
import {remoteGet} from "./request";
import superagent = require("superagent");
import sleep from "./sleep";

const parse = async (response: superagent.Response) => {
    const $ = cheerio.load(response.text);
    const items: CheerioElement[] = $("li.clear").get();
    for (const element of items) {
        const title: string = $(element).find("a").first().text().trim();
        if (title === "" || await News.findOne({title}).exec() !== null) {
            continue;
        }
        const url: string = "https://m.cnbeta.com" + $(element).find("a").first().attr("href");

        let detail: string[] = [];
        try {
            detail = await getContent(url);
        } catch (err) {
            console.log(err);
            continue;
        }
        const content = detail[0];
        const rawTime = detail[1];
        const time: Date = new Date(rawTime);

        const news = new News({title, url, time, content});
        news.save((err) => {if (err) {console.log(err); }});
    }
};

const getContent = async (url: string) => {
    const response = await remoteGet(url);
    const $ = cheerio.load(response.text);
    let result: string = "<p>" + $(".article-summ>p").html() || "" + "</p>";
    $(".articleCont>p").each((index, element) => {
        result += "<p>" + $(element).html() || "" + "</p>";
    });
    const rawTime: string = $("time").text().trim();
    return [result, rawTime];
};

export default async () => {
    for (let p = 1; p <= config.spider.maxPage; p++) {
        try {
            const response = await remoteGet(`https://m.cnbeta.com/list/latest_${p}.htm`);
            await parse(response);
        } catch (err) {
            console.log(err);
        }
    }
    while (true) {
        const response = await remoteGet(`https://m.cnbeta.com/list/latest_1.htm`);
        await parse(response);
        await sleep(config.spider.hostCheckInterval * 1000);
    }
};
