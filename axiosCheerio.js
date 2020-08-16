const xlsx = require("xlsx");
const axios = require('axios'); 
const cheerio = require('cheerio'); // html 파싱
const add_to_sheet = require("./add_to_sheet");
const workbook = xlsx.readFile("./xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

// for(const [i, r] of records.entries()){
//     console.log(i, r.제목, r.링크);
// }

// 엑셀에있는 링크를 파싱으로 가져와서 Promise.all로 전부 axios 요청을 보낸다.
const crawler = async () => {
    add_to_sheet(ws, 'C1', 's','평점');
    for(const [i, r] of records.entries() ){
        const response = await axios.get(r.링크);
        if(response.status === 200){ //응답이 성공한경우
            const html = response.data;
            // console.log(html);            
            const $ = cheerio.load(html);
            // 네티즌 평점 가져오기
            const text = $('.score.score_left .star_score').text();
            console.log(r.제목, '평점', text.trim());
            const newCell = 'C' + (i + 2);
            add_to_sheet(ws, newCell, 'n', parseFloat(text.trim()));
        }
    }
    xlsx.writeFile(workbook, 'xlsx/result.xlsx');
    // await Promise.all(records.map(async (r) => {

    // }))
}

crawler();