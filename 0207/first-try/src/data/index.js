const XLSX = require('xlsx');
const fs = require('fs');

// xlsx 파일의 경로
const xlsxFilePath = './final.xlsx';

// xlsx 파일을 읽어서 데이터를 추출하는 함수
function readXlsxFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

// xlsx 파일을 읽어서 데이터를 추출
const rawData = readXlsxFile(xlsxFilePath);

// 데이터를 원하는 형식으로 가공하여 객체 배열로 변환
const formattedData = rawData.map(row => ({
    id: row.column1,
    category: row.column2,
    url_name: row.column3,
    contents_kr: row.column4,
    contents_eng: row.column5,
    contents_zh: row.column6,
    contents_detail: row.column7,
    contents_divided: row.column8,
    author: row.column9,
    continent: row.column10,
    crawled_at: row.column11,
}));

module.exports = formattedData;