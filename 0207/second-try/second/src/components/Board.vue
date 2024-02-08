<template>
    <div>
      <h1>사자성어 페이지</h1>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>URL Name</th>
            <!-- 다른 열들 추가 -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in formattedData" :key="index">
            <td>{{ item.id }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.type_id }}</td>
            <td>{{ item.url_name }}</td>
            <td>{{ item.type_kr }}</td>
            <td>{{ item.type_chn }}</td>
            <td>{{ item.content_desc_kr }}</td>
            <td>{{ item.content_desc_en }}</td>
            <td>{{ item.author }}</td>
            <td>{{ item.continent }}</td>
            <td>{{ item.useyn }}</td>
            <td>{{ item.updated_at }}</td>
            <td>{{ item.created_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formattedData: [], // 받아온 데이터를 저장할 배열
      };
    },
    // fastapi 등을 사용하여 데이터를 가져올 수 있는 메서드
    methods: {
      fetchData() {
        // 데이터를 가져오는 로직 작성
        // 예시:
        fetch('api')
          .then(response => response.json())
          .then(data => {
            this.formattedData = data; // 받아온 데이터를 변수에 할당
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      },
    },
    created() {
      // 컴포넌트가 생성될 때 데이터를 가져오는 메서드 호출
      this.fetchData();
    },
  };
  </script>
  
  <style>
  /* 필요한 스타일 추가 */
  </style>
  