import { nodeResolve } from '@rollup/plugin-node-resolve';

console.log('Empacotando para min.js')

export default {
  plugins: [nodeResolve()]
};