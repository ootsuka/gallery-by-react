require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
let yeomanImage = require('../images/yeoman.png');
let imageDatas = require('../data/imageDatas.json');

imageDatas = (function getImageUrl(imageDataArr) {
  for (let i = 0; i < imageDataArr.length; i++) {
    let singleImageData = imageDataArr[i];
    singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas)

class ImgFigure extends React.Component {
  render() {
    let styleObj = {}

    //如果props属性中指定了图片位置则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos
    }

    //如果旋转角度不为0
    if (this.props.arrange.rotate) {
      (['-moz-', '-ms-', '-webkit-' ]).forEach((value) => {
        styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)'
      })
    }
    return (
      <figure className='img-figure' style={styleObj}>
        <img src={this.props.data.imageUrl}/>
        <figcaption>
          <h2 className='img-title'>
            {this.props.data.title}
          </h2>
        </figcaption>
      </figure>
    )
  }
}

const  getRangeRandom = (low, high) => {
  return Math.ceil((Math.random() * (high - low) + low))
}

/*
 *获取0-30之间的任意正负值
 */
const get30DegreeRandom = () => {
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30)
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgsArrangeArr: [
        {
          pos: {
            left: '0',
            top: '0'
          },
          rotate : 0 //旋转角度
        }
      ]
    }
  }
  Constant = {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {
      leftSecX:[0, 0],
      rightSecX:[0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x:[0, 0],
      topY:[0, 0]
    }
  }
  /*
   *重新布局所以图片
   *@param centerIndex 指定居中排布哪个图片
   */
   rearrange = (centerIndex) => {
     console.log('rearrange triggered')
     let imgsArrangeArr = this.state.imgsArrangeArr
     let centerPos =  this.Constant.centerPos
     let hPosRange = this.Constant.hPosRange
     let vPosRange = this.Constant.vPosRange
     let hPosRangeLeftSecX = hPosRange.leftSecX
     let hPosRangeRightSecX = hPosRange.rightSecX
     let hPosRangeY = hPosRange.y
     let vPosRangeTopY = vPosRange.topY
     let vPosRangeX = vPosRange.x

     let imgsArrangeTopArr = []
     let topImgNum = Math.ceil(Math.random() * 2) //取1或者0
     let topImgSpliceIndex = 0

     let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1)

     //首先居中
     imgsArrangeCenterArr[0].pos = centerPos
     //居中的图片不需要旋转
     imgsArrangeCenterArr[0].rotate = 0;


     //取出要布局上侧图片的位置信息
     topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum))
     imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum)

     //布局位于上侧图片
     imgsArrangeTopArr.forEach((value, index)=>{
       imgsArrangeTopArr[index] = {
         pos: {
             top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
             left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
           },
         rotate : get30DegreeRandom()
       }
     })

     //布局左右俩侧图片
     for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
       let hPosRangeLORX = null
       //前半部分布局左边，右半部分布局右边
       if (i < k) {
         hPosRangeLORX = hPosRangeLeftSecX
       } else {
         hPosRangeLORX = hPosRangeRightSecX
       }

       imgsArrangeArr[i] = {
         pos: {
           top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
           left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
         },
         rotate : get30DegreeRandom()
       }
     }

     if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
       imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
     }

     imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])
     console.log('arrange finished')
     this.setState({
       imgsArrangeArr : imgsArrangeArr
     })
   }

  //组件加载后为每张图片计算位置范围
  componentDidMount() {
    console.log('componentDidMount triggered')
    //舞台大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
          stageW = stageDOM.scrollWidth,
          stageH = stageDOM.scrollHeight,
          halfStageW = Math.ceil(stageW / 2),
          halfStageH = Math.ceil(stageH / 2)
    //拿到一个imgFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2)

    //计算中心图片的位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    //计算左侧右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW
    this.Constant.hPosRange.y[0] = -halfImgH
    this.Constant.hPosRange.y[1] = stageH - halfImgH

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3
    this.Constant.vPosRange.x[0] = halfStageW - imgW
    this.Constant.vPosRange.x[1] = halfStageW
    console.log('before rearrange call')
    this.rearrange(0)
  }
  render() {
    const controllerUnits = []
    const imgFigures = []
    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0
        }
      }
      imgFigures.push(
        <ImgFigure data={value}
        ref={'imgFigure' + index}
        arrange={this.state.imgsArrangeArr[index]}
        />
    )
    })
    console.log(this.state)

    return (
      <section className="stage" ref='stage'>
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
