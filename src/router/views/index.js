import Layout from '@/page/index/'

export default [{
    path: '/cms/info',
    component: Layout,
    redirect: '/cms/user/info',
    children: [{
        path: '/cms/user/info',
        name: '个人信息',
        component: () =>
            import('@/views/cms/user/info')
    }]
}]
