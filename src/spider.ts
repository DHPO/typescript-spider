import * as cheerio from "cheerio";
import config from "./config";
import {News} from "./Model/news";
import {mongodb} from "./mongodb";
import {remoteGet} from "./request";
import superagent = require("superagent");
import sleep from "./sleep";

const parse = async (response: superagent.Response) => {
    const $ = cheerio.load(response.text);
    const items: CheerioElement[] = $(".item").get();
    for (const element of items) {
        const title: string = $(element).find("a").first().text().trim();
        if (title === "" || await News.findOne({title}).exec() !== null) {
            continue;
        }
        const url: string = $(element).find("a").first().attr("href");
        let content: string = "";
        try {
            content = await getContent(url);
        } catch (err) {
            console.log(err);
            content = $(element).find("p").first().text().trim();
        }
        const rawTime: string = ($(element).find(".status>li").first().text()
            .match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/g) || [""])[0];
        const time: Date = new Date(rawTime);

        const news = new News({title, url, time, content});
        news.save((err) => {if (err) {console.log(err); }});
    }
};

const getContent = async (url: string) => {
    const response = await remoteGet(url);
    const $ = cheerio.load(response.text);
    let result: string = "<p>" + $(".article-summary>p").html() || "" + "</p>";
    $("#artibody>p").each((index, element) => {
        result += "<p>" + $(element).html() || "" + "</p>";
    });
    return result;
};

export default async () => {
    while (true) {
        const response = await remoteGet("https://www.cnbeta.com");
        console.log(`Spider: ${response.status}`);
        parse(response);
        await sleep(config.spider.hostCheckInterval * 1000);
    }
};
