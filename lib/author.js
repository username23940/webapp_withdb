var db = require('./db.js');
var template = require('./template.js');
var url = require('url');
var path = require('path');
var qs = require('querystring');
// module

var _url = request.url;
var queryData = url.parse(_url, true).query;
// 공통 변수


exports.home = function(request, response) {
  db.query('SELECT * FROM topic', function(error, topics){ // 콜백함수의 형식(signature). sql의 결과가 topics에 담김. template.HTML의 매개변수에 들어가야하므로 모든 페이지 반드시 필요    
    if(error) {
        throw error;
    }
    db.query('SELECT * FROM author', function(error2, authors){     
      if(error2) {
          throw error2;
      }
      var title = 'author';
      var list = template.list(topics); // 콘솔에서 보면 topics가  배열로 반환되므로, template.js에서 배열의 요소를 지정하도록 수정함(url은 id column, 제목은 title에 대응)
      var html = template.HTML(title, list,
      `
      ${template.authorsTable(authors)}
      <style>
        table {
          border-collapse : collapse
        }
        td {
          border : 3px solid black
        }
      </style>
      `                  
      <form action="/author/create_process" method="post">
      <p><input type="text" name="name" placeholder="name"></p>
      <p>
        <textarea name="profile" placeholder="profile"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
      </form>, 
      ``); // title, description 수정 -> 저자 목록으로
      
      response.writeHead(200);
      response.end(html); // 웹에는 이거 뜸
    });
  });
}
exports.create_process = function(request, response) {
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body) // query string parse but post method so invisible
    db.query(`INSERT INTO author (name, profile) VALUES(?,?)`, [post.name, post.profile], function(error, result){ // authorSelect method에서 select 태그의 name 속성에 해당하는 값 작성(post. ~~) <- 클라에서 넘긴 값을 받을 때 name 속성으로!! 헷갈리기 쉽다!!!
      if(error) {
          throw error;
      }
      response.writeHead(302, {Location: `/author`}); 
      response.end(); 
    });       
  });
}
exports.update = function(request, response) {
  db.query('SELECT * FROM topic', function(error, topics){
    if(error) {
        throw error;
    }
    db.query('SELECT * FROM author', function(error2, authors){     
      if(error2) {
          throw error2;
      }
      db.query(`SELECT * FROM author WHERE id=?`,[queryData.id] function(error3, author){ 
        if(error3){
          throw error3;
        }
      var title = 'author';
      var list = template.list(topics); // 콘솔에서 보면 topics가  배열로 반환되므로, template.js에서 배열의 요소를 지정하도록 수정함(url은 id column, 제목은 title에 대응)
      var html = template.HTML(title, list,
      `
      ${template.authorsTable(authors)}
      <style>
        table {
          border-collapse : collapse
        }
        td {
          border : 3px solid black
        }
      </style>
      `                  
      <form action="/author/update_process" method="post">
      <input type="hidden" name="id" value="${queryData.id}"> // update할 땐 고유한 id 값 필요
      <p><input type="text" name="name" placeholder="name" value="${author[0].name}></p>
      <p>
        <textarea name="profile" placeholder="profile" value="${author[0].profile}></textarea>
      </p>
      <p>
        <input type="submit" value='update'>
      </p>
      </form>, 
      ``); // title, description 수정 -> 저자 목록으로
      
      response.writeHead(200);
      response.end(html); // 웹에는 이거 뜸
    });
  });
}

exports.update_process = function(request, response) {
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    db.query('UPDATE author SET name=?, profile=? WHERE id=?', [post.name, post.profile, post.id], function(error, result){ // post.id는 parse할때 querystring
      if(error) {
          throw error ;
      }
      response.writeHead(302, {Location: `/author`});
      response.end(); 
    });
  });
}
  
exports.delete_process = function(request, response) {
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
  var post = qs.parse(body);
  db.query("DELETE FROM topic where author_id=?", [post.id], function(error2, result2) { // 저자가 지워지면 그 저자가 작성한 글도 지워지게
    if(error2){
      throw error2;
    }
    db.query('DELETE FROM author WHERE id=?', [post.id], function(error, result){ // where가 빠지면 모든 데이터가 날라가는 참사...
      if(error){
          throw error;
      }
      response.writeHead(302, {Location: `/`}); 
      response.end(); 
    });
   }
  });
}
  
