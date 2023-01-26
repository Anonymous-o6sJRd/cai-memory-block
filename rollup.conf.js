import path from 'path'
import { getRollupPlugins } from '@gera2ld/plaid'
import userscript from 'rollup-plugin-userscript'
import terser from '@rollup/plugin-terser'
import pkg from './package.json'
import fs from 'fs'

const DIST = 'dist'
const FILENAME = 'index'

const bundleOptions = {
  extend: true,
  esModule: false,
}

const postcssOptions = {
  ...require('@gera2ld/plaid/config/postcssrc'),
  inject: false,
  minimize: true,
}

const meta = fs.readFileSync(path.resolve('src/meta.js'), 'utf-8')
  .replace('process.env.VERSION', pkg.version)
  .replace('process.env.AUTHOR', pkg.author)
  .replace('process.env.DESCRIPTION', pkg.description)

const rollupConfig = [
  {
    input: {
      input: 'src/index.ts',
      plugins: [
        ...getRollupPlugins({
          esm: true,
          minimize: false,
          postcss: postcssOptions,
          extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
        }),
        terser({
          format: {
            preamble: meta,
            comments: false,
          },
        }),
        userscript(path.resolve('src/meta.js'))
      ],
    },
    output: {
      format: 'iife',
      file: `${DIST}/${FILENAME}.user.js`,
      ...bundleOptions,
    },
  },
]

rollupConfig.forEach((item) => {
  item.output = {
    indent: false,
    // If set to false, circular dependencies and live bindings for external imports won't work
    externalLiveBindings: false,
    ...item.output,
  }
})

module.exports = rollupConfig.map(({ input, output }) => ({
  ...input,
  output,
}))
