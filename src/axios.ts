import Axios from './core/Axios';
import mergeConfig from './core/merageConfig';
import defaults from './defaults';
import { extend } from './helpers/utils';
import { AxiosRequestConfig, AxiosStatic } from './types';
import CancelToken from './cancel/CancelToken';
import Cancel, { isCancel } from './cancel/Cancel';

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios
