const parse =  require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");


const csv = fs.readFileSync("./csv/data.csv");
console.log(csv.toString());
//parse 메서드 -> 2차원배열화
const records = parse(csv.toString());
console.log(records);

const crawler = async () => {
    //브라우저를 띄우고
    const browser = await puppeteer.launch({headless: false});
    // 페이지를 띄우고
    const page = await browser.newPage();
    const page2 = await browser.newPage();
    const page3 = await browser.newPage();
    // 페이지 이동 
    await page.goto('https://www.naver.com');
    await page2.goto('https://www.google.com');
    await page3.goto('https://www.daum.net');
    //3초정도 대기하다
    await page.waitFor(3000);
    await page2.waitFor(1000);
    await page3.waitFor(1000);
    //페이지를 종료하고
    await page.close();
    await page2.close();
    await page3.close();
    //브라우저를 종료한다 
    await browser.close();
}

crawler();