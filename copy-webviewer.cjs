const path = require('path');
const fse = require('fs-extra');

const src = path.join(__dirname, 'node_modules', '@pdftron', 'webviewer', 'public');
const dest = path.join(__dirname, 'public', 'lib', 'webviewer');

fse.ensureDirSync(dest);
fse.copySync(src, dest, { overwrite: true });

console.log('✅ WebViewer assets copied!');
