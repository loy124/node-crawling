const parse  = require("csv-parse/lib/sync");
const fs = require("fs");

const csv = fs.readFileSync("./csv/FL_insurance_sample.csv");
// console.log(csv.toString());
//parse 메서드 -> 2차원배열화
const records = parse(csv.toString());
// 첫째 에 행에 대한 정보가 저장되어있다
console.log(records[0]);
// 데이터 필터링을 해야한다.
const [one, ...otherRecords] = records;
console.log(otherRecords[0]);
// one 과 otherRecords를 비교해야한다
const aa = otherRecords.filter(li => li[2] === 'MIAMI DADE COUNTY' && li[16] ==="Wood");


// records.map(r => {
//     if()
// })
