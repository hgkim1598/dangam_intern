<!-- <template>
    <div>
      <h1>게시판</h1>
      <b-table striped hover :items="items"></b-table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        items: [],
      };
    },
    created() {
      axios.get('api')  // FastAPI 서버 주소에 맞게 변경
        .then(response => {
          this.items = response.data;  // 받은 데이터를 items 변수에 할당
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
  };
  </script>
  
  <style>
  /* 스타일링 */
  </style>
   -->



   <template>
    <div>
      <h1>데이터 표시 예시</h1>
      <ul>
        <li v-for="item in items" :key="item.id">{{ item }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {

    data() {
      
      return {
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

  <style>
  
  </style>
  