var db = require('./db.js');
var template = require('./template.js');
// module

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

exports.update = function(request, response) { ######## 251103 수정!!
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
        `<form action="/author/update_process" method="post">
        <input type="hidden" name="id" value="${topic[0].title}">
        <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
        <p>
          <textarea name="description" placeholder="description">${topic[0].description}</textarea>
        </p> 
        <p>
          <select name='author'> // 콤보 박스 수정. 수정 시에는 원래 저자가 선택 되어 있어야함 -> 현재 저자를 매개변수로 전달
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
    db.query('UPDATE authors SET name=?, profile=? WHERE id=?', [post.name, post.profile], function(error, result){ // post.id는 parse할때 querystring
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
  db.query('DELETE FROM authors WHERE id=?', [post.id], function(error, result){
      if(error){
          throw error;
      }
    response.writeHead(302, {Location: `/`});
    response.end(); 
    });
  });
}
  
