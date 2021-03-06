/**
 * @desc  [自定义校验规则]
 * @example
 *  import { rule } from "@/util/rule";
 *  rules: [
 *     { validator: rule.emailValue, trigger: 'blur'}
 *  ]
 *
 *  可参考: https://gitee.com/log4j/codes/lgfxz09bmt7ea3rdwnocs20
 */

export const rule = {
    /**
    * 2020/3/28
    * author:putao
    * 校验 请输入包含http的链接
    */
    validatorUrl(rule, value, callback){
        let urlTest = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
        if (value && !urlTest.test(value) ) {
            callback(new Error('请输入以http或https开头的链接地址'));
        } else {
            callback();
        }
    },
    /**
     * 2020/3/28
     * author:putao
     * 校验 请输入限制最小值和最大值
     */
    validatorLimit(rule, value, callback){
    
    },
  /**
   * 校验 请输入中文、英文、数字包括下划线
   * 名称校验
   */
  validatorNameCn(rule, value, callback) {
    let acount = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
    if (value && (!(acount).test(value))) {
      callback(new Error('请输入中文、英文、数字包括下划线'))
    } else {
      callback()
    }
  },
  /**
   * 校验 请输入英文、数字包括下划线
   * 名称校验
   */
  validatorName(rule, value, callback) {
    let acount = /^[A-Z_]+$/
    if (value && (!(acount).test(value))) {
      callback(new Error('请输入大写英文、下划线'))
    } else {
      callback()
    }
  },
  // 校验规则根据不同业务需求，不断拓展补充 ...
}
