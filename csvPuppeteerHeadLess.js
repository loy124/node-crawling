const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const stringify = require('csv-stringify/lib/sync');
const puppeteer = require("puppeteer");
console.log(__dirname);
const csv = fs.readFileSync(__dirname+"/csv/data.csv");

//parse 메서드 -> 2차원배열화
const records = parse(csv.toString());
// console.log(records);

const crawler = async () => {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const result = [];
    await Promise.all(
      records.map(async (r, i) => {
        try {
          
          const page = await browser.newPage();
          // 페이지가 띄워졌을때
          await page.goto(r[1]);
          //접근
          const scoreEl = await page.$(".score.score_left .star_score");
          if (scoreEl) {
            //찾은 태그를 통해서
            //textContent를 가져오기
            const text = await page.evaluate((tag) => tag.textContent, scoreEl);
            console.log(r[0], '평점', text.trim());
            result[i] = [r[0], r[1], text.trim()] ;
          }
          //사람인척 하는 트릭 
          await page.waitFor(3000);
          await page.close();
          const str = stringify(result);
          fs.writeFileSync("csv/result.csv", str);
        } catch (err) {
          console.log(err);
        }
      })
    );
  } catch (err) {
    console.log(err);
  } finally{
    
  await browser.close();
  }

};

crawler();
