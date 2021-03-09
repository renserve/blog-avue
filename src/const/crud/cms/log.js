/*
 *    Copyright (c) 2018-2025, intelligence All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: intelligence
 */
export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    menuWidth: 150,
    align: 'center',
    refreshBtn: true,
    addBtn: false,
    menu:false,
    props: {
        label: 'label',
        value: 'value'
    },
    column: [{
        label: 'ID',
        prop: 'id',
    }, {
        label: '菜单',
        prop: 'menu'
    }, {
        label: '操作',
        prop: 'opt'
    }, {
        label: '资源路径',
        prop: 'uri'
    }, {
        label: '操作人',
        prop: 'crtName'
    }, {
        label: '操作时间',
        prop: 'crtTime'
    }]
}
