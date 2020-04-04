import React from 'react'
import { Input, Select, DatePicker } from 'antd'
import styles from './index.less';
import moment from 'moment';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const relativePath = `src/page/control/SearchCtrl/index.js`;
export default class SearchCtrl extends React.PureComponent {
    state = {
        visible: false,
    }

    render() {
        return getComponent(this);
    }
}

/**
 * 获取标题
 * @param {标题} title 
 */
const getTitle = (title) => (<span>{title}:</span>);

/**
 * 获取组件
 * @param {this} that 
 */
const getComponent = (that) => {
    const { component = '', ...restProps } = that.props;
    switch (component) {
        case 'input': return getInput(restProps);
        case 'select': return getSelect(restProps);
        case 'period': return getPeriod(restProps, that);
        default: console.warn('不存在此组件类型！！！'); return '';
    }
}

/**
 * 获取Antd的Input输入框组件
 * @param {标题} title 
 * @param {参数} props 
 */
const getInput = ({ title, props }) => {
    return <div className={styles.inputSearch}>
        {getTitle(title)}
        <Input {...props} />
    </div>
}

/**
 * 
 * @param {标题} title 
 * @param {参数} props 
 */
const getSelect = ({ title, props }) => {
    const { option = [], ...restProps } = props;
    return <div className={styles.selectSearch}>
        {getTitle(title)}
        <Select {...restProps}>
            {option.map(item => (<Option key={item.value} value={item.value}>{item.name}</Option>))}
        </Select>
    </div>
}

//时间段
const period = {
    all: null,
    yesterday: [`${moment().subtract(1, 'days').format('YYYY-MM-DD')} 00:00:00`, `${moment().subtract(1, 'days').format('YYYY-MM-DD')} 23:59:59`], //昨天
    today: [`${moment().format('YYYY-MM-DD')} 00:00:00`, `${moment().format('YYYY-MM-DD')} 23:59:59`],  //今天
    tomorrow: [`${moment().add(1, 'days').format('YYYY-MM-DD')} 00:00:00`, `${moment().add(1, 'days').format('YYYY-MM-DD')} 23:59:59`], //明天
    lastweek: [`${moment().add(-1, 'week').day(1).format('YYYY-MM-DD')} 00:00:00`, `${moment().add(-1, 'week').day(7).format('YYYY-MM-DD')} 23:59:59`], //上周
    thisweek: [`${moment().day(1).format('YYYY-MM-DD')} 00:00:00`, `${moment().day(7).format('YYYY-MM-DD')} 23:59:59`], //本周
    nextweek: [`${moment().add(1, 'week').day(1).format('YYYY-MM-DD')} 00:00:00`, `${moment().add(1, 'week').day(7).format('YYYY-MM-DD')} 23:59:59`], //下周
    lastmonth: [`${moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD')} 00:00:00`, `${moment().add(-1, 'month').endOf('month').format('YYYY-MM-DD')} 23:59:59`], //上月
    thismonth: [`${moment().startOf('month').format('YYYY-MM-DD')} 00:00:00`, `${moment().endOf('month').format('YYYY-MM-DD')} 23:59:59`], //本月
    nextmonth: [`${moment().add(1, 'month').startOf('month').format('YYYY-MM-DD')} 00:00:00`, `${moment().add(1, 'month').endOf('month').format('YYYY-MM-DD')} 23:59:59`], //下月
    thisyear: [`${moment().startOf('year').format('YYYY-MM-DD')} 00:00:00`, `${moment().endOf('year').format('YYYY-MM-DD')} 23:59:59`], //本年
}
const getPeriod = ({ title, props }, that) => {
    const { visible } = that.state;
    const { showDot = true, diy = true, onClick = () => { }, option = [], value, isDIY = false } = props;
    const getDot = (name) => (value === name ? <div className={styles.dot} ></div> : <div className={styles.noDot} ></div>);

    const div = option.map(item => (<div className={styles.periodItem} onClick={() => onClick(item.value, period[item.value] ? period[item.value] : period['today'])}>
        {showDot ? getDot(item.value) : null}
        <span style={{ color: value === item.value ? '#1890FF' : '#595959' }} >{item.name}</span>
    </div>))
    isDIY && div.push(

        <div className={styles.periodItem} >

            {showDot ? getDot('diy') : null}

            <span style={{ color: value === 'diy' ? '#1890FF' : '#595959' }} onClick={() => onClick(that.setState({ visible: true }, () => onClick('diy', null)))} >自定义</span>

            {visible && value === 'diy' ? <RangePicker style={{ width: 250, marginLeft: 5, display: 'inline-block' }} onChange={(dates, dateStrings) => onClick('diy', [`${dateStrings[0]} 00:00:00`, `${dateStrings[1]} 23:59:59`])} /> : null}
        </div>
    )
    return <div className={styles.period}>
        {getTitle(title)}
        {div}
    </div>;

}