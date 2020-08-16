const parse  = require("csv-parse/lib/sync");
const fs = require("fs");

const csv = fs.readFileSync("./csv/data.csv");
console.log(csv.toString());
//parse 메서드 -> 2차원배열화
const records = parse(csv.toString());
console.log(records);

