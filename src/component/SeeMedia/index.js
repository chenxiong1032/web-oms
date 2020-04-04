import React from 'react';
import ReactDOM from 'react-dom';
import {message, Icon, Spin, Card, Button} from 'antd';
import {addEvent, removeEvent} from '../controls/common';

import styles from './index.less';

const empty = () => {};

function Model() {
  const margin = 8;
  const {onClose = () => {}, attaches} = this.props;

  // 测试数据 可以用下面注释的代码测试数据（解注即可）
  // attaches.push({type: 'png', name: '图片测试数据', url: 'https://www.baidu.com/img/bd_logo1.png'});
  // attaches.push({type: 'doc', name: '下载word测试数据', url: 'http://localhost:8000/staticFile/用户操作手册.docx'});
  // attaches.push({type: 'mp3', name: '音频类测试数据', url: 'http://www.runoob.com/try/demo_source/horse.mp3'});
  // attaches.push({type: 'mp4', name: '视频类测试数据', url: 'http://www.runoob.com/try/demo_source/movie.mp4'});
  // attaches.push({type: 'pdf', name: 'PDF测试数据', url: 'http://download.oray.com/pgy/doc/X5-3353%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C_1.1.3.pdf'});

  const loadImgExt = ({target: element}) => { // 图片对象加载扩展
    const helper = {};
    const findNode = 'findDOMNode';
    const {naturalWidth, naturalHeight} = element;

    const toPx = num => `${Math.ceil(num)}px`; // 转像素

    const toNum = px => px.replace('px', '') * 1; // 转数值

    const actions = (...funcs) => funcs.forEach(x => x()); // 执行函数

    const addEvt = (el, type, func) => { // 事件封装
      addEvent(el, type, func);
      return () => removeEvent(el, type, func);
    };

    const vals = () => { // 缓存值
      let source = null;
      return (val) => {
        if (source) return val - source;
        source = val; return 0;
      };
    };

    const getSize = () => { // 获取最佳屏幕大小
      const {clientWidth, clientHeight} = document.body;
      const ratio = naturalWidth / naturalHeight;
      const cw = clientWidth - 2 * margin;
      const ch = clientHeight - 2 * margin;
      let result = {width: naturalWidth, height: naturalHeight};
      if (naturalWidth > cw) {
        result = {width: cw, height: cw / ratio};
        if (result.height > ch) result = {width: ch * ratio, height: ch};
      } else if (naturalHeight > ch) {
        result = {width: ch * ratio, height: ch};
        if (result.width > cw) result = {width: cw, height: cw / ratio};
      }
      return result;
    };

    const wheel = () => { // 滚轮事件
      addEvent(ReactDOM[findNode](helper.target), 'mousewheel', (e) => {
        const {evts: {onZoonIn, onZoonOut}} = this.state;
        [onZoonIn, onZoonOut][e.deltaY > 0 ? 1 : 0]();
      });
    };

    const drag = () => { // 图片拖拽
      const $target = ReactDOM[findNode](helper.target);
      addEvent($target, 'mousedown', () => {
        const {left, top} = $target.style;
        const local = {left: vals(), top: vals()};
        const x = toNum(left);
        const y = toNum(top);
        const move = addEvt(document, 'mousemove', (e) => {
          const {clientX, clientY} = e;
          Object.assign($target.style, {left: toPx(x + local.left(clientX)), top: toPx(y + local.top(clientY))});
        });
        const up = addEvt(document, 'mouseup', () => actions(move, up));
      });
    };

    const zoon = () => { // 缩放显示
      const {scale} = this.state;
      const {clientWidth, clientHeight} = document.body;
      const width = naturalWidth * scale;
      const height = naturalHeight * scale;
      const $target = ReactDOM[findNode](helper.target);
      Object.assign($target.style, {width: toPx(width), height: toPx(height), left: toPx((clientWidth - width) / 2), top: toPx((clientHeight - height) / 2)});
    };

    const bind = () => { // 绑定事件
      let rate = 0;
      const {evts} = this.state;
      const $target = ReactDOM[findNode](helper.target);
      this.setState({evts: {
        ...evts,
        onReset: () => {
          const {width} = getSize();
          rate = 0;
          this.setState({scale: Math.ceil(width * 10 / naturalWidth) / 10}, zoon);
          Object.assign($target.style, {transform: `rotate(${rate}deg)`});
        },
        onLoadFile: () => window.open(element.src, '_parent'),
        onZoonIn: () => {
          const {scale} = this.state;
          if (scale < 10) this.setState({scale: Math.min(10, scale + 0.1)}, zoon);
        },
        onZoonOut: () => {
          const {scale} = this.state;
          if (scale > 0.1) this.setState({scale: Math.max(0.1, scale - 0.1)}, zoon);
        },
        onTranform: () => {
          rate += 90;
          Object.assign($target.style, {transform: `rotate(${rate}deg)`});
        },
      }});
    };

    (() => { // 执行内容
      const {width, height} = getSize();
      const {clientWidth, clientHeight} = document.body;
      this.state.scale = Math.ceil(width * 10 / naturalWidth) / 10;
      const style = {backgroundImage: `url(${element.src})`, width: toPx(width), height: toPx(height), left: toPx((clientWidth - width) / 2), top: toPx((clientHeight - height) / 2)};
      this.setState({loading: false, target: <div ref={c => { helper.target = c; }} className={style.res_bgImg} style={style} />}, () => actions(bind, wheel, drag));
    })();
  };

  const loadTarget = (() => { // 加载附件
    const loadMatch = { // 支持的加载类型
      image: {
        loading: true,
        match: ['png', 'jpg', 'jpeg', 'gif'],
        load: (target) => {
          const {url} = target;
          return <img src={url} alt="图片预览" onLoad={loadImgExt} />;
        },
      },
      video: {
        match: ['mp4'],
        load: (target) => {
          const {url} = target;
          return (
            <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <video autoPlay controls="controls" src={url}>
                <source src={url} type="video/mp4" />
              </video>
            </div>
          );
        },
      },
      audio: {
        match: ['mp3'],
        load: (target) => {
          const {url} = target;
          return (
            <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <audio autoPlay controls="controls" src={url}>
                <source src={url} />
              </audio>
            </div>
          );
        },
      },
      active: {
        match: ['pdf'],
        load: (target) => {
          const {url, name} = target;
          return <iframe title={name} srcDoc={`<style>html, body {width: 100%; height: 100%; margin: 0; padding: 0;} </style><object data="${url}" type="application/pdf" width="100%" height="100%">`} width="100%" height="100%" scrolling="no" frameBorder="0">您的浏览器不支持嵌入式框架，或者当前配置为不显示嵌入式框架。</iframe>;
        },
      },
      file: {
        match: ['*'],
        load: (target) => {
          const {url, name} = target;
          return (
            <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Card title="文件下载" style={{ width: 300 }}>
                <p>{name}</p>
                <div style={{textAlign: 'right', padding: '10px 0'}}><Button type="primary" icon="download" onClick={() => window.open(url, '_parent')}>下载</Button></div>
              </Card>
            </div>
          );
        },
      },
    };

    return (target) => {
      const {type} = target;
      const [macth = 'file'] = Object.keys(loadMatch).filter(key => loadMatch[key].match.some(x => x === type));
      const {loading = false, load} = loadMatch[macth];
      return {type: macth, loading, target: load(target)};
    };
  })();

  const nextTarget = () => { // 下一个
    const {idx} = this.state;
    const index = idx + 1;
    this.setState({
      idx: index,
      next: index < attaches.length - 1,
      prev: true,
      ...loadTarget(attaches[index]),
      evts: {onNext: nextTarget, onPrev: prevTarget, onClose},
    });
  };

  const prevTarget = () => { // 上一个
    const {idx} = this.state;
    const index = idx - 1;
    this.setState({
      idx: index,
      next: true,
      prev: index > 0,
      ...loadTarget(attaches[index]),
      evts: {onNext: nextTarget, onPrev: prevTarget, onClose},
    });
  };

  (() => {
    if (Array.isArray(attaches) && attaches.length > 0) {
      this.setState({
        idx: 0,
        next: attaches.length > 1,
        prev: false,
        ...loadTarget(attaches[0]),
        evts: {onNext: nextTarget, onPrev: prevTarget, onClose},
      });
    } else {
      message.info('没有附件');
      onClose();
    }
  })();
}

