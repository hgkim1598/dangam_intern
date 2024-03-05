<template>
    <div>
      <!-- 검색창을 포함한 상단 영역 -->
      <!-- 추가 개발 필요 -->
      <div class="search-bar">
    <b-form @submit.prevent="submitForm" no-ok no-cancel class="d-flex align-items-center">
      <b-form-input id="prompt" v-model="prompt" required placeholder="프롬프트 문장을 입력하세요"></b-form-input>
      <b-form-file id="file" v-model="file" :state="Boolean(file)" accept=".txt" no-file-chosen></b-form-file>
      <b-dropdown v-model="selectedCategory" :text="selectedCategory ? selectedCategory : '카테고리 선택'" variant="outline-primary" :class="{'invalid-dropdown': !selectedCategory}">
        <b-dropdown-menu class="custom-dropdown-menu">
          <div style="max-height: 300px; overflow-y: auto;">
            <b-form-radio v-for="(cat, index) in categories" :key="index" :value="cat" @input="selectedCategory = cat" name="category">{{ cat }}</b-form-radio>
          </div>
        </b-dropdown-menu>
      </b-dropdown>
      <b-form-input id="quantity" v-model="quantity" maxlength="4" placeholder="개수"></b-form-input>
      <b-button type="submit" variant="primary" class="ml-3">생성</b-button>
    </b-form>
  </div>
  
      <!-- 카드들을 표시하는 부분 -->
      <b-container fluid :g="4" class="mb-4">
        <b-row>
          <b-col v-for="(image, index) in images" :key="index" cols="3">
            <b-card class="custom-card">
              <b-img :src="image.url" fluid thumbnail class="image"></b-img>
              <div class="button-row">
                <b-button-group>
                  <b-button variant="primary" size="sm" @click="detailViewClick">상세보기</b-button>
                  <b-button variant="success" size="sm" @click="downloadClick">다운로드</b-button>
                  <b-button variant="danger" size="sm" @click="deleteClick">삭제</b-button>
                </b-button-group>
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
  
      <!-- 페이지네이션 -->
      <div class="d-flex justify-content-end">
        <div>
          <b-button @click="changePage(pageNumber - 1)" :disabled="pageNumber <= 1">이전 페이지</b-button>
          <span>{{ pageNumber }} / {{ totalPage }}</span>
          <b-button @click="changePage(pageNumber + 1)" :disabled="pageNumber >= totalPage">다음 페이지</b-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        searchQuery: '', // 검색어를 저장하는 데이터
        images: [], // 이미지를 저장할 배열
        pageNumber: 1, // 현재 페이지 번호
        totalPage: 1, // 전체 페이지 수
        file: null, // 선택된 파일을 저장할 변수
        promptOrFile: '', // 사용자가 문장이나 파일 경로 저장
      };
    },
    created() {
      // 이미지 데이터를 가져오는 API 호출
      this.fetchImages();
    },
    methods: {
        async submitForm() { // 생성시 사용자가 입력한 데이터 보내기, 아직 개수랑 카테고리 데이터 보내는 부분 구현 안됨
            try {
                const response = await axios.post('엔드포인트URL', {
                prompt_or_file: this.promptOrFile
                });
                this.imageUrl = response.data.image_url;
            } catch (error) {
                console.error('Error:', error);
            }
        },
      fetchImages() { // b-card들에 보여지는
        // 이미지 데이터를 가져오는 API 호출
        // axios.get('엔드포인트 URL')
        //   .then(response => {
        //     this.images = response.data.images;
        //     this.totalPage = response.data.totalPage;
        //   })
        //   .catch(error => {
        //     console.error('Error fetching images:', error);
        //   });
  
        // 임시로 데이터 설정 (백엔드 연동시 삭제)
        this.images = [
          { url: 'image1.jpg' },
          { url: 'image2.jpg' },
          { url: 'image3.jpg' },
          { url: 'image1.jpg' },
          { url: 'image2.jpg' },
          { url: 'image3.jpg' },
          { url: 'image1.jpg' },
          { url: 'image2.jpg' },
          { url: 'image3.jpg' },
          { url: 'image1.jpg' },
          { url: 'image2.jpg' },
          { url: 'image3.jpg' },
        ];
        this.totalPage = 3; // 임시로 설정 (백엔드 연동시 삭제)
      },
      search() {
        // 검색 기능을 수행하는 메서드
      },
      detailViewClick() {
        // 상세정보 버튼 클릭 시 실행되는 함수
        // 모달창이 열리고 DB의 전체 내용을 읽어온다
        // 새로운 컴포넌트 생성 필요
      },
      downloadClick() {
        // 다운로드 버튼 클릭 시 실행되는 함수
        // url 상의 사진을 다운받는 로직
      },
      deleteClick() {
        // 삭제 버튼 클릭 시 실행되는 함수
        // API URL을 통해 DELETE 요청
      },
      changePage(pageNumber) {
        // 페이지 변경 시 실행되는 함수
        // 새로운 페이지의 이미지 데이터를 가져오는 API 호출
        this.pageNumber = pageNumber;
        // this.fetchImages(); // 페이지 번호에 따라 이미지 데이터를 가져오는 API 호출
      }
    }
  }
  </script>
  
  <style scoped>
  .custom-card {
    max-width: 100%; /* 카드의 최대 너비를 100%로 설정하여 화면 전체에 균등하게 분할 */
    margin-bottom: 20px;
  }
  
  .button-row {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }
  
  .my-4 > .row:not(:last-child) {
    margin-bottom: 1rem; /* 각 행 사이에 여백을 추가 */
  }
  
  .search-bar {
    margin-bottom: 30px;
    margin-top: 30px;
  }
  
  .image {
    /* 이미지 크기가 들쭉날쭉하면 카드 크기도 제각각 변하니까 이미지 크기 고정시키기 */
    /* 실제 이미지 넣어보고 조정 필요 (%대신 px 써도 됨) */
    max-width: 100%; /* 이미지의 최대 너비 */
    max-height: 100%; /* 이미지의 최대 높이 */
    object-fit: contain; /* 이미지가 카드 내에 유지되면서 비율이 유지되도록  */
  }
  
  .b-button-group > .btn {
    margin-right: 10px; /* 각 버튼 사이의 가로 간격 */
  }

  #prompt{
    width: 300px;
    margin-left: 10px;
    margin-right: 5px;
  }

  #file{
    margin-right: 5px;
  }

  /* #file + label::after {
  content: none !important;
}

.custom-file-label {
  display: none;
}

label[for="file"] {
  display: none;
} */


  #quantity{
    width: 60px;
    margin-right: 5px;
    margin-left: 5px;
  }
  </style>
  