require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

//获取图片的数据
var imageDatas = require('../json/imageDatas.json');
//利用自执行
imageDatas = (function genImageURL(imageDatasArr) {
  for(var i = 0 ; i < imageDatasArr.length ; i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">q</section>
        <nav className="controller-nav">w</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
