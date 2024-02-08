from fastapi import FastAPI
from typing import List
from pydantic import BaseModel

# 예시를 위한 임시 데이터
fake_items = [{"name": "item1"}, {"name": "item2"}]

app = FastAPI()

class Item(BaseModel):
    name: str

@app.get("/items/", response_model=List[Item])
async def read_items():
    return fake_items
