require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDom from 'react-dom';

let yeomanImage = require('../images/yeoman.png');

//获取图片的数据
var imageDatas = require('../json/imageDatas.json');
//利用自执行,计算URL
imageDatas = (function genImageURL(imageDatasArr) {
  for(var i = 0 ; i < imageDatasArr.length ; i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//获取区间随机值
function getRanageRandom (low,high){
  return Math.ceil( Math.random() * (high - low) + low );
}

class ImgFigure extends React.Component {
  render() {
    var styleObject = {};
    //如果图片使用属性指定的位置则使用
    if( this.props.arrange.pos ){
      styleObject = this.props.arrange.pos;
    }
    return (
      <figure className="img-figure" style={styleObject}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesArrangeArr:[
        /*{
          pos:{
            left:'0',
            top: '0'
          }
        }*/
      ]
    };
  }//初始化的数据
  Constant = {
    centerPos:{//中心
      left: 0,
      right: 0
    },
    hPosRange:{//水平方向的取值范围
      leftSecX:[0,0],
      rightSecx:[0,0],
      y:[0,0]
    },
    vPosRange:{//垂直方向的取值范围
      x:[0,0],
      topY:[0,0]
    }
  }
  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布的图片
   * */
  rearrange(centerIndex){
    var imgsArrangeArr = this.state.imagesArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecx = hPosRange.rightSecx,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.ceil(Math.random()*2),//0或1
      topImgSpliceIndex = 0,//上侧的那个图片
      imgArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);//居中的一个图片

    //首先居中centerIndex的图片
    imgArrangeCenterArr[0].pos = centerPos;

    //取出布局上侧图片的信息
    topImgSpliceIndex=Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //布局上侧图片
    imgsArrangeTopArr.forEach(function(value,index){
      imgsArrangeArr[index].pos = {
        top :getRanageRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
        left : getRanageRandom(vPosRangeX[0],vPosRangeX[1])
      }
    })

    //布局左右两侧的图片
    for(var i = 0 , j = imgsArrangeArr.length,k = j / 2 ; i < j ; i++){
      var hPosRangeLORX = null;
      //前半部门布局坐标，右半部分布局右边
      if( i < k ){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else{
        hPosRangeLORX = hPosRangeRightSecx;
      }
      imgsArrangeArr[i].pos = {
        top:getRanageRandom(hPosRangeY[0],hPosRangeY[1]),
        left:getRanageRandom(hPosRangeLORX[0],hPosRangeLORX[1])
      }
    }

    //开始合并
    if( imgsArrangeTopArr && imgsArrangeTopArr[0] ){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr);
    }
    imgsArrangeArr.splice(centerIndex,0,imgArrangeCenterArr[0]);

    this.setState({
      imagesArrangeArr:imgsArrangeArr
    })
  }
  //组件加载以后为每一张图片计算加载范围
  componentDidMount(){

    //首先拿到舞台大小
    var stageDom = ReactDom.findDOMNode(this.refs.stage),
      stageW = stageDom.scrollWidth,
      stageH = stageDom.scrollHeight,
      halfStageW = Math.ceil(stageW/2),
      halfStageH = Math.ceil(stageH/2);

    //拿到一个ImgFigure大小
    var ImgFigureDom = ReactDom.findDOMNode(this.refs.imgFigure0),
      imgW = ImgFigureDom.scrollWidth,
      imgH = ImgFigureDom.scrollHeight,
      halfImgW = Math.ceil(imgW/2),
      halfImgH = Math.ceil(imgH/2);

    //开始计算图片的位置和中心
    this.Constant.centerPos = {//计算中心
      left:halfStageW - halfImgW,
        top:halfStageH - halfImgH
    }
    //水平范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW,halfStageW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    //竖直范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfImgW - imgW;
    this.Constant.vPosRange.x[1] = halfImgW;
    //排布
    this.rearrange(0);
  }
  render() {
    var controllerUnits = [],imgFigures = [];
    imageDatas.forEach(function(value,index){
      //如果没有初始化就初始化
      if( !this.state.imagesArrangeArr[index] ){
        this.state.imagesArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          }
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} key={index} arrange={this.state.imagesArrangeArr[index]}/>);
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {

};

export default AppComponent;
