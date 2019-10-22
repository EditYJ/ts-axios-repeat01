import axios from '../../src'

axios({
  method: 'get',
  url: '/test_base_request/get',
  params: {
    a: 1,
    b: 2
  }
})
