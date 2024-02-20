import { link } from "fs";
import puppeteer from "puppeteer";

import { setTimeout } from "timers/promises";
import PQueue from 'p-queue';




const browser = await puppeteer.launch({ headless: false,
defaultViewport: {width:1920,height:1080},
userDataDir: "temporary" 

});


    
    const page = await browser.newPage();
    await page.goto("https://www.duckduckgo.com", { waitUntil: "networkidle2" });

    const searchBarHandle =  await page.waitForSelector('#searchbox_homepage');
    await searchBarHandle.type('devconfbd')

    await page.keyboard.press('Enter')

    const firstResult = await page.waitForSelector('[data-testid="result-title-a"]')

    await firstResult.click()


    await page.waitForSelector('.sponsors a','.supporter a')
    const sponsorlink  = await page.evaluate(()=>{
    return [...document.querySelectorAll('.sponsors a')].map(a=>a.href)
    })

    const supporterlink = await page.evaluate(()=>{
        return [...document.querySelectorAll('.supporter a')].map(a=>a.href)
    })

    





async function getLinks(link){
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: "networkidle2" });
    const title = await page.title()
    const hostname = await page.evaluate(()=> window.location.hostname)
    await page.screenshot({path: `${hostname}.png`})
  
    const facebookLInk = await page.evaluate(
    ()=> document.querySelector('a[href*=facebook]')?.href);
    const twitterLink = await page.evaluate(()=> document.querySelector('a[href*=twitter]')?.href);
    const linkedinLink = await page.evaluate(()=> document.querySelector('a[href*=linkedin]')?.href);
    const careerLink = await page.evaluate(()=> document.querySelector('a[href*=career]')?.href);
    
    // await page.$$eval('a[href*=career]',(a)=>a.map(a=>a.href))

    console.log({link,title,hostname,facebookLInk,twitterLink,linkedinLink,careerLink})

    await page.close()
}

const queue = new PQueue({concurrency: 2})
for(let link of supporterlink){
    await getLinks(link)
 queue.add(()=>getLinks(link)).catch(console.log)
}

await queue.onEmpty()
await browser.close();





