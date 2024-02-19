<template>
  <div>
    <!-- 검색어 입력 상자 -->
    <div>
      <input type="text" v-model="searchKeyword">
      <!-- 검색 버튼 -->
      <b-button @click="search">
        <!-- 돋보기 아이콘 -->
        <b-icon icon="search"></b-icon>
      </b-button>
    </div>
    
    <div class="table-container">
      <b-button @click="showModal" class="nr_button">신규 등록</b-button>
      <b-dropdown v-if="categories.length > 0" ref="categoryDropdown" class="category-dropdown" variant="primary">
        <template #button-content>
          카테고리 선택
        </template>
        <b-form-group  class="category-dropdown-list">
          <b-form-checkbox-group v-model="selectedCategories">
            <b-form-checkbox v-for="(cat, index) in categories" :key="index" :value="cat">{{ cat }}</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-button @click="closeDropdown">취소</b-button>
        <b-button @click="submitSelectedCategories" variant="success">확인</b-button>
      </b-dropdown>
      <b-modal v-model="modalVisible" :title="modalTitle" hide-footer>
        <!-- Create.vue 컴포넌트 렌더링 -->
        <Create :isEditMode="isEditMode" :editId="editId" @closeModal="closeModal" />
      </b-modal>
      <b-table striped hover :items="items" :fields="fields">
        <template #cell(actions)="row">
          <!-- 제어 버튼 -->
          <div class="btn-group" role="group">
            <b-button size="sm" @click="toggleDetails(row.item)" class="control-button">
              {{ row.item.detailsShowing ? '숨김' : '펼침' }}
            </b-button>
            <b-button size="sm" variant="warning" @click="editItem(row.item)" class="control-button">수정</b-button>
            <b-button size="sm" variant="danger" @click="deleteItem(row.item)" class="control-button last-button">삭제</b-button>
          </div>
        </template>

        <!-- 커스텀 컬럼 정의 -->
        <template #cell(contents_detail)="data">
          <div>
            <b-card v-if="data.item.detailsShowing">
              <p>{{ data.item.contents_detail }}</p>
            </b-card>
            <span v-else>{{ truncateText(data.item.contents_detail, 50) }}</span>
          </div>
        </template>

        <!-- 확장된 세부 정보 -->
        <template #row-details="row">
          <b-card v-if="row.item.detailsShowing">
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
            </ul>
          </b-card>
        </template>
      </b-table>
    </div>
    <div>
      <!-- 페이지 번호 표시 및 변경 -->
      <div class="d-flex justify-content-end">
        <div>
          <b-button @click="changePage(pageNumber - 1)" :disabled="pageNumber <= 1">이전 페이지</b-button>
          <span>{{ pageNumber }} / {{ totalPage }}</span>
          <b-button @click="changePage(pageNumber + 1)" :disabled="pageNumber >= totalPage">다음 페이지</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Create from './Create.vue';

export default {
  components: {
    Create
  },
  computed: {
    totalPage() {
      return this.$store.state.totalPage;
    },
    pageNumber() {
      return this.$store.state.pageNumber;
    },
    searchKeyword() {
      return this.$store.state.searchKeyword;
    },
    items() {
      return this.$store.state.items;
    },
    categories() {
      return this.$store.state.categories;
    },
    selectedCategories() {
      return this.$store.state.selectedCategories;
    },
    modalTitle() {
      return this.$store.state.isEditMode ? '수정' : '신규 등록';
    }
  },
  methods: {
    fetchData(page) {
      this.$store.dispatch('fetchData', page);
    },
    fetchCategories() {
      this.$store.dispatch('fetchCategories');
    },
    submitSelectedCategories() {
      this.$store.dispatch('submitSelectedCategories');
    },
    changePage(page) {
      this.$store.dispatch('changePage', page);
    },
    search() {
      this.$store.dispatch('search', this.searchKeyword);
    },
    showModal() {
      this.$store.commit('showModal');
    },
    closeModal() {
      this.$store.commit('closeModal');
    },
    editItem(item) {
      this.$store.commit('editItem', item);
    },
    deleteItem(item) {
      this.$store.commit('deleteItem', item);
    },
    toggleDetails(item) {
      this.$store.commit('toggleDetails', item);
    },
    closeDropdown() {
      this.$store.commit('closeDropdown');
    },
    truncateText(text, maxLength) {
      if (text.length <= maxLength) {
        return text;
      } else {
        return text.substring(0, maxLength) + '...';
      }
    },
  }
};
</script>

<style scoped>
.table-container {
  margin-top: 60px;
  position: relative;
}
.control-button {
  margin-right: 5px;
}
.last-button {
  margin-right: 0;
}
.nr_button {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: -40px;
  margin-right: 60px;
}
.category-dropdown {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: -40px;
  margin-left: 10px;
}
.category-checkbox {
  margin-right: 10px;
}
.category-dropdown-list {
  max-height: 200px;
  overflow-y: auto;
}
</style>