import axios from '../../src/index'

axios({
  method: 'get',
  url: '/test_url_params/get',
  params: {
    foo: ['bar', 'baz']
  }
})

axios({
  method: 'get',
  url: '/test_url_params/get',
  params: {
    foo: {
      bar: 'baz'
    }
  }
})

const date = new Date()

axios({
  method: 'get',
  url: '/test_url_params/get',
  params: {
    date
  }
})

axios({
  method: 'get',
  url: '/test_url_params/get',
  params: {
    foo: '@:$, '
  }
})

axios({
  method: 'get',
  url: '/test_url_params/get',
  params: {
    foo: 'bar',
    baz: null
  }
})

axios({
  method: 'get',
  url: '/test_url_params/get#hash',
  params: {
    foo: 'bar'
  }
})

axios({
  method: 'get',
  url: '/test_url_params/get?foo=bar',
  params: {
    bar: 'baz'
  }
})
