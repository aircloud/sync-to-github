const path = require('path')
const options = require('./.eslintrc')

module.exports = {
  // 这样拆分出来，给 typescript-eslint 减小一些压力，通常能节省 50%+ 的时间
  getModuleEslintConfig: (dirname) => {
    const parserOptions = {
      project: [path.resolve(dirname, './tsconfig.json')],
      tsconfigRootDir: dirname,
    }

    options.overrides.forEach((overrideConfig) => {
      overrideConfig.parserOptions = parserOptions
    })
    return options
  },
}
