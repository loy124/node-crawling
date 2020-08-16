const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

fs.readdir("screenshot", (err) => {
  if (err) {
    console.error("screenshot 폴더가 없어 screenshot 폴더를 생성합니다 ");
    fs.mkdirSync("screenshot");
  }
});

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false, args:["--window-size=1920,1080"] });
    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080,
      });
    await page.goto("https://www.naver.com");
    await page.waitFor(1000);
    await page.click("#account a.link_login");
    await page.waitForSelector(".login_form");
    // console.log(process.env.NAVER_ID);
    const id = process.env.NAVER_ID;
    const pw = process.env.NAVER_PASSWORD;
    await page.evaluate(
      (id, pw) => {
        const idInput = document.querySelector(".input_box #id");
        idInput.value = id;

        const pwInput = document.querySelector(".input_box #pw");
        pwInput.value = pw;
      },
      id,
      pw
    );
    await page.waitFor(2000);
    await page.click("input[type=submit]");

    // 여기까지 로그인이 진행이 되었다
    //이제 자주 사용하는 기기를 등록하는 화면
    // await page.waitForSelector("#new.dontsave");
    await page.waitFor(2000);
    if (await page.$(".login_form .btn_cancel")) {
      await page.click(".login_form .btn_cancel");
    }

    await page.waitForSelector("#NM_set_home_btn");
    // 캡쳐 찍기
    await page.screenshot({
      path: `screenshot/캡쳐.png`,
      fullPage: true
    });
    // 이제 해야되는것
    // 메일에 들어가서 
    await page.click("#NM_FAVORITE .nav_item:first-child");
    // 메모에 들어가서 
    await page.waitForSelector(".gnb_first");
    await page.click(".gnb_first a.memo");
    // console.log(await page.$(".writenote"));
    // 메모부분은 waitFor을 활용 할 것 
    await page.waitFor(1000);
    await page.evaluate(() => {
        document.querySelector(".writenote .write").click();
        // document.querySelector(".workseditor").innerHTML = "크롤링을 활용한 메모 작성"; 
    });
    await page.waitFor(1000);
    await page.type(".workseditor", "크롤링을 활용한 메모 작성");
    await page.waitFor(1000);
    await page.click(".btn_save");
    await page.waitFor(1000);
    await page.click(".gnb_first a.memo");
    await page.screenshot({
        path: `screenshot/오늘의메모.png`,
        fullPage: true
      });
    // await page.waitForSelector(".writenote");
    // await page.click(".writenote a ");
    // await page.waitForSelector("._write_btn");
    // 새 메모 쓰기를 하고
    // 메모로 이동해서
    // 스크린샷을 찍는다 

    // 로그아웃은 아이프레임이라 구현이 일단은 배운데까지는 되지 않는다
    // await page.waitForSelector("#minime");

    // await page.click(".btn_logout");
    

    // await page.close();
    // await browser.close();
  } catch (err) {
    console.log(err);
  }
};

crawler();
