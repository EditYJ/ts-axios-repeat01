import { AxiosRequestConfig } from './types'
import xhr from './xhr'

function Axios(config: AxiosRequestConfig): void {
  xhr(config)
}

export default Axios
