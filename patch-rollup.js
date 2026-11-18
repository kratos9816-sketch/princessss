import fs from 'fs';
import path from 'path';

const nativeJsPath = path.resolve('node_modules', 'rollup', 'dist', 'native.js');

if (fs.existsSync(nativeJsPath)) {
  let content = fs.readFileSync(nativeJsPath, 'utf8');
  if (!content.includes('@rollup/wasm-node')) {
    content = content.replace(
      /const nativeModule = requireWithFriendlyError\([\s\S]*?\);/,
      `let nativeModule;
try {
  nativeModule = requireWithFriendlyError(
    existsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
  );
} catch (e) {
  nativeModule = require('@rollup/wasm-node/dist/native.js');
}`
    );
    fs.writeFileSync(nativeJsPath, content, 'utf8');
    console.log('Successfully patched rollup for Windows Application Control compatibility.');
  }
}
