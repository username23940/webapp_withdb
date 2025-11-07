// 이 파일은 실제로 db와 연결하는게 아니라 예시를 보여줌. 아래의 query method가 author.js, topic.js에서 실제로 쓰이는 방식!

var mysql = require('mysql');
var connection = mysql.createConnection({ // mysql 모듈의 객체에 소속된 메서드 호출. 인자로 객체 제시. property로 host, user, .... 제공 = cmd에서 mysql 폴더에 들어가서 -uroot -p
  host     : 'localhost',
  user     : 'root',
  password : '1111',
  database : 'opentutorials'
});
 
connection.connect(); // 만들어지는 결과 connection 변수에 담김. 이 변수에 담긴 객체에 connect 호출하면 접속 될 것임
 
connection.query('SELECT * FROM topic', function (error, results, fields) { // query 메서드에서 SQL문을 첫번째 인자, 두번째로 콜백. sql문이 서버로 전송되고 응답
  // js로 쿼리문을 다이나믹하게 사용한다면 데이터를 자동화해 들고올 수 있음
  if (error) throw error; // 콜백함수의 첫번째 인자는 오류, 두번째 인자는 sql 결과(테이블), 세번째 인자는 쿼리 결과를 동적으로 처리할 때 (예: CSV/Excel 변환), 
  // 컬럼 이름이나 타입을 기준으로 결과를 가공할 때, ORM 없이 직접 쿼리 결과 메타데이터를 분석해야 할 때 쓰는 각 열에 대한 메타데이터
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();
