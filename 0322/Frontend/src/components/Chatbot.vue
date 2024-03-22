<template>
  <div class="chatbox-container" >
    <div class="container" ref="chatbox">
      <h1>단감 사주 Chat Bot</h1>
      <div class="messageBox mt-8">
        <div v-for="(message, index) in messages" :key="index">
          <div :class="message.from == 'user' ? 'messageFromUser' : 'messageFromChatGpt'">
            <div :class="message.from == 'user' ? 'userMessageWrapper' : 'chatGptMessageWrapper'">
              <div v-if="message.from == 'user'" style="display: flex; justify-content: flex-end;">
                <img src="@/assets/user_default.jpg" alt="User Image" style="max-width: 60px; max-height: 60px;">
              </div>
              <img v-else src="@/assets/llogo.png" alt="Chatbot Image" style="max-width:100px; max-height: 100px;">
              <div :class="message.from == 'user' ? 'userMessageContent' : 'chatGptMessageContent'">{{ message.data }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="container1">
        <div class="inputContainer">
          <textarea
            v-model="currentMessage"
            type="text"
            class="messageInput"
            placeholder="궁금한 것을 물어보세요"
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage" class="askButton">보내기</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'ChatBox',
  data() {
    return {
      currentMessage: '',
      messages: [],
      chatboxElement: null
    };
  },
  mounted() {
    this.chatboxElement = this.$refs.chatbox;
  },
  methods: {
    async sendMessage() {
  const message = this.currentMessage;
  this.messages.push({
    from: 'user',
    data: message,
  });

  const requestBody = {
    user_message: message,
    session_id: "string"
  };

  try {
    const response = await axios.post('http://127.0.0.1:8000/chat', requestBody);
    const responseData = response.data;

    if (responseData.answer) {
      this.messages.push({
        from: 'chatGpt',
        data: responseData.answer
      });
    } else {
      console.error('No answer received from the server');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }

  // 새 메시지를 추가한 후에 스크롤을 아래로 이동합니다.
  this.$nextTick(() => {
    const container = this.$refs.chatbox;
    container.scrollTop = container.scrollHeight;
  });

  this.currentMessage = ''; // 입력란을 초기화합니다.
}

  }
};
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

.chatbox-container {
position: fixed;
bottom: 0;
left: 0;
width: 100%;
height: 80%;
/* z-index: -10; */
display: flex;
justify-content: center;
align-items: center;
padding-bottom: 0;
}

.container {
width: 100%; /* 화면에 따라 조정 가능 */
height: 100%;
background-color: white;
border-radius: 8px;
box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
display: flex;
flex-direction: column;
overflow: hidden;
font-family: 'Roboto', sans-serif;
margin-top: 50px;
bottom: 0;
}

h1 {
font-size: 24px;
font-weight: 500;
text-align: center;
color: #222;
padding: 16px;
margin: 0;
/* background-color: #f7f7f7; */
border-bottom: 1px solid #ecb461;
}

.messageBox {
padding: 16px;
flex-grow: 1;
overflow-y: auto;
display: flex;
flex-direction: column;
gap: 12px;
}

.messageFromUser {
  align-self: flex-end;
}

.container1 {
margin-top: 16px; /* Adjust the margin-top here */
}

.userMessageWrapper,
.chatGptMessageWrapper {
display: flex;
flex-direction: column;
}

.userMessageWrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* userMessageContent를 아래로 정렬합니다. */
}

.chatGptMessageWrapper {
align-self: flex-start !important;
}

.userMessageContent,  
.chatGptMessageContent {
max-width: 60%;
padding: 8px 12px;
border-radius: 18px;
margin-bottom: 2px;
font-size: 14px;
line-height: 1.4;
}

.userMessageContent {  /* 사용자 메시지 답변 말풍선 스타일 */
background-color: #EB4C10;
color: white;
border-top-right-radius: 0;
align-self: flex-end; /* userMessageContent를 오른쪽으로 정렬합니다. */
}

.chatGptMessageContent {  /* 챗봇 답변 말풍선 스타일 */
background-color: #EDEDED;
color: #222;
border-top-left-radius: 0;
}

.userMessageTimestamp,
.chatGptMessageTimestamp {
font-size: 10px;
color: #999;
margin-top: 2px;
}

.userMessageTimestamp {
align-self: flex-end;
}

.chatGptMessageTimestamp {
align-self: flex-start;
}

.inputContainer {
display: flex;
align-items: center;
padding: 8px;
/* background-color: #f0f0f0; */
bottom: 0px;
}

.messageInput {
flex-grow: 1;
border: none;
outline: none;
padding: 12px;
font-size: 16px;
background-color: white;
border-radius: 24px;
margin-right: 8px;
border: 1px solid #e7e7e7; /* 테두리 두께와 스타일 지정 */
border-color: #ecb461; /* 테두리 색상 지정 */
/* height: auto !important;
resize: none;
overflow-y: hidden; */
}

.askButton {
background-color: #ecb461;
color: black;
font-size: 16px;
padding: 8px 16px;
border: none;
outline: none;
cursor: pointer;
border-radius: 24px;
transition: background-color 0.3s ease-in-out;
}

.askButton:hover {
background-color: #145CB3;
}

@media (max-width: 480px) {
.container {
  width: 100%;
  max-width: none;
  border-radius: 0;
}
}

.chatbox-container {
position: fixed;
bottom: 24px;
right: 24px;
z-index: 1000;
}

</style>