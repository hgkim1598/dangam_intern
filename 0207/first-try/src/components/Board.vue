<template>
    <div>
      <h1>사자성어 페이지</h1>
      <b-table striped hover :items="tableData"></b-table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        tableData: [] // 테이블 데이터를 저장할 배열
      };
    },
    created() {
      this.fetchData(); // 페이지가 로드될 때 데이터를 가져오는 메서드 호출
    },
    methods: {
      async fetchData() {
        try {
          // Axios를 사용하여 FastAPI에 GET 요청을 보냄
          const response = await axios.get('api');
          // 응답으로 받은 데이터를 테이블 데이터에 할당
          this.tableData = response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
  };
  </script>
  