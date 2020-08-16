const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");

fs.readdir('imgs', (err) => {
  if(err){
    console.error("imgs 폴더가 없어 imgs 폴더를 생성합니다.")
    fs.mkdirSync('imgs');
  }
});

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto("https://unsplash.com");

    // let result = await page.evaluate(() => {
    //     let imgs = [];
    //     const imgEls = document.querySelectorAll('.nDTlD img._2zEKz');
    //     if(imgEls.length){
    //         // document.querySelctorAll은 배열이 아니므로 forEach만 사용가능 
    //         imgEls.forEach(v => {
    //             if(v.src){
    //                 imgs.push(v.src);
    //             }
    //             v.parentElement.removeChild(v);
    //         })
    //     }
    //     return imgs;
    // });

    // 리팩토링을 진행한다
let result = []
   while(result.length <= 30){
    let srcs = await page.evaluate(() => {
        // 절대 좌표 
        window.scrollTo(0, 0);
        let imgs = [];
        const imgEls = document.querySelectorAll('.nDTlD');
        if(imgEls.length){
            // document.querySelctorAll은 배열이 아니므로 forEach만 사용가능 
            imgEls.forEach(v => {
                const img = v.querySelector("img._2zEKz");
                if(img && img.src){
                    imgs.push(img.src);
                }
                v.parentElement.removeChild(v);

            })
        }
        //30번했는데 벌써 크롤러가 바닥으로 갔기때문에
        //상단에서 최상단으로 한번 스크롤을 해주고 진행한다 
        // scrollBy 상대좌표
        window.scrollBy(0, 100);
        setTimeout(() => {
          window.scrollBy(0, 200);
        }, 500);
        return imgs;
    });
    
    result = result.concat(srcs);
    //선택자를 기다릴 수 있다.
    await page.waitForSelector("figure");
    console.log("태그 로딩 완료");
   }
    result.forEach(async(src) => {
      const imgResult = await axios.get(src.replace(/\?.*$/, ''), {
        responseType:'arraybuffer'
      });
      // 개발자도구 네트워크를 활용해 확장자 파악하기
      fs.writeFileSync(`imgs/${new Date().valueOf()}.jpeg`, imgResult.data);
    })
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


// reduce를 활용해서 한번 리팩토링을 진행해 보았으나 
    // 원본 배열을 손상시키기때문에 forEach로 하는게 맞다는 생각이 들었다.

    // while (result.length <= 30) {
    //   // 클래스명이 정말 자주 바뀌기때문에 확인해줘야한다.
    //   const srcs = await page.evaluate(() => {
    //     window.scrollTo(0, 0);
    //     const imgEls = document.querySelectorAll(".nDTlD"); // 사이트 바뀌었을 때 클래스 적절히 바꾸기
    //     if (imgEls.length) {
    //       // querySelectorAll은 배열이 아니라서 forEach만 사용이 가능하다.
    //       const data = Array.from(imgEls).reduce((acc, cur) => {
    //         const img = cur.querySelector("img._2zEKz");
    //         if (img && img.src) {
    //           acc.push(img.src);
    //         }
    //         //크롤링을 한후에 현재 값을 지워준다.
    //         cur.parentElement.removeChild(cur);
    //         return acc;
    //       }, []);
    //       window.scrollBy(0, 100);
    //       setTimeout(() => {
    //         window.scrollBy(0, 200);
    //       }, 500);
    //       return data;
    //     }
    //   });
    //   result = result.concat(srcs);
    //   await page.waitForSelector("figure");
    // }