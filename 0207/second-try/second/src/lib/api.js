// 예시로 GET 요청을 보내는 경우
fastapi('get', 'api', null, 
  // 성공 콜백 함수
  function(response) {
    // 응답 데이터를 콘솔에 출력하거나 다른 처리를 수행할 수 있습니다.
    console.log(response);
  }, 
  // 실패 콜백 함수
  function(error) {
    // 오류 메시지를 콘솔에 출력하거나 다른 처리를 수행할 수 있습니다.
    console.error(error);
  }
);
