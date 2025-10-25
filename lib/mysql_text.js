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
  if (error) throw error; // 콜백함수의 첫번째 인자는 오류, 접속결과는 두번째 인자, 세번째 인자는 
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();
