import axios from '../../src/index'

axios({
  method: 'post',
  url: '/test_data_request/post',
  data: {
    a: 1,
    b: 'test'
  }
})

const arrayBuffer = new Int32Array([21,32,52])

axios({
  method: 'post',
  url: '/test_data_request/buffer',
  data: arrayBuffer
})
