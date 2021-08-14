//定义请求地址
// const host = 'https://www.hhdglm.com/api/';
const host = 'http://192.168.0.176:6070/';

const request = (url, options) => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: `${host}${url}`,
          method: options.method,
          data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
          header: {
              'Content-Type': 'application/json; charset=UTF-8',
              // 'x-token': 'x-token'  // 看自己是否需要
          },
          success(request) {
              if (request.data.code === 200) {
                  resolve(request)
              } else {
                  reject(request.data)
              }
          },
          fail(error) {
              reject(error.data)
          }
      })
  })
}

const get = (url, options = {}) => {
  // console.log("url",url)
  return request(url, { method: 'GET', data: options })
}

const post = (url, options) => {
  return request(url, { method: 'POST', data: options })
}

const put = (url, options) => {
  return request(url, { method: 'PUT', data: options })
}

export default {
  get,
  post,
  put,
}