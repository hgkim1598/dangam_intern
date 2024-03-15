<template>
    <div class="chatbox-container">
      <div class="container">
        <h1>단감 사주 Chat Bot</h1>
        <div class="messageBox mt-8">
          <div v-for="(message, index) in messages" :key="index">
            <div :class="message.from == 'user' ? 'messageFromUser' : 'messageFromChatGpt'">
              <div :class="message.from == 'user' ? 'userMessageWrapper' : 'chatGptMessageWrapper'">
                <div :class="message.from == 'user' ? 'userMessageContent' : 'chatGptMessageContent'">{{ message.data }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="container1">
          <div class="inputContainer">
            <input
              v-model="currentMessage"
              type="text"
              class="messageInput"
              placeholder="궁금한 것을 물어보세요"
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
      };
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
          session_id: "string" // 세션 ID는 필요에 따라 수정하세요
        };
  
        try {
          const response = await axios.post('', requestBody);
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
  
        this.currentMessage = ''; // 입력란을 초기화합니다.
      },
    },
  };
  </script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

.chatbox-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90%;
  z-index: 1000;
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
}

.container {
  width: 80%; /* 화면에 따라 조정 가능 */
  height: 80%; /* 화면에 따라 조정 가능 */
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
}

h1 {
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  color: #222;
  padding: 16px;
  margin: 0;
  background-color: #f7f7f7;
  border-bottom: 1px solid #e7e7e7;
}

.messageBox {
  padding: 16px;
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.messageFromUser,
.messageFromChatGpt {
  display: flex;
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
  align-self: flex-end;
}

.chatGptMessageWrapper {
  align-self: flex-start;
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

.userMessageContent {
  background-color: #1877F2;
  color: white;
  border-top-left-radius: 0;
}

.chatGptMessageContent {
  background-color: #EDEDED;
  color: #222;
  border-top-right-radius: 0;
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
  background-color: #f0f0f0;
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
}

.askButton {
  background-color: #1877F2;
  color: white;
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