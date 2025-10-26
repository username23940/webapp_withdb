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
  }, authorSelect:function(authors, author_id){
    var tag = 0;
    var i = 0;
    while(i < authors.length) {
     var selected='';
     if(author_id === author[i].id) { // 현재 id, loop문 안의 현재 순번의 id
       selected = " selected"; // html은 option 태그의 속성으로 selected가 있으면, 그것을 기본값으로 인식하므로, 수정 시에 현재 저자를 나타내기 위함
     }
     tag = tag + `<option value='${authors[i].id}'${selected}>${authors[i].name}</option>`; // value 속성은 서버로 제출되는 값
       i++;  
    });
  }
  return tag;
}
