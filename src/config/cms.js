export default {
  baseURL: process.env.VUE_APP_BASE_URL,
  stagnateTime: 1000 * 60 * 60 * 8, // 无操作停滞时间  默认8小时
  openAutoJumpOut: true, // 是否开启无操作跳出VUE_APP_BASE_URL
  notLoginRoute: ['login'], // 无需登录即可访问的路由 name,
  sideBarLevel: 3, // 侧边栏层级限制, 3表示三级, 可设置 2 和 3
  showSidebarSearch: true, // 默认打开侧边栏搜索
  defaultRoute: '/about', // 默认打开的路由
  useFrontEndErrorMsg: false, // 采用前端返回异常,默认false
}
