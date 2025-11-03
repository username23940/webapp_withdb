var http = require('http');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var template = require('./lib/template.js');
var db = require('./lib/db.js'); // 확장자 생략 가능
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');


var app = http.createServer(function(request,response){ // 요청이 들어오면 req, res 객체를 생성해서 이 콜백에 전달. req는 요청 내용(주소, 헤더, 바디 등)을 담고 있고, res는 응답을 돌려주는 데 필요한 메서드(writeHead, end, 등)를 가짐.
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    
    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.home(request, response);
      } else {
        topic.page(request, response);
      } 
    }
    else if(pathname === '/create'){
        topic.create(request, response);
      } 
    else if(pathname === '/create_process'){
        topic.create_process(request, response);
      } 
    else if(pathname === '/update'){
        topic.update(request, response);
      } 
    else if(pathname === '/update_process'){
       topic.update_process(request, response);
      } 
    else if(pathname === '/delete_process'){
      topic.delete_process(request, response);
      } 
    else if(pathname === '/author'){
      author.home(request, response);
      }
    else if(pathname === '/author/create_process'){
      author.create_process(request, response);
      }
    else if(pathname === '/author/update_process'){
      author.update_process(request, response);
      }
    else if(pathname === '/author/delete_process'){
      author.delete_process(request, response);
      }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
}
app.listen(3000);
