<template>
  <div>
    <div v-if="imageInfo">
      <!-- 이미지 표시 -->
      <img :src="imageInfo.created_url" alt="Image" style="max-width: 100%; max-height: 400px;">

      <!-- 다른 상세 정보들 -->
      <div>
        <!-- 이미지 URL -->
        <p>Image URL: {{ imageInfo.created_url }}</p>

        <!-- 다른 상세 정보들 -->
        <p>프롬프트: {{ imageInfo.prompt }}</p>
        <p>카테고리: {{ getCategoryName(imageInfo.category_id) }}</p>
        <!-- 필요한 다른 상세 정보들을 표시 -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['itemId'], // 부모 컴포넌트에서 전달된 itemId prop을 받음
  data() {
    return {
      imageInfo: null, // 이미지의 상세 정보를 저장할 객체
      categories: [] // 카테고리를 저장할 배열
    };
  },
  created() {
    // 컴포넌트가 생성될 때, itemId를 사용하여 API 호출
    this.fetchImageInfo();
    this.fetchCategories(); // 카테고리 데이터를 가져옴
  },

  methods: {
    async fetchImageInfo() {
      try {
        // 이미지의 상세 정보를 가져오는 API 요청을 보냄
        const response = await axios.get(`http://192.168.0.149:8000/create_image/${this.itemId}`);
        this.imageInfo = response.data; // 가져온 상세 정보를 imageInfo에 저장
        console.log(this.imageInfo);
      } catch (error) {
        console.error('Error fetching detailed information:', error);
        // 에러 처리
      }
    },

    async fetchCategories() {
      try {
        const apiUrl = 'http://192.168.0.149:8000/pixabay/image_categories/';
        const response = await axios.get(apiUrl);
        // 카테고리 배열에 데이터 저장
        this.categories = response.data;
        console.log(this.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.category : 'Unknown';
    }
  }
};
</script>
