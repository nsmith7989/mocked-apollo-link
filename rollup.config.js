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
