import * as cheerio from "cheerio";
import config from "./config";
import {News} from "./Model/news";
import {mongodb} from "./mongodb";
import {remoteGet} from "./request";
import superagent = require("superagent");
import sleep from "./sleep";

const parse = async (response: superagent.Response) => {
    const $ = cheerio.load(response.text);
    $(".item").each(async (index, element) => {
        const title: string = $(element).find("a").first().text().trim();
        const url: string = $(element).find("a").first().attr("href");
        const content: string = $(element).find("p").first().text().trim();
        const rawTime: string = ($(element).find(".status>li").first().text()
            .match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/g) || [""])[0];
        const time: Date = new Date(rawTime);
        if (title !== "") {
            const news = new News({title, url, time, content});
            if (await News.findOne({title}).exec() === null) {
                news.save((err) => {if (err) {console.log(err); }});
            }
        }
    });
};

export default async () => {
    while (true) {
        const response = await remoteGet("https://www.cnbeta.com");
        console.log(response.status);
        parse(response);
        await sleep(config.spider.interval * 1000);
    }
};
