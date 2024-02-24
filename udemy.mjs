import puppeteer from "puppeteer";
import { link } from "fs";
import { setTimeout } from "timers/promises";
import PQueue from 'p-queue';

import fs from 'fs';
import path from 'path';





(async () => {


    const browser = await puppeteer.launch({ headless: false,
        defaultViewport: {width:1920,height:1080},
        userDataDir: "temporary"


    });
    const page = await browser.newPage();
    await page.goto("https://www.udemy.com/");
    await page.screenshot({ path: "udemy.png" });

    await browser.close();
})();