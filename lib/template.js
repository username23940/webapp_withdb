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
      <a href="/author">author</a>
      ${list}  // 아래서 정의
      ${body}
      ${control} // crud
    </body>
    </html>
    `;
  },list:function(topics){ // sql에서 들고온 매개변수
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      // list() 함수에서 <a href="/?id=${topics[i].id}"> 이렇게 id를 쿼리스트링으로 포함시킨 덕분에, 사용자가 그 링크를 클릭했을 때 /?id=숫자 형태로 요청이 들어오고, 우리가 클릭하면 get 요청(query string으로)
      // 서버는 그 queryData.id를 이용해 DB에서 해당 topic을 SELECT해서 추가 작업 수행
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }, authorSelect:function(authors, author_id=0){ // sql에서 들고온 매개변수(create process는 필요 없으므로 기본 매개변수로 지정). topic 관련 페이지에서 저자 선택용 control
    var tag = 0;
    var i = 0;
    while(i < authors.length) {
     var selected=''; // update에서만 사용
     if(author_id === authors[i].id) { // author_id: 현재 수정 중인 글(topic)의 저자 id === authors: DB에서 SELECT * FROM author로 가져온 저자 전체 목록 배열을 순서대로 반복
       selected = " selected"; // 모든 저자 목록(authors)을 <option>으로 만들되, 그 중 topic[0].author_id와 같은 저자를 기본 선택(selected) 상태로 표시하자(수정 시에는 원래 저자가 선택 되어 있어야함) -> 현재 저자를 매개변수로 전달
     }
     tag = tag + `<option value='${authors[i].id}'${selected}>${authors[i].name}</option>`; 
       i++;  
    });
    return tag;
  }, authorTable : function(authors) { // sql에서 들고온 매개변수. 모든 author 관련 페이지의 기본 body
      var tag='<table>';
      var i=0;
      while(i<authors.length) {
        tag+=`<tr> // 각각의 열은 td로 감쌈. table division, 각각의 행은 tr로 감싸기
                <td>${authors[i].name}</td>
                <td>${authors[i].profile}</td>
                <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                <td><form action='/author/delete_process' method='post'>
                      <input type='hidden' name='id' value=${authors[i].id}>
                      <input type='submit' value='delete'>
                    </form>
                </td> 
              </tr>`
        i++;
      }
      tag+='</table>';
    return tag;
  }
}
  

