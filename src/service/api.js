import request from '../util/request';
import { stringify } from 'querystring';

// const proxy="http://127.0.0.1:8011";
const proxy="http://10.39.21.38";
export function getUser() {
  return request(`${proxy}/getUser`,{
    mode:'cors',
  });
}

export function getGasReportData(ecode,date){
  return request(`test/gas/xinaoreport/xinaoreport/Infos.ashx?ecode=${ecode}&date=${date}&_=1541502715820`,{
    // mode:'cors',
  })
}

export function getFillReportData(ecode,date){
  return request(`test/gas/queryQlkcAndTjzb?ecode=0011&year=2018`)
}

export function submit(params){
  return request(`test/gas/updateQlkcAndTjzb?${stringify(params)}`,{
    method:'POST',
  })
}

export function showAllSup(){
  // return request(`/test/gas/selectAllSup?`);
  return {
    data:[
      {
        key:1,
        enterprise:"A",
        gasType:"png",
        belong:"外部",
      },
      {
        key:2,
        enterprise:"B",
        gasType:"png",
        belong:"外部",
      },
    ],
    success:true,
    msg:"添加成功",
  }
}

