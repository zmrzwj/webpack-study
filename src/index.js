import './index.css';
import './font-awesome/css/font-awesome.css';
// import 'print';

import $ from 'jquery'

import(/* webpackChunkName: 'print', webpackPrefetch: true */'./print').then(res => {
    console.log(res)
}).catch(() => {

})

function add(x, y) {
  return x + y;
}

const zwjFunction = function a(n, m) {
  return n * m;
};

add(1, 2);
zwjFunction(1, 2);

// 注册serviceworker
// 处理兼容问题
if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => {
                console.log('sw注册成功！')
            })
    })
}
