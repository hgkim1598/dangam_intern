<template>
    <div>
      <b-form @submit.prevent="submitForm" no-ok no-cancel>
        <p><h6>프롬프트는 문장과 파일 중 하나만 입력해주세요.<br>프롬프트가 복수일 경우 txt 파일로 만들어 업로드하면 됩니다.</h6></p>
        <!-- 문장 입력 -->
        <b-form-group class="mb-4">
          <label style="font-weight: bold;">프롬프트 - 문장</label>
          <div class="row">
            <div class="col">
              <b-form-input id="prompt" v-model="prompt" placeholder="프롬프트 문장을 입력하세요"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <!-- 파일 선택 -->
        <b-form-group class="mb-4">
          <label style="font-weight: bold;">프롬프트 - 파일</label>
          <div class="row">
            <div class="col">
              <b-form-file id="file" v-model="text_file" :state="Boolean(file)" accept=".txt" plain></b-form-file>
            </div>
          </div>
        </b-form-group>
        <!-- 카테고리 선택 -->
        <b-form-group class="mb-4">
          <label style="font-weight: bold;">카테고리</label>
          <div class="row">
            <div class="col">
              <b-dropdown v-model="selectedCategory" :text="selectedCategory ? selectedCategory : '카테고리 선택'" variant="outline-primary" :class="{'invalid-dropdown': !selectedCategory}">
                <b-dropdown-menu class="custom-dropdown-menu">
                  <div style="max-height: 300px; overflow-y: auto;">
                    <b-form-radio v-for="(cat, index) in categories" :key="index" :value="cat" @input="selectedCategory = cat" name="category">{{ cat }}</b-form-radio>
                  </div>
                </b-dropdown-menu>
              </b-dropdown>
            </div>
          </div>
        </b-form-group>
        <!--개수 선택-->
        <b-form-group class="mb-4">
          <label style="font-weight: bold;">생성할 이미지 개수 *</label>
          <div class="row">
            <div class="col">
              <b-form-input id="quantity" v-model="quantity" maxlength="4" placeholder="개수"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-button type="submit" variant="primary" class="ml-3" :disabled="(!prompt || !text_file) && !quantity">생성</b-button>
      </b-form>
    </div>
  </template>
  

<script>
import axios from 'axios';

export default {
  data() {
    return {
        prompt: '',
        text_file: '', // 선택된 파일을 저장할 변수
        selectedCategory: null,
        quantity: null,
        categories: [],
    }
},
created() {
    this.fetchCategories();
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
}

}
</script>

<style scoped>
h6 {
  color: #999;
}
</style>
