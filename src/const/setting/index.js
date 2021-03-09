const dicData = [{
    label: '开启',
    value: 'true'
}, {
    label: '关闭',
    value: 'false'
}]
const sizeData = [{
    label: '大',
    value: 'medium'
}, {
    label: '中',
    value: 'small'
}, {
    label: '小',
    value: 'mini'
}]
const btnData = [{
    label: '系统颜色',
    value: 'primary'
}, {
    label: '自定义',
    value: 'danger'
}]

const switchData = [{
    label: '允许',
    value: 'true'
}, {
    label: '禁止',
    value: 'false'
}]
export const list = [
    //自定义
    {
        key: 'minFontSize',
        commit: 'SET_WEL'
    },
    {
        key: 'maxFontSize',
        commit: 'SET_WEL'
    },
    {
        key: 'split',
        commit: 'SET_WEL'
    },
    {
        key: 'otherCloud',
        commit: 'SET_WEL_CLOUD'
    },

    {
        key: 'isOpenCloud',
        commit: 'SET_WEL_CLOUD_OPEN'
    },
    {
        key: 'cloudCount',
        commit: 'SET_WEL_CLOUD_COUNT'
    },
    {
        key: 'rotate',
        commit: 'SET_WEL'
    },
    {
        key: 'size',
        commit: 'SET_CONFIG'
    },
    {
        key: 'span',
        commit: 'SET_CONFIG'
    },
    {
        key: 'danger',
        commit: 'SET_CONFIG'
    },
    {
        key: 'showTag',
        commit: 'SET_SHOWTAG'
    }, {
        key: 'showTheme',
        commit: 'SET_SHOWTHEME'
    }, {
        key: 'showColor',
        commit: 'SET_SHOWCOLOR'
    }, {
        key: 'showLock',
        commit: 'SET_SHOWLOCK'
    }, {
        key: 'showDebug',
        commit: 'SET_SHOWDEBUG'
    }, {
        key: 'showFullScren',
        commit: 'SET_SHOWFULLSCREN'
    }, {
        key: 'showCollapse',
        commit: 'SET_SHOWCOLLAPSE'
    }, {
        key: 'showSearch',
        commit: 'SET_SHOWSEARCH'
    }, {
        key: 'showMenu',
        commit: 'SET_SHOWMENU'
    }
]
export const option = (safe) => {
    const _safe = safe
    return {
        submitBtn: false,
        emptyBtn: false,
        group: [
            {
                label: '字符云',
                prop: 'wordcloud',
                column: [
                    {
                        label: '字符数量',
                        prop: "cloudCount",
                        type: 'slider',
                        size:'mini',
                        min:50,
                        step: 50,
                        max: 800,
                        span: 24,
                        showStops: true,
                        change: (val) => {
                            _safe.set('cloudCount')
                        }
                    },
                    {
                        label: '最小字符',
                        prop: "minFontSize",
                        type: 'slider',
                        size:'mini',
                        min:12,
                        step: 2,
                        max: 40,
                        span: 24,
                        showStops: true,
                        change: (val) => {
                            _safe.set('minFontSize')
                        }
                    },
                    {
                        label: '最大字符',
                        prop: "maxFontSize",
                        type: 'slider',
                        size:'mini',
                        min:20,
                        step: 2,
                        max: 80,
                        span: 24,
                        showStops: true,
                        change: (val) => {
                            _safe.set('maxFontSize')
                        }
                    },
                    {
                        label: '字符间隔',
                        prop: "split",
                        type: 'slider',
                        size:'mini',
                        min:2,
                        step: 2,
                        max: 60,
                        span: 24,
                        showStops: true,
                        change: (val) => {
                            _safe.set('split')
                        }
                    },
                    {
                        label: '允许旋转',
                        prop: 'rotate',
                        type: 'radio',
                        size:'mini',
                        button:true,
                        span: 24,
                        dicData: switchData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    },
                    {
                        label: '查看其他',
                        prop: 'otherCloud',
                        type: 'switch',
                        span: 24,
                        dicData: switchData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    },
                    {
                        label: '首页展示',
                        prop: 'isOpenCloud',
                        type: 'switch',
                        span: 24,
                        dicData: dicData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    }
                ]
            },
            {
                label: '个性化',
                prop: 'custom',
                column: [
                    {
                        label: '控件尺寸',
                        prop: 'size',
                        type: 'radio',
                        size:'mini',
                        button:true,
                        span: 24,
                        dicData: sizeData,
                        change: (val) => {
                            _safe.set('size')
                        }
                    }, {
                        label: '表单栅列',
                        prop: "span",
                        type: 'slider',
                        size:'mini',
                        min:6,
                        step: 6,
                        max: 24,
                        span: 24,
                        showStops: true,
                        change: (val) => {
                            _safe.set('span')
                        }
                    }, {
                        label: '按钮颜色',
                        prop: 'danger',
                        size:'mini',
                        type: 'radio',
                        button:true,
                        span: 24,
                        dicData: btnData,
                        change: ({column}) => {
                            _safe.set('danger')
                        }
                    }
                ]
            },
            {
                label: '系统开关',
                prop: 'system',
                column: [
                    {
                        label: '标签',
                        prop: 'showTag',
                        type: 'switch',
                        span: 24,
                        dicData: dicData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    }, {
                        label: '日志',
                        prop: 'showDebug',
                        type: 'switch',
                        span: 24,
                        dicData: dicData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    }, {
                        label: '主题',
                        prop: 'showTheme',
                        type: 'switch',
                        span: 24,
                        dicData: dicData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    }, {
                        label: '主题色',
                        prop: 'showColor',
                        type: 'switch',
                        span: 24,
                        dicData: dicData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    }, {
                        label: '全屏',
                        prop: 'showFullScren',
                        type: 'switch',
                        span: 24,
                        dicData: dicData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    }, {
                        label: '锁屏',
                        prop: 'showLock',
                        type: 'switch',
                        span: 24,
                        dicData: dicData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    }, {
                        label: '缩放',
                        prop: 'showCollapse',
                        type: 'switch',
                        span: 24,
                        dicData: dicData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    }, {
                        label: '顶部菜单',
                        prop: 'showMenu',
                        type: 'switch',
                        span: 24,
                        dicData: dicData,
                        click: ({column}) => {
                            _safe.set(column.prop)
                        }
                    }
                ]
            }
        ]
    }
    
}
