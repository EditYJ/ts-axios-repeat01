const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
// 得到webpack的编译结果
const compiler = webpack(WebpackConfig)

/**
 * webpackDevMiddleware的其他配置项作用
 * noInfo: false,
 //  显示无信息到控制台（仅警告和错误）

 quiet: false,
 //  向控制台显示任何内容

 lazy: true,
 //  切换到延迟模式
 //  这意味着没有观看，而是重新编译每个请求

 watchOptions: {
aggregateTimeout: 300,
poll: true
},
 // watch options (only lazy: false)

 publicPath: "/assets/",
 //  绑定中间件的公共路径
 //  使用与webpack相同

 index: "index.html",
 //  Web服务器的索引路径，默认为“index.html”。
 //  如果falsy（但不是未定义），服务器将不会响应到根URL的请求。

 headers: { "X-Custom-Header": "yes" },
 //  自定义标题

 mimeTypes: { "text/html": [ "phtml" ] },
 //  添加自定义mime /扩展映射
 // https://github.com/broofa/node-mime#mimedefine
 // https://github.com/webpack/webpack-dev-middleware/pull/150

 stats: {
  colors: true
},
 //  用于形成统计信息的选项

 reporter: null,
 //  提供自定义记录器来更改日志显示的方式。

 serverSideRender: false,
 //  关闭服务器端渲染模式。有关详细信息，请参阅服务器端渲染部分。
 */
app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunk: false
  }
}))

// 加入热重载功能
app.use(webpackHotMiddleware(compiler))

// 配置当前目录静态资源文件，index.html,global.css
app.use(express.static(__dirname))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

const router = express.Router()
router.get('/test_base_request/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/test_url_params/get', function(req, res) {
  res.json(req.query)
})

router.post('/test_data_request/post', function(req, res) {
  res.json(req.body)
})

router.post('/test_data_request/buffer', function(req, res) {
  let msg = []
  req.on('data',(chunk)=>{
    if (chunk){
      msg.push(chunk)
    }
  })
  req.on('end',()=>{
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

router.get('/error/get', function(req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    })
  }, 3000)
})

registerExtendRouter()

app.use(router)

const port = process.env.PORT || 8012

module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

function registerExtendRouter () {
  router.get('/extend/get', function(req, res) {
    res.json({
      msg: 'hello world'
    })
  })

  router.options('/extend/options', function(req, res) {
    res.end()
  })

  router.delete('/extend/delete', function(req, res) {
    res.end()
  })

  router.head('/extend/head', function(req, res) {
    res.end()
  })

  router.post('/extend/post', function(req, res) {
    res.json(req.body)
  })

  router.put('/extend/put', function(req, res) {
    res.json(req.body)
  })

  router.patch('/extend/patch', function(req, res) {
    res.json(req.body)
  })

  router.get('/extend/user', function(req, res) {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        name: 'jack',
        age: 18
      }
    })
  })

  router.get('/interceptor/get', function(req, res) {
    res.end('hello')
  })

}
