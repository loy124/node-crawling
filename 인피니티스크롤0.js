const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto("https://unsplash.com");

    let result = await page.evaluate(() => {
        let imgs = [];
        const imgEls = document.querySelectorAll('.nDTlD img._2zEKz');
        if(imgEls.length){
            // document.querySelctorAll은 배열이 아니므로 forEach만 사용가능 
            imgEls.forEach(v => {
                if(v.src){
                    imgs.push(v.src);
                }
                v.parentElement.removeChild(v);
            })
        }
        return imgs;
    });
    
    console.log(result);
    console.log(result.length);
    await page.close();
    await browser.close();
  } catch (err) {
    console.log(err);
  } finally {
  }
};
crawler();
