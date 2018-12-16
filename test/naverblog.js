const axios = require('axios');
const fs = require('fs');
const request = require('request');

const directorySeqs = {
  5: '책',
  6: '영화',
  7: '공연/전시',
  8: '미술',
  9: '드라마',
  10: '방송',
  11: '음악',
  12: '연예인',
  13: '만화',
  14: '일상',
  15: '육아/결혼',
  16: '반려동물',
  17: '좋은글',
  18: '패션/미용',
  19: '인테리어',
  20: '요리',
  21: '상품리뷰',
  22: '게임',
  23: '스포츠',
  24: '사진',
  25: '자동차',
  26: '취미',
  27: '국내여행',
  28: '세계여행',
  29: '맛집',
  30: 'IT',
  31: '사회',
  32: '건강',
  33: '경제',
  34: '교육',
  35: '외국어',
  36: '원예',
}

function getRecommendationPostViewList(directorySeq, currentPage) {
  const url = `https://m.blog.naver.com/rego/RecommendationPostList.nhn?directorySeq=${directorySeq || 5}&currentPage=${currentPage || 1}`;
  // console.log(url);
  return axios(url, {
    headers: {
      referer: 'https://m.blog.naver.com/Recommendation.nhn',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
    }
  })
  .then(r => JSON.parse(r.data.replace(")]}',", "")))
  //.then(r => console.log(r));
}

function getBlogContents(blogId, logNo) {
  const url = `https://m.blog.naver.com/PostView.nhn?blogId=${blogId}&logNo=${logNo}`;
  return axios(url, {
    headers: {
      referer: 'https://m.blog.naver.com/Recommendation.nhn',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
    }
  })
  .then(r => r.data)
  .then(r => {
    // console.log(r.indexOf('id="viewTypeSelector">'));
    r = r.substring(r.indexOf('id="viewTypeSelector">') + 22);
    const startIndex = r.indexOf('<!-- SE_DOC_CONTENTS_START -->');
    if(startIndex > 0) {
      r = r.substring(r.indexOf('<!-- SE_DOC_CONTENTS_START -->') + 30);
      r = r.substring(0, r.indexOf('<!-- SE_DOC_CONTENTS_END -->'));
    } else {
      // console.log(r.indexOf('\n	</div>'))
      r = r.substring(0, r.indexOf('\n	</div>\n    <div id ="ssp-bottom"></div>'));
    }
    // console.log(blogId, logNo, r.indexOf('<!-- SE_DOC_CONTENTS_START -->'))
    // r = r.slice(r.indexOf('<!-- SE_DOC_CONTENTS_START -->'), r.length)
    r = r.replace(/&nbsp;/gi, ' ');
    r = r.replace(/>[\n|\s]*</gi, '><');
    r = r.replace(/<br\s?\/?>/gi, '\n');
    r = r.replace(/<p>/gi, '\n<p>');
    r = r.replace(/(<([^>]+)>)/ig, "");
    return r;
  })
}

async function run(currentPage) {
  for(const directorySeq in directorySeqs) {
    const { result: { isLastPage, recommendationPostViewList } } 
      = await getRecommendationPostViewList(directorySeq, currentPage || 1);
    // const { isLastPage, recommendationPostViewList } = result;
    // console.log(result.recommendationPostViewList);
    for(const i in recommendationPostViewList) {
      // console.log(recommendationPostViewList[i]);
      const { blogId, logNo } = recommendationPostViewList[i];
      // const url = `https://m.blog.naver.com/PostView.nhn?blogId=${blogId}&logNo=${logNo}`;
      // console.log(url);
      const content = await getBlogContents(blogId, logNo);
  
      path = `./data/${directorySeq}`;
      try {
        fs.mkdirSync(path);
      } catch(e) {}
      fs.writeFileSync(`${path}/${blogId}_${logNo}.txt`, content, 'utf8');
    }
  }
}

(async () => {
  for(let i=3; i<=10; i++) {
    await run(i);
  }
})()

/*
// https://m.blog.naver.com/rego/RecommendationPostList.nhn?directorySeq=5&currentPage=1
request({
  url: 'https://m.blog.naver.com/rego/RecommendationPostList.nhn?directorySeq=5&currentPage=1',
  headers: {
    referer: 'https://m.blog.naver.com/Recommendation.nhn',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
  }
}, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});*/

/*
https://m.blog.naver.com/PostView.nhn?blogId=woosukie&logNo=221420185234&referrerCode=1
<!-- SE_DOC_CONTENTS_START -->
<div class="se_component_wrap sect_dsc __se_component_area">
</div>
<!-- SE_DOC_CONTENTS_END -->
*/