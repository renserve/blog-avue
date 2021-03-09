// 配置编译环境和线上环境之间的切换

const env = process.env
const baseUrl = ''
// 图表库为avue和pig2套地址
const iconfontVersion = ['567566_qo5lxgtishg', '667895_v7uduh4zui','1729896_tr4rn31xsx']
const iconfontUrl = '//at.alicdn.com/t/font_$key.css'
const codeUrl = `${window.baseURL}/code`
// const codeUrl = `http://192.168.8.100:9999/code`
const actUrl = `${window.baseURL}/act/modeler.html?modelId=`
// const actUrl = `http://192.168.8.100:9999/act/modeler.html?modelId=`

if (env.NODE_ENV === 'development') {

} else if (env.NODE_ENV === 'production') {

} else if (env.NODE_ENV === 'test') {

}
export {
  baseUrl,
  actUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env
}
