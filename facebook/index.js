const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
dotenv.config();

const crawler = async () => {
  db.Facebook.sync();
  try {
    await db.sequelize.sync();
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
    );
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://facebook.com");
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    await page.type("#email", email);
    await page.waitFor(1000);
    await page.type("#pass", password);
    await page.waitFor(1000);
    await page.click("button[type=submit]");
    await page.waitFor(1000);

    await page.waitForSelector("._2md");
    await page.click("._2md");
    await page.waitFor(1000);
    await page.waitForSelector("[id^=hyperfeed_story_id]:first-child");
    let result = [];
    while (result.length < 10) {
      await page.waitFor(3000);
      const newPost = await page.evaluate(() => {
        window.scrollTo(0, 0);
        const firstFeed = document.querySelector(
          "[id^=hyperfeed_story_id]:first-child"
        );
        const name =
          firstFeed.querySelector(".fwb.fcg a:first-of-type") &&
          firstFeed.querySelector(".fwb.fcg a:first-of-type").textContent;
        const content =
          firstFeed.querySelector(".userContent") &&
          firstFeed.querySelector(".userContent").textContent;
        // 이미지를 들고오려고 할때
        // document.querySelectorAll(".mtm") 을 하면
        // .mtm.`12`가 출력이되는데
        // document.querySelectorAll("[class=mtm]") 을하면 class가 딱 mtm인 경우만 출력이 된다.
        const postId = firstFeed.id.split("_").slice(-1)[0]; //배열의 마지막 고르는 코드 ;
        const img =
          firstFeed.querySelector("[class=mtm] img") &&
          firstFeed.querySelector("[class=mtm] img").src;
        return {
          name,
          img,
          content,
          postId,
        };
      });
      console.log(newPost);

      // _3_16 일때 좋아요가 눌러있는 상태고
      // _3_16 이 없으면 좋아요가 눌러져 있지 않은 상태이다.
      await page.waitFor(1000);
      await page.evaluate(() => {
        // 광고는 좋아요 하지 않도록 진행하기
        const likeButton = document.querySelector("._6a-y");
        const liked = document.querySelector("._3_16");
        //좋아요가 눌러져있지 않은 경우에만
        if (!liked) {
          likeButton.click();
        }
        // 광고인데 좋아요가 눌러져있는경우 해제
      });
      await page.waitFor(1000);
      await page.evaluate(() => {
        // 크롤링해서 좋아요 했으니 피드 지우기
        const firstFeed = document.querySelector(
          "[id^=hyperfeed_story_id]:first-child"
        );
        firstFeed.parentNode.removeChild(firstFeed);
      });
      await page.waitFor(1000);

      // 존재하지 않는 경우에만 DB에 넣는다
      const exist = await db.Facebook.findOne({
        where: {
          postId: newPost.postId,
        },
      });
      if (!exist) {
        result.push(newPost);
      }
      await page.evaluate(() => {
        window.scrollBy(0, 200);
      })
    }
    console.log(result);
    // db에 저장
    await Promise.all(
      result.map((r) => {
        return db.Facebook.create({
          postId: r.postId,
          content: r.content,
          image: r.img,
          writer: r.name,
        });
      })
    );

    await page.close();
    await browser.close();
    await db.sequelize.close();
  } catch (err) {
    console.log(err);
  } finally {
  }
};

crawler();
