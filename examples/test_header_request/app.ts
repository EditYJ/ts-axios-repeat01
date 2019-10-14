import axios from '../../src/index'

axios({
  method: 'post',
  url: '/test_data_request/post',
  data: {
    a:1,
    b:2,
    c:'hello world'
  }
})

axios({
  method: 'post',
  url: '/test_data_request/post',
  headers: {
    'conTent-TyPe': 'application/json',
    'Accept': 'application/json, text/plain, */*'
  },
  data: {
    a:1,
    b:2,
    c:'hello world'
  }
})
