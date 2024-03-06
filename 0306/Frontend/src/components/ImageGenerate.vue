<template>
  <div>
    <!-- 검색창을 포함한 상단 영역 -->
    <div class="search-bar">
      <div class="d-flex justify-content-between align-items-baseline">
        <!-- 폼 요소 -->
        <div class="d-flex">
          <b-form @submit.prevent="submitForm" no-ok no-cancel class="d-flex align-items-center">
            <!-- 문장 입력 -->
            <b-form-input @input="checkInput" id="prompt" v-model="prompt" placeholder="프롬프트 문장을 입력하세요"></b-form-input>
            <!-- 파일 선택 -->
            <b-form-file @change="checkInput" id="file" v-model="file" :state="Boolean(file)" accept=".txt" plain></b-form-file>
            <!-- 카테고리 선택 -->
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

        <!-- 전체 선택 체크박스와 선택된 이미지 다운로드 버튼 -->
        <div class="checkbox-container">
          <b-form-checkbox v-model="selectAll" @change="selectAllImages" class="mr-3">전체 선택</b-form-checkbox>
          <b-button @click="downloadSelectedImages" size="sm" :disabled="selectedImages.length === 0" class="downbtn">선택된 이미지 다운로드</b-button>
        </div>
      </div>
    </div>


    <!-- 카드들을 표시하는 부분 -->
    <div>
    <!-- 이미지 관련된 내용이나 기능을 담는 역할 -->
    <div class="ImageCrowling py-5">
      <!-- 그리드로 나누기 위한 컨테이너 -->
      <b-container>
        <div class="row">
          <!-- 카드 반복 생성 -->
          <div v-for="(item, index) in items" :key="index" class="col-md-3 mb-3">
            <div class="card shadow-lg">
            <!-- 체크박스 -->
            <b-form-checkbox v-model="selectedImages" :value="item" class="mr-2"></b-form-checkbox>
            <b-img :src="item.created_url" class="image" alt="AI생성이미지" thumbnail fluid />
              <div class="card-body">
                <div class="d-flex justify-content-end align-items-center">
                  <div class="btn-group">
                    <!-- 상세보기, 다운로드, 삭제 버튼들 -->
                    <b-button variant="outline-primary" size="sm" @click="detailViewClick(item.id)">상세보기</b-button>
                        <!-- 모달 컴포넌트 -->
                        <b-modal v-model="modalVisible" :title="modalTitle" hide-footer>
                          <!-- ImageShow 컴포넌트 렌더링 -->
                          <ImageShow :showModal="modalVisible" :imageInfo="imageInfo" :itemId="itemId" @closeModal="closeModal" />
                        </b-modal>
                    <b-button variant="outline-success" size="sm" @click="downloadClick">다운로드</b-button>
                    <b-button variant="outline-danger" size="sm" @click="deleteClick">삭제</b-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-container>
    </div>
  </div>

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
import ImageShow from './ImageShow.vue';

