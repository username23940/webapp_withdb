module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}  
      ${body}
      ${control}
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }, authorSelect:function(authors){
    var tag =0;
    var i=0;
    while(i < authors.length) {
     tag = tag+`<option value='${authors[i].id}'>${authors[i].name}</option>`; // value 속성은 서버로 제출되는 값
       i++;  
    });
  }
}
