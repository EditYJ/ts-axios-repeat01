import axios from '../../src/index'

document.cookie = 'a=b'

axios.get('/more/get').then(res => {
  console.log(res)
}).catch(e => {
  // TODO 处理异常
})

axios.post('http://127.0.0.1:8088/more/server2', { },{
  withCredentials: true
}).then(res=>{
  console.log(res)
}).catch(e=>{
  // TODO 处理异常
})