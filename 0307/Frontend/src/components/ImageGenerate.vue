<template>
  <div>
    <!-- 검색창을 포함한 상단 영역 -->
    <div class="search-bar">
      <div class="d-flex justify-content-between align-items-baseline">
        <!-- 폼 요소 -->
        <div class="d-flex">
          <b-form @submit.prevent="submitForm" no-ok no-cancel class="d-flex align-items-center">
            <!-- 문장 입력 -->
            <b-form-group>
            <b-form-input id="prompt" v-model="prompt" placeholder="프롬프트 문장을 입력하세요"></b-form-input>
          </b-form-group>
            <!-- 파일 선택 -->
            <b-form-group>
            <b-form-file id="file" v-model="text_file" :state="Boolean(file)" accept=".txt" plain></b-form-file>
          </b-form-group>
            <!-- 카테고리 선택 -->
            <b-form-group>
              <b-dropdown v-model="selectedCategory" :text="selectedCategory ? selectedCategory : '카테고리 선택'" variant="outline-primary" :class="{'invalid-dropdown': !selectedCategory}">
              <b-dropdown-menu class="custom-dropdown-menu">
                <div style="max-height: 300px; overflow-y: auto;">
                  <b-form-radio v-for="(cat, index) in categories" :key="index" :value="cat" @input="selectedCategory = cat" name="category">{{ cat }}</b-form-radio>
                </div>
              </b-dropdown-menu>
            </b-dropdown>
          </b-form-group>
          <!--개수 선택-->
          <b-form-group>
            <b-form-input id="quantity" v-model="quantity" maxlength="4" placeholder="개수"></b-form-input>
          </b-form-group>
            <b-button type="submit" variant="primary" class="ml-3">생성</b-button>
          </b-form>
        </div>
     </div>
        <!-- 전체 선택 체크박스와 선택된 이미지 다운로드 버튼 -->
        <div class="checkbox-container">
          <b-form-checkbox v-model="selectAll" @change="selectAllImages" class="mr-3">전체 선택</b-form-checkbox>
          <b-button @click="downloadSelectedImages" size="sm" :disabled="selectedImages.length === 0" class="downbtn">선택된 이미지 다운로드</b-button>
        </div>
     
    </div>
  
    <!-- 카테고리 필터 -->
    <div class="categoryfilter">
      <b-dropdown v-if="categories.length > 0" ref="categoryDropdown" class="category-dropdown" variant="">
        <template #button-content>
          카테고리 별 보기
        </template>
        <b-form-group  class="category-dropdown-list">
          <b-form-checkbox-group v-model="selectedCategories">
            <b-form-checkbox v-for="(cat, index) in categories" :key="index" :value="cat" v-model="selectedCategories">{{ cat }}</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-button @click="closeDropdown">취소</b-button>
        <b-button @click="fetchDataWithSelectedCategories" variant="success">확인</b-button>
      </b-dropdown>
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
      prompt: '',
      text_file: '', // 선택된 파일을 저장할 변수
      promptOrFile: '', // 사용자가 문장이나 파일 경로 저장
      selectedImages: [], // 선택된 이미지를 추적하는 배열
      modalVisible: false, // 모달 창의 표시 여부
      modalTitle: '', // 모달의 제목
      itemId: null, // 아이템 ID
      selectAll: false, // 전체 선택 체크박스
      imageInfo: null,
      selectedItemId: null,
      categories: [],
      selectedCategories: [], // 선택된 카테고리 배열
      selectedCategory: null,
      quantity: 1,
    };
  },
  components: {
    ImageShow
  },
  created() {
    this.fetchImages();
    this.fetchCategories();
    this.itemId = itemId;
  },
  methods: {

    async submitForm() {
      try {
        // FormData 객체를 생성합니다.
        const formData = new FormData();

        formData.append('prompt', this.prompt);
        formData.append('text_file', this.text_file);
        formData.append('category', this.selectedCategory);
        formData.append('quantity', this.quantity);
        console.log(formData);
        // 서버로 POST 요청을 보냅니다.
        await axios.post('http://192.168.0.149:8000/create_image/', formData);

        alert('이미지를 생성중입니다. 잠시만 기다려주세요');
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    },

    fetchImages(page, categoriesParams) {
      // 이미지 데이터를 가져오는 API 호출
      let apiUrl = `http://192.168.0.149:8000/create_image/`
      const queryParams = [];
      if(categoriesParams){
        queryParams.push(categoriesParams);
        this.$refs.categoryDropdown.hide();
        queryParams.push(`p=${page}`);
        apiUrl += `filter/?${queryParams.join('&')}`;
      }
      else {
        if(page){
          apiUrl += `?p=${page}`
        } else {
          apiUrl += `?p=1`
        }
      }
      console.log(apiUrl)
      axios.get(apiUrl)
        .then(response => {
          console.log(response.data)
          this.items = response.data.contents;
          this.totalPage = response.data.total_page;
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
    this.categories = response.data.map(item => item.category);
    console.log(this.categories);
  } catch (error) {
    console.error('카테고리를 불러오는 중 오류 발생:', error);
  }
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
          this.fetchImages(page,categoriesParams);
        } else {
          this.fetchImages(page);
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
  position: relative;
  margin-bottom: 30px;
  margin-top: 30px;
  display: flex; /* 요소들을 가로로 나란히 표시 */
}

.checkbox-container {
  margin-bottom: 30px;
  position: absolute;
  display: flex;
  flex-direction: row; /* 요소들을 가로로 정렬 */
  justify-content: flex-start; /* 요소들을 수평으로 가운데 정렬 */
  top: 0;
  right: 0;
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

.categoryfilter{
  position: relative;
  margin-top: 60px;
}

.category-dropdown {
  position: absolute;
  width: 80px;
  top: 0; /* 부모 요소 상단에 위치 */
  left: 0; /* 부모 요소 왼쪽에 위치 */
  margin-top: -40px; /* 테이블과 겹치지 않도록 드롭다운 박스를 위로 올림 */
  margin-left: 30px; /* 왼쪽 여백 설정 */
}

.category-dropdown-list {
  height: 200px; /* 드롭다운 박스의 최대 높이 설정 */
  overflow-y: auto; /* 수직 스크롤을 활성화합니다. */
}



</style>
