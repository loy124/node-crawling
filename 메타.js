const puppeteer = require('puppeteer');

const crawler = async () => {
    try{
        const browser = await puppeteer.launch({
            headless: true,
            args:["--window-size=1920,1080"]
        });

        const page = await browser.newPage();
        page.setViewport({
            width:1920,
            height:1080
        });
        await page.goto("https://www.naver.com");
        //await page.goto("https://namu.wiki/w/%EC%8A%A4%ED%85%8C%EC%9D%B4%ED%81%AC%20");
        //await page.screenshot({path:"./screenshots/steak.jpg"});
        await page.evaluate( () => {
            // 이 안에서는 document를 사용가능하다.
            document.querySelector("#query").value = "스테이크";
            document.querySelector(".ico_search_submit").click();
        });
        await page.waitFor(2000);
        let nextLink = await page.evaluate(async () => {
            return document.querySelector("#web_layer_0 dt a").getAttribute("href");
        });
        await page.waitFor(2000);
        const page2 = await browser.newPage();
        await page2.goto(nextLink);
        // await page.goto(nextLink);
        await page2.waitForNavigation();
        await page2.waitFor(2000);
        await page2.screenshot({path:"./screenshots/steak.jpg"});
        await browser.close();
    }catch(err){
        console.log(err);
    }
}
crawler();