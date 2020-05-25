import './index.css';
import './font-awesome/css/font-awesome.css';
// import 'print';

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
