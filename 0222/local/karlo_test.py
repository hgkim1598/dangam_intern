# REST API 호출, 이미지 파일 처리에 필요한 라이브러리
import requests
import json
import io
import base64
from PIL import Image

def get_api_info():
    with open('key.txt', 'r') as file:
        lines = file.readlines()
        api_info = {}
        for line in lines:
            key, value = line.strip().split('=')
            api_info[key] = value
    return api_info
api_info = get_api_info()
KAKAO_API_KEY = api_info['KAKAO_REST_API_KEY']

# [내 애플리케이션] > [앱 키] 에서 확인한 REST API 키 값 입력
REST_API_KEY = KAKAO_API_KEY

# 이미지 생성하기 요청
def t2i(text, batch_size=1):
    r = requests.post(
        'https://api.kakaobrain.com/v1/inference/karlo/t2i',
        json = {
            'prompt': {
                'text': text,
                'batch_size': batch_size
            }
        },
        headers = {
            'Authorization': f'KakaoAK {REST_API_KEY}',
            'Content-Type': 'application/json'
        }
    )
    # 응답 JSON 형식으로 변환
    response = json.loads(r.content)
    return response

# Base64 디코딩 및 변환
def stringToImage(base64_string, mode='RGBA'):
    imgdata = base64.b64decode(str(base64_string))
    img = Image.open(io.BytesIO(imgdata)).convert(mode)
    return img

# 프롬프트에 사용할 제시어
text = "make a image of A farmer harvesting ripe fruits in the well-ripened field "

# 이미지 생성하기 REST API 호출
response = t2i(text, 1)

# print(response)

# 응답의 첫 번째 이미지 생성 결과 출력하기
result = stringToImage(response.get("images")[0].get("image"), mode='RGB')
result.show()