const request = require('request')
// https://m.blog.naver.com/rego/RecommendationPostList.nhn?directorySeq=5&currentPage=1

request('https://m.blog.naver.com/rego/RecommendationPostList.nhn?directorySeq=5&currentPage=1', {
  headers: {}
})
.then(r => console.log(r))
.catch(error => console.log(error));