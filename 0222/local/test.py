# # 오픈 AI에서 제공하는 ChatGPT API를 파이썬으로 사용할 수 있게 해주는 라이브러리
# pip install openai
# # 카카오 디벨로퍼스에서 제공하는 다양한 API를 파이썬으로 사용할 수 있도록 해주는 라이브러리
# pip install PyKakao

# import openai

# 발급 받은 API 키 설정
def get_api_info():
    with open('key.txt', 'r') as file:
        lines = file.readlines()
        api_info = {}
        for line in lines:
            key, value = line.strip().split('=')
            api_info[key] = value
    return api_info
api_info = get_api_info()
OPENAI_API_KEY = api_info['OPENAI_API_KEY']
# username = api_info['username']
# password = api_info['password']

# openai API 키 인증
openai.api_key = OPENAI_API_KEY

import os
from openai import OpenAI

client = OpenAI(
    # This is the default and can be omitted
    api_key=OPENAI_API_KEY,
    # 이것은 기본값이며 생략할 수 있습니다.
    organization=None,
)
# 질문 작성
query = '텍스트를 입력 받아 이미지를 생성하는 방법을 알려주세요'
chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": query
        }
    ],
    model="gpt-3.5-turbo",
)

answer = chat_completion.choices[0].message['content']
print(answer)