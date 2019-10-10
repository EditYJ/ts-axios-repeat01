const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',

  /**
   * 我们会在example目录下面新建多个子目录
   * 我们会把不同的章节demo返稿不同的子目录中
   * 每个子目录下面都会创建一个app.ts
   * app.ts作为webpack构建的入口文件
   * entries收集了多个目录的入口文件，并且每个入口文件都引入了一个用于热更新的文件
   * entries 是一个对象，key是目录名
   */
  // 读取当前根目录下的所有子目录
  // __dirname 总是指向被执行 js 文件的绝对路径
  // 此处__dirname便是D:\project\TSPro\ts-axios-repeat01\examples
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    // 拼接子目录的全目录路径
    // 此处fullDir为D:\project\TSPro\ts-axios-repeat01\examples\simple01
    const fullDir = path.join(__dirname, dir)
    // 拼接入口文件全目录路径
    // 此处entry为D:\project\TSPro\ts-axios-repeat01\examples\simple01\app.ts
    const entry = path.join(fullDir, 'app.ts')
    // 如果fullDir是一个目录路径且此目录下存在app.ts入口文件，那么为这个入口文件添加热更新支持
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['webpack-hot-middleware/client', entry]
    }
    return entries
  }, {}),

  /**
   * 根据不同的目录名称，打包生成目标js，名称和目录名一致
   */
  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    publicPath: '/__build__/'
  },

  /**
   * 使用tslint-loader和ts-loader对TypeScript进行编译
   */
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [{ loader: 'tslint-loader' }]
      },
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }]
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]

}
