const puppeteer  = require("puppeteer");

const crawler = async() => {
    try{
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('https://unsplash.com');
        await page.close();
        await browser.close();
    }catch(err){
        console.log(err)
    }
}

crawler();