import commonjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

function onwarn(message) {
  const suppressed = ['UNRESOLVED_IMPORT', 'THIS_IS_UNDEFINED'];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}

export default [
  // for browser
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'mocked-apollo-link',
      sourcemap: true,
      exports: 'named',
    },
    onwarn,
  },
];
