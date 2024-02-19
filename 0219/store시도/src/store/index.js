import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    totalPage: 0,
    pageNumber: 1,
    searchKeyword: '',
    items: [],
    categories: [],
    selectedCategories: [],
    prevSelectedCategories: [],
    isEditMode: false, // 추가: 수정 모드 여부를 나타내는 상태 변수
    editId: null, // 추가: 수정할 아이템의 ID를 저장하는 상태 변수
    modalVisible: false, // 추가: 모달의 표시 여부를 나타내는 상태 변수
  },
  mutations: {
    SET_TOTAL_PAGE(state, totalPage) {
      state.totalPage = totalPage;
    },
    SET_PAGE_NUMBER(state, pageNumber) {
      state.pageNumber = pageNumber;
    },
    SET_SEARCH_KEYWORD(state, searchKeyword) {
      state.searchKeyword = searchKeyword;
    },
    SET_ITEMS(state, items) {
      state.items = items;
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    SET_SELECTED_CATEGORIES(state, selectedCategories) {
      state.selectedCategories = selectedCategories;
    },
    SET_PREV_SELECTED_CATEGORIES(state, prevSelectedCategories) {
      state.prevSelectedCategories = prevSelectedCategories;
    },
    SHOW_MODAL(state) {
      state.modalVisible = true;
    },
    CLOSE_MODAL(state) {
      state.modalVisible = false;
    },
    EDIT_ITEM(state, item) {
      state.isEditMode = true;
      state.editId = item.id; // 수정할 아이템의 ID 저장
      state.modalVisible = true; // 모달 표시
    },
    DELETE_ITEM(state, item) {
      // 아이템 삭제 처리
    },
    TOGGLE_DETAILS(state, item) {
      // 아이템의 세부 정보 토글 처리
    },
    CLOSE_DROPDOWN(state) {
      // 드롭다운 닫기 처리
    },
  },
  actions: {
    async fetchData({ commit, state }, page) {
      try {
        page = page || state.pageNumber;
        let apiUrl = 'http://192.168.0.149:8000/fourchar';
        const apiUrl1 = apiUrl += `?p=${page}`;
        const response = await axios.get(apiUrl1);
        commit('SET_TOTAL_PAGE', response.data.total_page);
        commit('SET_ITEMS', response.data.content);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      }
    },
    async fetchCategories({ commit }) {
      try {
        const apiUrl = 'http://192.168.0.149:8000/category/?select_category=fourchar';
        const response = await axios.get(apiUrl);
        commit('SET_CATEGORIES', response.data);
      } catch (error) {
        console.error('카테고리를 불러오는 중 오류 발생:', error);
      }
    },
    async submitSelectedCategories({ commit, state }) {
      const categoriesParams = state.selectedCategories.map(category => `categories=${encodeURIComponent(category)}`).join('&');

      axios.get(`http://192.168.0.149:8000/fourchar/filter/?${categoriesParams}`)
        .then(response => {
          commit('SET_ITEMS', response.data.content);
        })
        .catch(error => {
          console.error('GET 요청 중 오류가 발생했습니다.', error);
        });
    },
    changePage({ commit, dispatch }, page) {
      commit('SET_PAGE_NUMBER', page);
      dispatch('fetchData', page);
    },
    search({ commit, dispatch }, keyword) {
      commit('SET_SEARCH_KEYWORD', keyword.trim());
      dispatch('fetchData');
    },
  },
});