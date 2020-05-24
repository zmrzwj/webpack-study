import './index.css';
import './font-awesome/css/font-awesome.css';

function add(x, y) {
  return x + y;
}

const zwjFunction = function a(n, m) {
  return n * m;
};

add(1, 2);
zwjFunction(1, 2);

if (module.hot) {
  module.hot.accept('./print.js', () => {
    // eslint-disable-next-line
    print();
  });
}
