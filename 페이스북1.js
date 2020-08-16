const puppeteer  = require("puppeteer");

const crawler = async() => {
    try{
        const browser = await puppeteer.launch({headless: false, args:['--window-size=1920,1080']});
        const page = await browser.newPage();
        await page.setViewport({
            width:1920,
            height:1080
        })
        await page.goto('https://facebook.com');
        await page.evaluate(() => {
            document.querySelector("#email").value = "onyou.lee@mincoding.co.kr"
            document.querySelector("#pass").value = "비밀번호"
            document.querySelector("button[type=submit]").click();
        })
        // await page.close();
        // await browser.close();
    }catch(err){
        console.log(err)
    }
}

crawler();