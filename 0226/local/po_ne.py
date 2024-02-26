# 주석에 ★ 표시해둔 곳만 상황에 맞게 입력해주면 됨


# 터미널에서 pip install openai 로 설치 필요
import openai

# 발급받은 API 키 설정
OPENAI_API_KEY = ""  # ★ OpenAI API 에서 발급 받은 key값 입력

# openai API 키 인증
openai.api_key = OPENAI_API_KEY

import pandas as pd
import os
from openai import OpenAI
import requests

# OpenAI API 키 설정
OPENAI_API_KEY = OPENAI_API_KEY 
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# OpenAI 클라이언트 생성
client = OpenAI(api_key=OPENAI_API_KEY)

# Excel 파일 경로 설정
excel_file_path = ''  # ★ '크롤링_final.xlsx' 파일 위치 입력 (위치/파일이름.확장자 형식에 맞춰)

# Excel 파일 읽기
df = pd.read_excel(excel_file_path)

# 주어진 사자성어를 ChatGPT에게 긍정적인 해석과 부정적인 해석을 물어보는 함수
def ask_gpt_for_proverb(proverb, meaning):
    # ChatGPT를 사용한 텍스트 분류 요청 (긍정적 해석)
    positive_response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": f"사자성어 '{proverb}'의 뜻은 '{meaning}'입니다. 이것을 긍정적인 관점에서 해석하고 위로의 말을 만들어주세요."}],
    )
    # ChatGPT를 사용한 텍스트 분류 요청 (부정적 해석)
    negative_response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": f"사자성어 '{proverb}'의 뜻은 '{meaning}'입니다. 이것을 부정적인 관점에서 해석하고 경고의 말을 만들어주세요."}],
    )

    # 응답에서 긍정적, 부정적 해석 추출
    positive_interpretation = positive_response.choices[0].message.content
    negative_interpretation = negative_response.choices[0].message.content

    return positive_interpretation, negative_interpretation

# 주요 프로세스
def main():
    positive_sentiments = []
    negative_sentiments = []

    # 모든 사자성어에 대해 ChatGPT에게 긍정적인 해석과 부정적인 해석을 물어봄
    for index, row in df.iterrows():
        proverb = row['contents_kr']
        meaning = row['contents_detail']
        positive_sentiment, negative_sentiment = ask_gpt_for_proverb(proverb, meaning)
        positive_sentiments.append(positive_sentiment)
        negative_sentiments.append(negative_sentiment)

    # 새로운 DataFrame 생성
    new_df = pd.DataFrame({
        'contents_kr': df['contents_kr'],
        # 'contents_zh': df['contents_zh'],  # 필요할 경우 주석을 해제하여 새로운 파일에 한문도 들어가게 할 수 있음
        'positive_sentiment': positive_sentiments,
        'negative_sentiment': negative_sentiments
    })

    # 새로운 Excel 파일로 저장
    new_excel_file_path = ''   # ★ 저장되길 원하는 위치/파일이름.확장자 형식에 맞춰 입력
    new_df.to_excel(new_excel_file_path, index=False)

if __name__ == "__main__":
    main()
