const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();
const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    // alert 창 끄기 ㅣ
    // page.on("dialog", async (dialog) => {
    //   console.log(dialog.type(), dialog.message());
    //   await dialog.dismiss();
    // });

    //confirm 다루기
    page.on("dialog", async (dialog) => {
      console.log(dialog.type(), dialog.message());
      // 승인
      // await dialog.accept();
      // 거부
      // await dialog.dismiss();
      //prompt창 안에 배열을 넣으면 해당 값이 들어간다.
      await dialog.accept("https://www.naver.com");
    });

    // await page.evaluate(() => {
    //   alert("이 창이 꺼져야 다음으로 넘어갑니다.");
    //   location.href = "https://www.naver.com";
    // });

    // await page.evaluate(() => {
    //   if(confirm('이 창이 꺼져야 다음으로 넘어갑니다.')){
    //     location.href="https://www.naver.com"
    //   }else {
    //     location.href="https://www.daum.net";
    //   }
    // });

    await page.evaluate(() => {
      const data = prompt("이 창이 꺼져야 다음으로 넘어갑니다.");
      location.href = data;
    });
  } catch (err) {
    console.log(err);
  }
};

crawler();
