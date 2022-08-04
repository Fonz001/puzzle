/* eslint-disable */
const webpack = require('webpack')
const childProcess = require('child_process')

function exec(cmd) {
  return JSON.stringify(childProcess.execSync(cmd).toString().trim())
}

const gitBranch = process.env.GITBRANCH ? JSON.stringify(process.env.GITBRANCH) : exec('git rev-parse --abbrev-ref HEAD')
const gitDate= process.env.GITDATE ? JSON.stringify(process.env.GITDATE) : exec('git show -s --format=%ct')
const gitDescribe = process.env.GITDESCRIBE ? JSON.stringify(process.env.GITDESCRIBE) : exec('git describe --always')

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        GITBRANCH: gitBranch,
        GITDATE: gitDate,
        GITDESCRIBE: gitDescribe,
        VERSION: exec('node -pe "require(\'./package.json\').version"'),
      }),
    ],
  },
}
