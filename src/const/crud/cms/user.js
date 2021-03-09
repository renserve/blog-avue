export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    searchMenuSpan: 6,
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    column: [{
        fixed: true,
        label: '用户名',
        prop: 'username',
        editDisabled: true,
        slot: true,
        span: 24,
        rules: [{
            required: true,
            message: '请输入用户名'
        },
            {
                min: 3,
                max: 20,
                message: '长度在 3 到 20 个字符',
                trigger: 'blur'
            }
        ]
    }, {
        label: '密码',
        prop: 'password',
        type: 'password',
        value: '',
        hide: true,
        span: 24,
        rules: [{
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
        }]
    }, {
        label: '手机号',
        prop: 'mobilePhone',
        type: 'tel',
        value: '',
        span: 24,
        rules: [{
            min: 11,
            max: 11,
            message: '长度在 11 个字符',
            trigger: 'blur'
        }]
    }, {
        label: '邮箱',
        prop: 'email',
        type: 'email',
        value: '',
        span: 24,
    }, {
        label: '类型',
        prop: 'type',
        minWidth:150,
        type:"radio",
        button:true,
        span: 24,
        dicData:[
            {
                label:'系统管理员',
                value: '0'
            },
            {
                label: '超级管理员',
                value: '1'
            }
        ],
        rules: [{
            required: true,
            message: '请选择角色类型',
            trigger: 'change'
        }]
    }, {
        label: '角色',
        prop: 'groupIds',
        formslot: true,
        slot: true,
        overHidden: true,
        span: 24,
        rules: [{
            required: true,
            message: '请选择角色',
            trigger: 'change'
        }]
    }, {
        width: 180,
        label: '创建时间',
        prop: 'updTime',
        display: false,
        span: 24
    }, {
        width: 180,
        label: '创建人',
        prop: 'updName',
        display: false,
        span: 24
    }]
}
