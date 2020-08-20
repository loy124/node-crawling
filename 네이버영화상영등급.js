const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const axios = require('axios'); 
const cheerio = require('cheerio'); // html 파싱

const csv = fs.readFileSync(`${__dirname}/csv/data-movie.csv`);
const records = parse(csv.toString());
console.log(records);

// 엑셀에있는 링크를 파싱으로 가져와서 Promise.all로 전부 axios 요청을 보낸다.
const crawler = async () => {
    await Promise.all(records.map(async ([title, link]) => {
    //   r.title r.link를 해당과 같이 비구조화 적용 
    const response = await axios.get(link);
    if(response.status === 200){
        const html =response.data;
        const $ = cheerio.load(html);
        const text = $('.score.score_left .star_score').text();
        // const text = $(".info_spec dd:nth-of-type(4) a:first-of-type").text().trim();
        console.log(title, link, text);
    }

    }))
}

crawler();