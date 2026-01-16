// module.exports={...}  1개의 요소, 여러개의 요소 export는 exports.~~ = {...}, exports.-- = {...}
// On refactoring!

var url = require('url');
var qs = require('querystring');
var db = require('./db.js'); // 여기서 db 연결 후 접속까지 완료됨
var template = require('./template.js');
// module

var _url = request.url;
var queryData = url.parse(_url, true).query;
// 공통 변수

exports.home = function(request, response) { // req, res를 매개변수로 넣은 이유는 ?? 서버가 만든 요청·응답 객체를 이 함수에 “주입”하기 위해서
  db.query('SELECT * FROM topic', function(error, topics){ // sql의 결과가 topics에 담김. template.HTML의 매개변수에 들어가야하므로 모든 페이지 반드시 필요    
    if(error) {
        throw error;
    }
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(topics); // 콘솔에서 보면 topics(authors도)가 배열로 반환되므로, template.js에서 배열의 요소를 지정하도록 수정함(url은 id column, 제목은 title column에 대응)
    //Node.js의 mysql 모듈에서는 쿼리 결과를 항상 ‘배열(Array)’로 반환합니다.
    //SQL 자체는 테이블(행들의 집합)을 반환하지만, Node.js는 그것을 JavaScript에서 다루기 쉬운 형태 — 즉 배열의 객체 리스트로 변환해서 줍니다.
    //ex. [ 배열1
    //    { id: 1, title: 'Node.js', name: 'Egoing', description: 'Server tutorial' }, 객체1
    //    { id: 2, title: 'MySQL', name: 'K8805', description: 'DB tutorial' } 객체2
    //    ]  
    var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`,
    `<a href="/create">create</a>`);
    
    response.writeHead(200);
    response.end(html); // 웹에는 이거 뜸
  });
};

exports.page = function(request, response) {
  db.query('SELECT * FROM topic', function(error, topics){ // 테이블에서 id 값 = url의 querystring 값
    if(error) {
      throw error;
      }
  db.query(`SELECT * FROM topic LEFT JOIN author on author.id=topic.author_id WHERE topic.id=${queryData.id}`, function(error2, topic){ 
    // id=?`, [queryData.id] 로 쓰면 sql injection 방어 가능. 두번째 인자가 ?에 치환
    // topics 테이블의 여러 row 중 상세보기를 위해서는 1개만 필요 + JOIN으로 저자 보기까지
    if(error2) { // LEFT JOIN으로 저자 보기 기능 추가
      throw error2; // 오류가 있다면 알리고 즉시 중지
      }
    var title = topic[0].title; // 배열로 들고 오는건 동일하나 하나의 요소만 있음(그 하나의 요소가 객체. topics와 달리 WHERE로 하나만 선택했으니까)
    var description = topic[0].description;
    var list = template.list(topics);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}<p>by ${topic[0].name}</p>`, // JOIN 활용으로 by(저자) 추가!  
      ` <a href="/create">create</a>
        <a href="/update?id=${queryData.id}">update</a>
        <form action="delete_process" method="post"> // 삭제는 링크 처리 X, 반드시 폼으로!
          <input type="hidden" name="id" value="${queryData.id}">
          <input type="submit" value="delete">
        </form>`);
    response.writeHead(200);
    response.end(html); 
    });
  });
};

exports.create = function(request, response) {
  db.query('SELECT * FROM topic', function(error, topics){ 
    if(error) {
        throw error;
    }
  db.query('SELECT * FROM author', function(error2, authors){ // 저자 선택 기능 추가
     if(error2) {
         throw error2;
     }
    var title = 'Create'; // title 태그에 create
    var list = template.list(topics);  
    var html = template.HTML(title, list, '', `
      <form action="/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p><textarea name="description" placeholder="description"></textarea></p>
      <p><select name='author'> // 콤보 박스 생성
      // name	: 서버에 전달될 때의 변수 이름(key), value : 사용자가 입력하거나 선택한 실제 값(value). req, res는 객체로 전달!
        ${template.authorSelect(authors)}
         </select>
      </p>
      <p><input type="submit"></p>
      </form>`);       
    response.writeHead(200);
    response.end(html);
    });
  });
};

exports.create_process = function(request, response) {
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body) // post 요청을 받으면 body에 단순 문자열이 들어오니 parse해 객체로 만듦. 이때 name 속성이 key, value 속성이 value로. 그래서 post.으로 접근!(객체 접근 방식, dot notation)
    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?,?, NOW(), ?)`, [post.title, post.description, post.author], function(error, result){ 
      if(error) {
          throw error;
      }
      response.writeHead(302, {Location: `/?id=${result.insertId}`}); // 방금 삽입한 행의 id 값 찾기, sql insert 후 else 상세보기 페이지 이동
      response.end(); 
    });       
  });
};

exports.update = function(request, response) {
  db.query('SELECT * FROM topic', function(error, topics){ 
  if(error) {
      throw error;
  }
  db.query(`SELECT * FROM TOPIC WHERE id=${queryData.id}`, function(error2, topic){ 
      if(error2) {
        throw error2; 
        }  
  db.query('SELECT * FROM author', function(error3, authors){
       if(error3){
           throw error3;
       }
  var list = template.list(topics);  
  var html = template.HTML(topic[0].title, list, '', // title 태그에 현재 수정 중인 글 제목
        `<form action="/update_process" method="post"> // 수정 시에는 원래 제목, 글이 기본값으로 존재해야하므로 value 속성으로 전달
        <input type="hidden" name="id" value="${topic[0].id}"> // title은 사용자가 수정할 수 있는 값이라 그것으로 db의 어떤 행을 수정할지 식별할 수 없으므로 고유 id로 식별해야함(그래서 hidden)
        // value를 queryData.id로 써도 기능상 문제는 없으나, 보안신뢰성 유지보수 가독성에서 아쉬움
        <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
        <p><textarea name="description" placeholder="description">${topic[0].description}</textarea></p> 
        <p>
          <select name='author'> // 콤보 박스 수정. 수정 시에는 원래 저자가 선택 되어 있어야함 -> 현재 저자를 매개변수로 전달
          ${template.authorSelect(authors, topic[0].author_id)}
          </select>
        </p>
        <p><input type="submit"></p>
        </form>`
    );
  response.writeHead(200);
  response.end(html); 
      });
    });
  });
};
  
exports.update_process = function(request, response) {
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.desciption, post.author, post.id], function(error, result){ 
      if(error) {
          throw error ;
      }
      response.writeHead(302, {Location: `/?id=${post.id}`});
      response.end(); 
    });
  });
};
  
exports.delete_process = function(request, response) {
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
  var post = qs.parse(body);
  db.query('DELETE FROM topic WHERE id=?', [post.id], function(error, result){
      if(error){
          throw error;
      }
    response.writeHead(302, {Location: `/`});
    response.end(); 
    });
  });
};
  
