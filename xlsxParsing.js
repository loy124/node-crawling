const xlsx = require("xlsx");


const workbook = xlsx.readFile("./xlsx/data.xlsx");
//시트 네임들을 가져올수 있다.
console.log(workbook.SheetNames);

// 배열의 키값을 가져올때 사용하는 Object.keys
//영화목록시트가 담긴다 
// console.log(Object.keys(workbook.Sheets));
const ws = workbook.Sheets.영화목록;
// console.log(ws);

//row들 가져오기 
// sheet_to_json는 엑셀의 복잡한 데이터를 자바스크립트 객체로 변환해준다.


// header를 사용해줬을때 첫항 빼주기 
// records.shift(); //첫번재 배열 A : '제목', B:'링크를 빼준다'


// A1 ~ B11 까지 
console.log(ws['!ref']);
// A1 ~ B11 까지 -> A2: B11 까지로 바꿔주기
ws['!ref'] = ws['!ref'].split(":").map((v, i) => {
    if(i === 0){
        return "A2";
    }
    return v;
}).join(":");

// 이렇게 즉시 해도 가능하다 
// ws['!ref'] = 'A2:B11';

const records = xlsx.utils.sheet_to_json(ws, {header :'A'});
console.log(records);

