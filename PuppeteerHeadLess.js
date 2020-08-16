const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("./csv/data.csv");
console.log(csv.toString());
//parse 메서드 -> 2차원배열화
const records = parse(csv.toString());
console.log(records);

const crawler = async () => {
  
  const browser = await puppeteer.launch({ headless: false });
  

  const [page, page2, page3] = await Promise.all([
    browser.newPage(),
    browser.newPage(),
    browser.newPage(),
  ]);


  // 페이지 이동
  await Promise.all([
    page.goto("https://www.naver.com"),
    page2.goto("https://www.google.com"),
    page3.goto("https://www.daum.net"),
  ]);
  await Promise.all([
    page.waitFor(3000),
    page2.waitFor(1000),
    page3.waitFor(1000),
  ]);
  console.log("working");
  //3초정도 대기하다

  //페이지를 종료하고
  await page.close();
  await page2.close();
  await page3.close();
  //브라우저를 종료한다
  await browser.close();
};

crawler();
