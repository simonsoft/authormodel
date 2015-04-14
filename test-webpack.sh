#!/bin/bash
npm install
npm install webpack
# for backbone
npm install jquery

./node_modules/.bin/webpack './index' --output-file /dev/null

#./node_modules/.bin/webpack './index' --output-file /dev/null --display-chunks --display-modules --display-reasons

npm install mocha-loader
npm install mocha-phantomjs
npm install phantomjs-polyfill
# for fs mock
npm install raw-loader

cat << EOF > webpack-test.html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/></head>
<body>
<!--https://github.com/webpack/style-loader/issues/31-->
<script type="text/javascript" charset="utf-8" src="node_modules/phantomjs-polyfill/bind-polyfill.js"></script>
<script type="text/javascript" charset="utf-8" src="webpack-test.bundle.js"></script>
</body>
</html>
EOF

cat << EOF > webpack-test.js
var requireTest = require.context('./test/', true, /Spec\.js$/);
requireTest.keys().forEach(requireTest);
EOF

./node_modules/.bin/webpack 'mocha\!./webpack-test.js' --output-file webpack-test.bundle.js --resolve-alias fs=./fs-webpack-mock

./node_modules/.bin/mocha-phantomjs webpack-test.html
