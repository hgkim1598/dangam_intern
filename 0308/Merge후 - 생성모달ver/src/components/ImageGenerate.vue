<template>
  <div>
    <!-- 검색창을 포함한 상단 영역 -->
    <div class="search-bar">
      <div class="d-flex justify-content-between align-items-baseline" >
        <!-- 폼 요소 -->
        <div class="d-flex">
          <b-button @click="openImageGenerateModal" class="genbtn">이미지 생성</b-button>
          <b-modal v-model="imageGenerateModalVisible" title="이미지 생성" hide-footer>
            <ImageGenerateModal />
          </b-modal>
          <b-form @submit.prevent="submitForm" no-ok no-cancel class="d-flex align-items-center">
            <!-- 문장 입력 -->
            <b-form-group>
            <b-form-input id="prompt" v-model="prompt" placeholder="검색어를 입력하세요"></b-form-input>
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
            <!--조회버튼-->
          <b-button @click="handleLookup" variant="primary" class="mx-1">조회</b-button>
          </b-form-group>
          </b-form>
        <b-form-checkbox v-model="selectAll" @change="selectAllImages" class="allchek">전체 선택</b-form-checkbox>
        <b-button @click="downloadSelectedImages" size="md" :disabled="selectedImages.length === 0" class="downbtn" variant="success">선택 다운로드</b-button>
        <b-button @click="deleteSelectedImages" size="md" :disabled="selectedImages.length === 0" class="deletebtn" variant="danger">선택 삭제</b-button>
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
                    <b-button variant="outline-primary" size="sm" @click="openImageShowModal(item.id)">상세보기</b-button>
                        <!-- 모달 컴포넌트 -->
                        <b-modal v-model="imageShowModalVisible" title="이미지 상세 정보" hide-footer>
                          <ImageShow :itemId="selectedItemId" />
                        </b-modal>
                    <b-button variant="outline-success" size="sm" @click="downloadClick(item.id)">다운로드</b-button>
                    <b-button variant="outline-danger" size="sm" @click="deleteClick(item.id)">삭제</b-button>

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
import ImageGenerateModal from './ImageGenerateModal.vue';

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
      promptSearch: '', // 검색어를 저장하는 데이터
      categoriesParams: '', // 카테고리를 저장하는 데이터
      images: [], // 이미지 데이터를 저장하는 배열
      imageGenerateModalVisible: false,
      imageShowModalVisible: false,
      selectedItemId: null,
    };
  },
  components: {
    ImageShow,
    ImageGenerateModal
  },
  created() {
    this.fetchImages();
    this.fetchCategories();
    this.itemId = itemId;
  },
  methods: {
    fetchImages(page, promptSearch, categoriesParams) {
      // 이미지 데이터를 가져오는 API 호출
      let apiUrl = `http://192.168.0.149:8000/create_image/`
      const queryParams = [];
      // 조회 버튼이 눌렸을 경우 (필터링)
      if(categoriesParams || promptSearch){
        if(categoriesParams){
          queryParams.push(`categories=${categoriesParams}`);
          // this.$refs.categoryDropdown.hide();
        }
        if(promptSearch){
          queryParams.push(`keyword=${promptSearch}`);
        }
        queryParams.push(`p=${page}`);
        apiUrl += `?${queryParams.join('&')}`;
      }
      // 전체 데이터
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

openImageGenerateModal() {
      this.imageGenerateModalVisible = true;
    },
openImageShowModal(itemId) {
  this.selectedItemId = itemId;
  this.imageShowModalVisible = true;
},

imageGenerateModal(){
  this.modalVisible = true;
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

  downloadClick(itemId) {
  // 클릭한 이미지의 created_url을 가져옵니다.
  const imageURL = this.items.find(item => item.id === itemId).created_url;
  // 다운로드할 이미지의 URL을 downloadImage 함수에 전달
  this.downloadImage(imageURL);
},
downloadImage(imageURL) {
  axios.get(imageURL, { responseType: 'blob' })
    .then(response => {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'image';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    })
    .catch(error => {
      console.error('Error downloading image:', error);
    });
},



    async deleteClick(itemId) {
  const confirmDelete = confirm('삭제하시겠습니까?');
  if (confirmDelete) {
    const apiUrl = `http://192.168.0.149:8000/create_image/delete/?ids=${itemId}`;
    try {
      await axios.delete(apiUrl);
      const index = this.items.findIndex(item => item.id === itemId); // 수정: 아이템의 id를 비교하여 삭제할 아이템을 찾음
      if (index !== -1) {
        this.items.splice(index, 1);
      }
      console.log('아이템 삭제 완료');
    } catch (error) {
      console.error('아이템 삭제 중 오류 발생:', error);
      console.log(apiUrl);
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
    // 선택된 이미지들의 created_url을 가져옵니다.
    const imageURLs = this.selectedImages.map(image => image.created_url);
    // 각 이미지를 순회하면서 다운로드합니다.
    for (const imageURL of imageURLs) {
      await this.downloadImage(imageURL);
    }
  } catch (error) {
    console.error('Error downloading selected images:', error);
  }
},


    async deleteSelectedImages() {
    const confirmDelete = confirm('삭제하시겠습니까?');
    if (confirmDelete) {
      let ids = this.selectedImages.map(image => `ids=${image.id}`).join('&');
      let apiUrl = `http://192.168.0.149:8000/create_image/delete/?${ids}`;
      try {
        await axios.delete(apiUrl);
        // 삭제된 이미지를 배열에서 제거
        this.items = this.items.filter(item => !this.selectedImages.includes(item));
        console.log('아이템 삭제 완료');
      } catch (error) {
        console.error('아이템 삭제 중 오류 발생:', error);
        console.log(apiUrl);
      }
      // 새로고침 대신에 이미지 목록을 업데이트하고 화면을 다시 그릴 수 있도록 함수 호출 없이 처리
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
  async handleLookup() {
  // '조회' 버튼을 클릭했을 때 실행되는 함수
  // 값이 잘 들어왔는지 확인
  console.log('조회 버튼이 클릭되었습니다.');
  console.log('입력된 값:', this.prompt);
  console.log('입력된 카테고리:', this.selectedCategory)
  // 쿼리 생성
  this.pageNumber = 1;
  let promptSearch = ''; // promptSearch 변수를 블록 외부에서 선언
  if(this.prompt){
    promptSearch = this.prompt.trim(); // promptSearch 변수를 블록 내에서 초기화
  }
  let categoriesParams = ''; // categoriesParams 변수를 블록 외부에서 선언
  if(this.selectedCategory){
    categoriesParams = this.selectedCategory
  }
  this.fetchImages(this.pageNumber, promptSearch, categoriesParams)
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

.card .custom-checkbox {
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

.b-button-group > .btn {
  margin-right: 10px;
}

.genbtn{
  margin-left: 50px;
  margin-right: 20px;
}

#prompt{
  width: 300px;
  margin-left: 100px;
  margin-right: 10px;
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

.downbtn {
  position: absolute;
  top: 10px;
  right: 130px;
}
.allchek{
  position: absolute;
  top: 15px;
  right: 280px;
}
.deletebtn{
  position: absolute;
  top: 10px;
  right: 30px;
}

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
