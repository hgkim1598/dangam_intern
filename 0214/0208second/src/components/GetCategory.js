// // API 주소
// const apiUrl = 'http://192.168.0.149:8000/fourchar/';

// // API에서 데이터를 가져오는 함수
// async function fetchData() {
//   try {
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('데이터를 불러오는 중 오류 발생:', error);
//     return null;
//   }
// }

// // fetchData 함수를 호출하여 데이터를 가져옴
// fetchData()
//   .then(data => {
//     if (data) {
//       // 'category' 키를 가진 값들을 추출하여 중복을 제거한 후 리스트로 만들기
//       const categoryList = [...new Set(data.map(item => item.category))];
//       console.log(categoryList); // unique한 카테고리 리스트 출력
//     }
//   });



// GetCategory.js

// API 주소
const apiUrl = 'http://192.168.0.149:8000/fourchar/';

// API에서 데이터를 가져오는 함수
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('데이터를 불러오는 중 오류 발생:', error);
    return null;
  }
}

// fetchData 함수를 default로 내보냄
export default fetchData;
