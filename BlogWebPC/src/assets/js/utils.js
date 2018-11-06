export default {

    // =================================== other 其他类别 =======================================
    // 获取url后的参数
    getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
            r = window.location.search.substr(1).match(reg)
        if (r !== null) return unescape(r[2])
        return null
    },

    // 获取6位随机数
    MathRand() {
        var Num = ''
        for (var i = 0; i < 6; i++) {
            Num += Math.floor(Math.random() * 10)
        }
        return Num
    },

    /*
        获取数据类型
        return:
                STRING, OBJECT, FUNCTION, ARRAY, UNDEFINED, NULL, DATE, NUMBER
     */
    getType(_obj) {
        let type = Object.prototype.toString.call(_obj);

        const TypeEnum = {
            'STRING': '[object String]',
            'OBJECT': '[object Object]',
            'FUNCTION': '[object Function]',
            'ARRAY': '[object Array]',
            'UNDEFINED': '[object Undefined]',
            'NULL': '[object Null]',
            'DATE': '[object Date]',
            'NUMBER': '[object Number]'
        }

        for (let key in TypeEnum) {
            if (type === TypeEnum[key]) {
                return key
            }
        }

        return 'OBJECT';
    },

    // 判断是否为空
    isNull(_obj) {
        if (_obj && _obj !== 'undefined' && _obj !== 'null') {
            return false
        }
        return true
    },

    isNotNull(_obj) {
        return !this.isNull(_obj)
    },

    // =================================== number 数字类别 =======================================
    // 判断是否是数字
    isNumber(value) {
        // isNaN()函数 把空串 空格 以及NUll
        if (value === null || value === '') {
            return false
        }
        return !isNaN(value)
    },

    // 小写转大写
    toChineseNum(AlboNum) {
        const cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖') // 汉字的数字
        const cnIntRadice = new Array('', '拾', '佰', '仟') // 基本单位
        const cnIntUnits = new Array('', '万', '亿', '兆') // 对应整数部分扩展单位
        // const cnDecUnits = new Array('角', '分', '毫', '厘') // 对应小数部分单位
        // var cnInteger = "整"; //整数金额时后面跟的字符
        const cnIntLast = '' // 整型完以后的单位
        const maxNum = 999999999999999.9999 // 最大处理的数字

        let IntegerNum // 金额整数部分
        let DecimalNum // 金额小数部分
        let ChineseStr = '' // 输出的中文金额字符串
        let parts // 分离金额后用的数组，预定义
        if (AlboNum === '/' || AlboNum === '／') {
            return '／'
        }
        if (AlboNum === '') {
            return ''
        }
        if (isNaN(AlboNum)) {
            return '／'
        }
        AlboNum = parseFloat(AlboNum)
        if (AlboNum >= maxNum) {
            alert('超出最大处理数字')
            return ''
        }
        if (AlboNum === 0) {
            // ChineseStr = cnNums[0]+cnIntLast+cnInteger;
            ChineseStr = cnNums[0] + cnIntLast
            // document.getElementById("show").value=ChineseStr;
            return ChineseStr
        }
        AlboNum = AlboNum.toString() // 转换为字符串
        if (AlboNum.indexOf('.') === -1) {
            IntegerNum = AlboNum
            DecimalNum = ''
        }
        else {
            parts = AlboNum.split('.')
            IntegerNum = parts[0]
            DecimalNum = parts[1].substr(0, 4)
        }
        // 获取整型部分转换
        if (parseInt(IntegerNum, 10) > 0) {
            let zeroCount = 0, IntLen = IntegerNum.length
            for (let i = 0; i < IntLen; i++) {
                let n = IntegerNum.substr(i, 1),
                    p = IntLen - i - 1,
                    q = p / 4,
                    m = p % 4
                if (n === '0') {
                    zeroCount++
                }
                else {
                    if (zeroCount > 0) {
                        ChineseStr += cnNums[0]
                    }
                    zeroCount = 0 // 归零
                    ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
                }
                if (m === 0 && zeroCount < 4) {
                    ChineseStr += cnIntUnits[q]
                }
            }
            ChineseStr += cnIntLast
            // 整型部分处理完毕
        }
        // 小数部分
        if (DecimalNum !== '') {
            ChineseStr += '点'
            for (let i = 0, decLen = DecimalNum.length; i < decLen; i++) {
                let n = DecimalNum.substr(i, 1)
                // if( n != '0' ){
                // ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
                ChineseStr += cnNums[Number(n)]
                // }
            }
        }
        if (ChineseStr === '') {
            // ChineseStr += cnNums[0]+cnIntLast+cnInteger;
            ChineseStr += cnNums[0] + cnIntLast
        }
        /* else if( DecimalNum == '' ){
                        ChineseStr += cnInteger;
                        ChineseStr += cnInteger;
                    } */
        return ChineseStr
    },

    // =================================== date 时间类别 =======================================

    /***
     *  获取几天前或者几天后的时间
     *
     * @param _date 可以是时间字符串形式, 也可以直接是Date类型
     * @param _day _day > 0 几天后, _day < 0 几天前
     * @returns {{year: string, month: *, date: *}}
     */
    getDiffDate(_date, _day) {
        let date, transDate, diff = this.isNumber(_day) ? _day : 0

        if (this.getType(_date) === 'DATE') {
            date = _date
        }
        else if (this.getType(_date) === 'STRING' ||
            this.getType(_date) === 'NUMBER') {
            date = new Date(_date)
            if (date === 'Invalid Date') {
                throw new Error('时间参数有误')
            }
        }

        if (diff >= 0) {
            transDate = new Date(date.getTime() + diff)
        }
        else if (diff < 0) {
            transDate = new Date(date.getTime() - Math.abs(diff))
        }

        let transYear = transDate.getFullYear(),
            transMonth = Number(transDate.getMonth()),
            transDay = Number(transDate.getDate())

        return {
            year: transYear.toString(),
            month: (transMonth + 1) < 10 ? '0' + (transMonth + 1) : transMonth + 1,
            date: transDay < 10 ? '0' + transDay : transDay
        }
    }

}
