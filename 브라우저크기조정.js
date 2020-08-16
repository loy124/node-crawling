const xlsx = require("xlsx");
const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const add_to_sheet = require("./add_to_sheet");

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

fs.readdir("screenshot", (err) => {
  if (err) {
    console.error("screenshot 폴더가 없어 screenshot 폴더를 생성합니다 ");
    fs.mkdirSync("screenshot");
  }
});

fs.readdir("poster", (err) => {
  if (err) {
    console.error("poster 폴더가 없어 poster 폴더를 생성합니다 ");
    fs.mkdirSync("poster");
  }
});

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080"],
    });
    const page = await browser.newPage();
    page.setViewport({
      width: 1920,
      height: 1080,
    });
    //본인이 브라우저를 하는것 처럼 진행
    //속이기
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
    );
    add_to_sheet(ws, "C1", "s", "평점");
    for (const [i, r] of records.entries()) {
      await page.goto(r.링크);
      const result = await page.evaluate(() => {
        const scoreEl = document.querySelector(".score.score_left .star_score");
        let score = "";
        if (scoreEl) {
          score = score.textContent;
        }
        const imgEl = document.querySelector(".poster img");
        let img = "";
        if (imgEl) {
          img = imgEl.src;
        }
        return {
          score,
          img,
        };
      });

      if (result.score) {
        const newCell = "C" + (i + 2);
        console.log(r.제목, "평점", result.score.trim());
        add_to_sheet(ws, newCell, "n", parseFloat(result.score.trim()));
      }
      if (result.img) {
        // const buffer = await page.screenshot();
        // fs.writeFileSync('screenshot', buffer);
        // fullPage 옵션에 따라 전체화면을 찍을 수 있다.
        // clip 옵션은 원하는 부분만
        // 왼쪽 상단 모서리(x, y) 너비(width), 높이(height)
        await page.screenshot({
          path: `screenshot/${r.제목}.png`,
          fullPage: true,
          // clip: {x: 100, y: 100, width: 300, height: 300},
        });
        const imgResult = await axios.get(result.img.replace(/\?.*$/, ""), {
          responseType: "arraybuffer",
        });
        fs.writeFileSync(`poster/${r.제목}.jpg`, imgResult.data);
      }

      await page.waitFor(1000);
    }
    await page.close();
    await browser.close();
    xlsx.writeFile(workbook, "xlsx/result.xlsx");
  } catch (e) {
    console.error(e);
  }
};
crawler();