export default class Ctrl extends React.Component {
  componentWillMount() { this::Model(); }
  render() {
    const {loading, target, scale, type, next, prev, evts = {}} = this.state || {};
    const {onNext = empty, onPrev = empty, onZoonIn = empty, onZoonOut = empty, onReset = empty, onTranform = empty, onLoadFile = empty, onClose = empty} = evts;
    return (
      <div className={styles.res}>
        <div className={styles.res_content}>
          <div className={styles.res_target}>{target}</div>
          <div className={styles.res_tools}>
            <div style={{opacity: 0.3}} >{prev && !loading && <Icon title="上一个" type="left-circle" onClick={onPrev} />}</div>
            <div>{loading && <Spin size="large" />}</div>
            <div style={{opacity: 0.3}} >{next && !loading && <Icon title="下一个" type="right-circle" onClick={onNext} />}</div>
          </div>
          {type === 'image' && !loading && <div className={styles.res_imgbar}>
            <div>
              <img alt="还原" title="还原" onDragStart={(e) => e.preventDefault()} src="./images/seemedia/full_screen.png" onClick={onReset} />
              <img alt="放大" title="放大" onDragStart={(e) => e.preventDefault()} src="./images/seemedia/bigger.png" onClick={onZoonIn} />
              <div className={styles.res_imgtip}>{`${Math.ceil(scale * 10) * 10}%`}</div>
              <img alt="缩小" title="缩小" onDragStart={(e) => e.preventDefault()} src="./images/seemedia/smaller.png" onClick={onZoonOut} />
              <img alt="旋转" title="旋转" onDragStart={(e) => e.preventDefault()} src="./images/seemedia/rotate.png" onClick={onTranform} />
              <img alt="下载" title="下载" onDragStart={(e) => e.preventDefault()} src="./images/seemedia/download.png" onClick={onLoadFile} />
            </div>
          </div>}
          <div className={styles.res_close}><Icon title="关闭" type="close" onClick={onClose} /></div>
        </div>
      </div>
    );
  }
}
