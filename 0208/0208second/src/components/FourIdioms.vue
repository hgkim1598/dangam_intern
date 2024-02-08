<template>
    <div>
      <b-table striped hover :items="items" :fields="fields"></b-table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

    export default {
      data() {
        return {
          fields:[
            {
              key: 'id',
              label: 'No'
            },
            {
              key: 'category',
              label: '카테고리'
            },
            {
              key: 'contents_kr',
              label: '사자성어(한글)'
            },
            {
              key: 'contents_zh',
              label: '사자성어(한문)'
            },
            {
              key: 'contents_detail',
              label: '뜻풀이'
            },
          ],
          items: []
        };
      },
      created(){
        // FastAPI 서버의 URL
        const apiUrl = 'api';
  
        // Axios를 사용하여 GET 요청을 보냄
        axios.get(apiUrl)
          .then(response => {
          // 받은 데이터를 Vue 데이터에 저장
          this.items = response.data;
        })
        .catch(error => {
          console.error('데이터를 불러오는 중 오류 발생:', error);
        });
      }
    }
  </script>
