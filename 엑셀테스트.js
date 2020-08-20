const xlsx = require("xlsx");

const workbook = xlsx.readFile("./xlsx/data-movie.xlsx");

// 배열의 키값을 가져올때 사용하는 Object.keys
//영화목록시트가 담긴다 
// console.log(Object.keys(workbook.Sheets));
const ws = workbook.Sheets.영화목록;
// console.log(ws);

//row들 가져오기 
// sheet_to_json는 엑셀의 복잡한 데이터를 자바스크립트 객체로 변환해준다.
const records = xlsx.utils.sheet_to_json(ws, {header :'A'});
console.log(records);