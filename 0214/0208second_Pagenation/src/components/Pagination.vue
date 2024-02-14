<template>
    <div class="pagination">
      <button @click="firstPage" :disabled="currentPage === 1">처음</button>
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <button
        v-for="pageNumber in displayedPages"
        :key="pageNumber"
        class="page-link"
        @click="changePage(pageNumber)"
        :class="{ active: currentPage === pageNumber }"
      >{{ pageNumber }}</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      <button @click="lastPage" :disabled="currentPage === totalPages">끝</button>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['total', 'pageSize', 'currentPage'],
    computed: {
      totalPages() {
        return Math.ceil(this.total / this.pageSize);
      },
      displayedPages() {
        const totalButtons = 5;
        const start = Math.max(1, this.currentPage - Math.floor(totalButtons / 2));
        const end = Math.min(this.totalPages, start + totalButtons - 1);
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
      }
    },
    methods: {
      async changePage(page) {
        try {
          const response = await axios.get(`http://192.168.0.149:8000/fourchar?page=${page}`);
          this.$emit('changePage', page, response.data); // 변경된 페이지와 데이터를 부모 컴포넌트로 전달
        } catch (error) {
          console.error('페이지 데이터를 불러오는 중 오류 발생:', error);
        }
      },
      firstPage() {
        this.changePage(1);
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.changePage(this.currentPage - 1);
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.changePage(this.currentPage + 1);
        }
      },
      lastPage() {
        this.changePage(this.totalPages);
      }
    }
  };
  </script>
  
  <style scoped>
  .pagination {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  </style>
  