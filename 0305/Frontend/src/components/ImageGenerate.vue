<template>
  <div>
    <!-- 검색창을 포함한 상단 영역 -->
    <!-- 추가 개발 필요 -->
    <div class="search-bar">
      <b-form @submit.prevent="submitForm" no-ok no-cancel class="d-flex align-items-center">
        <b-form-input id="prompt" v-model="prompt" required placeholder="프롬프트 문장을 입력하세요"></b-form-input>
        <b-form-file id="file" v-model="file" :state="Boolean(file)" accept=".txt" plain></b-form-file>
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

    <div class="checkbox-container">
      <!-- 전체 선택 체크박스 -->
      <p><b-form-checkbox v-model="selectAll" @change="selectAllImages" class="mr-2">전체 선택</b-form-checkbox></p>
      <!--  -->
    </div>


    <!-- 카드들을 표시하는 부분 -->
    <b-container fluid :g="4" class="mb-4">
      <b-row>
        <b-col v-for="(image, index) in images" :key="index" cols="3">
          <b-card class="custom-card">
            <!-- 체크박스 -->
            <b-form-checkbox v-model="selectedImages" :value="image" class="mr-2"></b-form-checkbox>
            <b-img :src="image.url" fluid thumbnail class="image"></b-img>
            <div class="button-row">
              <b-button-group>
                <b-button variant="primary" size="sm" @click="detailViewClick">상세보기</b-button>
                <b-button variant="success" size="sm" @click="downloadClick">다운로드</b-button>
                <!-- 모달 표시 버튼 -->
                <b-button variant="danger" size="sm" @click="deleteClick">삭제</b-button>
              </b-button-group>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <!-- 페이지네이션 -->
    <div class="d-flex justify-content-between">
      <div>
        <!-- 선택된 이미지 다운로드 버튼 -->
        <b-button @click="downloadSelectedImages" :disabled="selectedImages.length === 0">선택된 이미지 다운로드</b-button>
      </div>
      <div>
        <b-button @click="changePage(pageNumber - 1)" :disabled="pageNumber <= 1">이전 페이지</b-button>
        <span>{{ pageNumber }} / {{ totalPage }}</span>
        <b-button @click="changePage(pageNumber + 1)" :disabled="pageNumber >= totalPage">다음 페이지</b-button>
      </div>
    </div>

    <!-- 모달 컴포넌트 -->
    <b-modal v-model="modalVisible" :title="modalTitle" hide-footer>
      <!-- ImageShow 컴포넌트 렌더링 -->
      <ImageShow :itemId="itemId" @closeModal="closeModal" />
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import ImageShow from './ImageShow';

export default {
  data() {
    return {
      searchQuery: '', // 검색어를 저장하는 데이터
      images: [], // 이미지를 저장할 배열
      pageNumber: 1, // 현재 페이지 번호
      totalPage: 1, // 전체 페이지 수
      file: null, // 선택된 파일을 저장할 변수
      promptOrFile: '', // 사용자가 문장이나 파일 경로 저장
      selectedImages: [], // 선택된 이미지를 추적하는 배열
      modalVisible: false, // 모달 창의 표시 여부
      modalTitle: '', // 모달의 제목
      itemId: null, // 아이템 ID
      selectAll: false, // 전체 선택 체크박스
    };
  },
  created() {
    // 이미지 데이터를 가져오는 API 호출
    this.fetchImages();
  },
  methods: {
    async submitForm() { 
      try {
        const response = await axios.post('엔드포인트URL', {
          prompt_or_file: this.promptOrFile
        });
        this.imageUrl = response.data.image_url;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    fetchImages() {
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
        { url: 'image4.jpg' },
        { url: 'image5.jpg' },
        { url: 'image6.jpg' },
        { url: 'image7.jpg' },
        { url: 'image8.jpg' },
        { url: 'image9.jpg' },
        { url: 'image10.jpg' },
        { url: 'image11.jpg' },
        { url: 'image12.jpg' },
      ];
      this.totalPage = 3; // 임시로 설정 (백엔드 연동시 삭제)
    },
    detailViewClick() {
      // 상세정보 버튼 클릭 시 실행되는 함수
      // 모달창이 열리고 DB의 전체 내용을 읽어온다
      try {
        this.modalVisible = true;
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
        this.selectedImages = this.images;
      } else {
        this.selectedImages = [];
      }
    }
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

.search-bar {
  margin-bottom: 30px;
  margin-top: 30px;
}

.image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

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

.checkbox-container {
  margin-bottom: 30px;
  position: relative;
}

.checkbox-container .b-form-checkbox {
  position: absolute;
  top: 10px; /* 원하는 위치로 조정 */
  left: 10px; /* 원하는 위치로 조정 */
}
</style>
