var http = require('http');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var template = require('./lib/template.js');
var db = require('./lib/db.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    
    if(pathname === '/'){
      if(queryData.id === undefined){
        db.query('SELECT * FROM topic', function(error, topics){ // 콜백함수의 형식(signature). sql의 결과가 topics에 담김. template.HTML의 매개변수에 들어가야하므로 모든 페이지 반드시 필요    
            if(error) {
                throw error;
            }
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = template.list(topics); // 콘솔에서 보면 topics가  배열로 반환되므로, template.js에서 배열의 요소를 지정하도록 수정함(url은 id column, 제목은 title에 대응)
            var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`);
            
            console.log(topics); // nodejs 콘솔에는 sql 서버의 opentutorials db의 topics table이 뜸. 배열에 여러 객체가 요소로 반환됨!!!!!!!!!!!
            response.writeHead(200);
            response.end(html); // 웹에는 이거 뜸
        })
      } else {
          db.query('SELECT * FROM topic', function(error, topics){ // 테이블에서 id 값 = url의 querystring 값
            if(error) {
              throw error;
              }
          db.query(`SELECT * FROM topic LEFT JOIN author on author.id=topic.author_id WHERE topic.id=${queryData.id}`, function(error2, topic){ // id=?`, [queryData.id] 로 쓰면 sql injection 방어 가능. 두번째 인자가 ?에 치환
            if(error2) { // LEFT JOIN으로 저자 보기 기능 추가
              throw error2; // 오류가 있다면 알리고 즉시 중지
              }
            var title = topic[0].title; // topic 들고 올 때 배열로 들고옴(단 하나의 요소가 객체. topics와 달리 WHERE로 하나만 선택했으니까)
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}<p>by ${topic[0].name}</p>`, // JOIN 활용으로 by 추가!  
              ` <a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>`);
            response.writeHead(200);
            response.end(html); 
          });
        });
    } else if(pathname === '/create'){
     db.query('SELECT * FROM topic', function(error, topics){ 
        if(error) {
            throw error;
        }
     db.query('SELECT * FROM author', function(error2, authors){ // 저자 선택 기능 추가
         if(error2) {
             throw error2;
         }
        var title = 'Create';
        var list = template.list(topics);  
        var html = template.HTML(title, list, `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
         <p><select name='author'> // 콤보 박스 생성. name 속성은 서버로 제출되는 값.
          ${template.authorSelect(authors)}
         </select>
         </p>
        <p>
          <input type="submit">
        </p>
      </form>`, ''); // submit 누르면 /create_process로 전달        
        response.writeHead(200);
        response.end(html);
     });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body) // query string parse but post method so invisible
          db.query(`INSERT INTO topic (title, description, created, author_id VALUES(?,?, NOW(), ?)`, [post.title, post.description, post.author], function(error, result){ // authorSelect method에서 select 태그의 name 속성에 해당하는 값 작성(post. ~~) <- 클라에서 넘긴 값을 받을 때 name 속성으로!! 헷갈리기 쉽다!!!
              if(error) {
                  throw error;
              }
              response.writeHead(302, {Location: `/?id=${result.insertId}`}); // 방금 삽입한 행의 id 값 찾기, sql insert 후 else 상세보기 페이지 이동
              response.end(); 
          });       
      });
    } else if(pathname === '/update'){
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
        var title = 'Update';
        var list = template.list(topics);  
        var html = template.HTML(topic[0].title, list,
            `<form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].title}">
              <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
              <p>
                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
              </p> 
             <p><select name='author'> // 콤보 박스 수정. 수정 시에는 원래 저자가 선택 되어 있어야함 -> 현재 저자를 매개변수로 전달
              ${template.authorSelect(authors, topic[0].author_id)}
             </select>
             </p>
              <p>
                <input type="submit">
              </p>
            </form>`,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );
        response.writeHead(200);
        response.end(html); 
        });
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.desciption, post.author, post.id], function(error, result){ // post.id는 parse할때 querystring
            if(error) {
                throw error ;
            }
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end(); 
          });
      });
    } else if(pathname === '/delete_process'){
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
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
