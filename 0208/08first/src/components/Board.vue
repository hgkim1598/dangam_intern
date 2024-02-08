<!-- eslint-disable -->
<template>
    <div>
      <h2>테이블 예제</h2>
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th v-for="header in headers" :key="header.text">{{ header.text }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.author }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.content_desc_kr }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </template>
  
  <script>
    import axios from 'axios';
  export default {
    data() {
      return {
        headers: [
          { text: 'author', align: 'start', sortable: false, value: 'author' },
          { text: 'category', value: 'category' },
          { text: 'content_desc_kr', value: 'content_desc_kr' }
        ],
        items: []
      };
    },
    created() {
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
  };
  </script>
  
