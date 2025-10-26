var mysql = require('mysql');

var db = mysql.createConnection({ // sql 서버와 연결 생성, 계속 조작해야하므로 객체를 변수에 대입
    host:'localhost',
    user:'root',
    password:'1111',
    database:'opentutorials'
});

db.connect(); // db 실제 접속

module.exports = db // 외부에서 쓸 수 있도록 export(꺼낼 요소가 1개일 때)

// 파일 안에 db 정보(id pw같은 기밀 정보)를 저장하면 매우 심각한 보안문제 -> 복사본 만들고 접속 관련 정보 삭제. 
// 버전 관리에는 복사본을 사용, 이 파일은 git ignore. 실제 개발 환경 세팅 시 복사본을 다시 복사한 후 비밀번호를 입력해 .env로 만들고 사용(repo에 commit은 X)