export default {
  data() {
    return {
      searchQuery: '', // 검색어를 저장하는 데이터
      items: [], // 데이터를 저장할 배열
      pageNumber: 1, // 현재 페이지 번호
      totalPage: 1, // 전체 페이지 수
      file: null, // 선택된 파일을 저장할 변수
      promptOrFile: '', // 사용자가 문장이나 파일 경로 저장
      selectedImages: [], // 선택된 이미지를 추적하는 배열
      modalVisible: false, // 모달 창의 표시 여부
      modalTitle: '', // 모달의 제목
      itemId: null, // 아이템 ID
      selectAll: false, // 전체 선택 체크박스
      imageInfo: null,
      selectedItemId: null,
      categories: ["목", "토", "화", "수", "금"],
      selectedCategories: [], // 선택된 카테고리 배열
    };
  },
  components: {
    ImageShow
  },
  created() {
    // 이미지 데이터를 가져오는 API 호출
    this.fetchImages();
    this.itemId = itemId;
    this.fetchCategories(); // 카테고리 데이터 가져오기
  },
  methods: {

    async submitForm() {
      const data = {
        prompt: this.prompt, // 사용자 입력 문장
        file: this.file, // 선택된 파일
        category: this.selectedCategory, // 선택된 카테고리
        quantity: this.quantity // 개수
      };
      try {
        const response = await axios.post('<http://192.168.0.149:8000/create_image>', data);
      } catch (error) {
        console.error('Error:', error);
      }
    },

    fetchImages() {
      // 이미지 데이터를 가져오는 API 호출
      axios.get('http://192.168.0.149:8000/create_image/?p=1')
        .then(response => {
          console.log(response.data)
          this.items = response.data.contents;
          this.totalPage = response.data.totalPage;
          this.itemId = response.data.id;
        })
        .catch(error => {
          console.error('Error fetching images:', error);
        });
    },

    async fetchCategories() {
  try {
    const apiUrl = 'http://192.168.0.149:8000/pixabay/image_categories/';
    const response = await axios.get(apiUrl);
    // 카테고리 배열에 데이터 저장
    this.categories = this.extractCategories(response.data);
    console.log(this.categories)
  } catch (error) {
    console.error('카테고리를 불러오는 중 오류 발생:', error);
  }
},

extractCategories(data) {
  return data.map(item => item.category);
},


    detailViewClick(itemId) {
    // 상세보기 버튼 클릭 시 실행되는 함수
    try {
      this.itemId = itemId; // 모달에 전달할 아이템의 ID 설정
      this.modalTitle = `이미지 상세 정보`; // 모달 제목 설정
      this.modalVisible = true; // 모달 창 표시
    } catch (error) {
      console.error('Error fetching image details:', error);
    }
  },

    closeModal() {
      this.modalVisible = false;
      // 모달을 닫습니다.
      this.hideModal();
    },
    downloadClick() {
      // 다운로드 버튼 클릭 시 실행되는 함수
      // 백엔드 상에 다운로드 코드를 만들어두고 API요청을 보내야함
      try {
        // API 요청을 보내서 이미지를 다운로드 받음
        window.open(`https://quotes.api.thegam.io/create_image/results/?id=${item.id}`, '_blank');
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    },
    async deleteClick(item) {
      const confirmDelete = confirm('삭제하시겠습니까?');
      if (confirmDelete) {
        try {
          await axios.delete(`https://quotes.api.thegam.io/create_image/delete/?${item.id}`);
          const index = this.items.findIndex(i => i.id === item.id);
          if (index !== -1) {
            this.items.splice(index, 1);
          }
          console.log('아이템 삭제 완료');
        } catch (error) {
          console.error('아이템 삭제 중 오류 발생:', error);
        }
        location.reload();
      }
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPage) {
        this.pageNumber = page;
        if (this.selectedCategories.length > 0 ){
          const categoriesParams = this.selectedCategories.map(category => `categories=${encodeURIComponent(category)}`).join('&');
          this.fetchData1(page,categoriesParams);
        } else {
          this.fetchData1(page);
        }
      }
    },
    async downloadSelectedImages() {
      try {
        // 선택된 이미지 배열을 순회하면서 이미지를 다운로드
        for (const image of this.selectedImages) {
          try {
            // API 요청을 보내서 이미지를 다운로드 받음
            // 여러개 선택이기 때문에 카테고리 필터링때처럼 id=12&id=214 가 되도록 아래  코드 수정후 적용 필요
            // const categoriesParams = this.selectedCategories.map(category => `categories=${encodeURIComponent(category)}`).join('&');
            window.open(`https://quotes.api.thegam.io/create_image/results/?id=${item.id}`, '_blank');
          } catch (error) {
            console.error('Error downloading image:', error);
          }
          window.open(image.url, '_blank'); // 예시로 새 창에서 이미지를 열어보겠습니다.
        }
      } catch (error) {
        console.error('Error downloading selected images:', error);
      }
    },
    // 전체 선택 체크박스 변경 시 모든 이미지 선택 상태 변경
    selectAllImages() {
      if (this.selectAll) {
        this.selectedImages = this.items;
      } else {
        this.selectedImages = [];
      }
    },
    checkInput() {
    if (this.prompt.trim().length > 0 && this.file) {
      // 문장과 파일 모두 입력되었을 경우 경고 창 표시
      alert('문장과 파일 중 하나만 입력해주세요');
      // 입력 필드 초기화
      this.prompt = '';
      this.file = null;
    }
  },
  }
};
</script>

<style scoped>
.custom-card {
  max-width: 100%;
  margin-bottom: 20px;
  position: relative; /* 카드 내부의 요소를 position: absolute;로 배치하기 위해 부모 요소를 상대적으로 설정 */
}

.custom-checkbox {
  position: absolute; /* 카드 내에서 절대 위치로 배치 */
  top: 10px; /* 카드의 상단으로부터 10px 떨어져 있도록 설정 */
  left: 10px; /* 카드의 왼쪽으로부터 10px 떨어져 있도록 설정 */
}

.button-row {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.my-4 > .row:not(:last-child) {
  margin-bottom: 1rem;
}

/* .search-bar {
  margin-bottom: 30px;
  margin-top: 30px;
} */

/* .image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
} */

.b-button-group > .btn {
  margin-right: 10px;
}

#prompt{
  width: 300px;
  margin-left: 10px;
  margin-right: 5px;
}

#file{
  margin-right: 5px;
}

#quantity{
  width: 60px;
  margin-right: 5px;
  margin-left: 5px;
}

.search-bar {
  margin-bottom: 30px;
  margin-top: 30px;
  display: flex; /* 요소들을 가로로 나란히 표시 */
}

.checkbox-container {
  margin-bottom: 30px;
  position: relative;
  display: flex;
  flex-direction: row; /* 요소들을 가로로 정렬 */
  justify-content: flex-start; /* 요소들을 수평으로 가운데 정렬 */
  /* margin-left: auto; */
}
/* 
.downbtn {
  position: absolute;
  top: 10px;
  left: 200px;
} */

.card {
  position: relative; /* 카드 내부의 요소를 position: absolute;로 배치하기 위해 부모 요소를 상대적으로 설정 */
}

.card img {
  width: 100%; /* 이미지의 너비를 100%로 설정하여 부모 요소에 맞춤 */
  height: 200px; /* 높이를 자동으로 조정하여 원본 이미지의 종횡비를 유지 */
  object-fit: contain; /* 이미지가 자리를 차지하도록 설정 */
}

.card-body {
  padding: 15px; /* 카드 바디의 패딩을 조절하여 이미지가 잘리지 않도록 함 */
}

.card-body .btn-group {
  margin-top: 10px; /* 버튼 그룹의 상단 마진을 조절 */
}


</style>
