/**
 * @author rubyisapm
 * 该模块用于管理项目中的所有常量
 *
 * 约定：
 * 1. 常量为一个数组，其中的每一项有两个key(key:常量的唯一标识; val:常量的描述)
 * 2. 常量的设置请遵循key val的形式，因为后面的统一方法中是读取数据的key val的。
 * 3. 常量必须有默认项，即'请选择'、'全部'、'不限'所在的项，并且保证在数组的第一项
 * 4. 模块支持的常量默认项兼容'请选择'、'全部'、'不限'三种
 *
 * 名词解释：
 * 静态常量: 前端静态写入的常量，如下面的auditStatus
 * 动态常量: 需要从后端获取的常量，如下面的portraitType
 *
 * 写法：
 * 常量全部写入到constConfig对象，如下面的auditStatus和portraitType。项目中的常量都放置在constConfig里面，请开发者根据项目自行加入
 *
 * 模块外部对常量的获取方式:
 * 1. 建议统一采用constConfig.getData进行获取
 * 2. 对于动态常量的获取，首先确保数据被请求到，请使用例如
 * constConfig.portraitType().then(function(){this.portraitTypeList=constConfig.getData('portraitType')})的方式获取并设置到自己的模块中。
 *
 * constConfig内的通用方法:
 * !!注意: 通用方法不需要开发者改写
 * 1. getData 获取一个常量
 * 2. getVal 获取一个常量的指定描述，如获取auditStatus中key为1的val值
 * 3. getKey 获取一个常量的指定key，如获取auditStatus中val为'审核通过'的key
 */
var constConfig = {
    //请保证第一项为默认项，默认项为除去定义常量后的默认选项，一般为'不限''全部''请选择'
    os: [{
        key: 0,
        val: '不限'
    }, {
        key: 1,
        val: 'android'
    }, {
        key: 2,
        val: 'ios'
    }],
    tagType: [{
        key: '',
        val: '不限'
    }, {
        key: 1,
        val: '经典游戏标签'
    }, {
        key: 2,
        val: '熟人游戏标签'
    }],
    gamePlayType: [{
        key: '',
        val: '不限'
    }, {
        key: 1,
        val: '经典游戏'
    }, {
        key: 2,
        val: '熟人游戏'
    }],
    appType: [{
        key: 0,
        val: '不限'
    }, {
        key: 1,
        val: '客户端'
    }, {
        key: 2,
        val: '脚本化'
    }],
    dialogType: [{
        key: 0,
        val: '不限'
    }, {
        key: 1,
        val: '登录弹窗'
    }, {
        key: 2,
        val: '游戏弹窗'
    }, {
        key: 3,
        val: '登录银子限额弹窗'
    }, {
        key: 4,
        val: '游戏银子限额弹窗'
    }],
    effectStatus: [{
        key: 0,
        val: '不限'
    }, {
        key: 1,
        val: '未生效'
    }, {
        key: 2,
        val: '有效期内'
    }, {
        key: 3,
        val: '已过期'
    }],
    status: [{
        key: 0,
        val: '不限'
    }, {
        key: 1,
        val: '已禁用'
    }, {
        key: 2,
        val: '已启用'
    }],
    showType: [{
        key: 0,
        val: '不限'
    }, {
        key: 1,
        val: '显示一次'
    }, {
        key: 2,
        val: '每次显示'
    }],
    confirmBtnActionType: [{
        key: 0,
        val: '不限'
    }, {
        key: 3,
        val: '链接'
    }, {
        key: 4,
        val: '功能缩写'
    }, {
        key: 5,
        val: '游戏缩写'
    }],
    closeBtnType: [{
        key: 0,
        val: '不限'
    }, {
        key: 2,
        val: '关闭停止'
    }, {
        key: 3,
        val: '关闭继续'
    }],
    dialogLevel: [{
        key: 0,
        val: '不限'
    }, {
        key: 2,
        val: '强制弹窗'
    }, {
        key: 3,
        val: '非强制弹窗'
    }],
    channelLimit: [{
        key: 0,
        val: '不限'
    }, {
        key: 1,
        val: '白名单'
    }, {
        key: 2,
        val: '黑名单'
    }],
    /**
     * 获取某个常量的数据
     * @param col String 需要获取的常量，如'auditStatus'
     * @param hasDef Boolean 返回的数据中是否需要带默认值，如'全部'/'不限'
     * @param def String 在hasDef为true时生效，此项指定默认值的描述，默认为'不限'；如果你需要默认值为'全部',请将参数def设置为'全部'
     */
    getData(col, hasDef = true, def = '不限'){
        let data;
        const that = constConfig;

        if (Array.isArray(that[col])) {
            data = JSON.parse(JSON.stringify(that[col]));
        } else if (Array.isArray(that[col].data) && that[col].data.length > 0) {
            data = JSON.parse(JSON.stringify(that[col].data));
        }

        if (!hasDef) {
            data = data.slice(1);
        } else if (def !== '不限') {
            data[0].val = def;
        }
        return data;
    },
    /**
     * 获取某个常量中指定key对应的val
     * @param col String 需要获取的常量，如'auditStatus'
     * @param key [js基础类型的数据] 指定需要获取val值对应的key值
     * @param def String 此项指定默认值的描述，默认为'不限'；如果你需要默认值为'全部',请将参数def设置为'全部'
     */
    getVal(col, key, def = '不限'){
        const data = constConfig.getData(col);
        const matchedItem = data.filter((item)=> {
            return item.key === key;
        });

        if (matchedItem[0].val === '不限' && (def === '请选择' || def === '全部')) {
            return def;
        }
        return matchedItem[0].val;
    },
    /**
     * 获取某个常量中指定val对应的key
     * @param col String 需要获取的常量，如'auditStatus'
     * @param val String 指定需要获取key值对应的val值
     */
    getKey(col, val){
        if (val === '请选择' || val === '全部') {
            val = '不限';
        }
        const data = constConfig.getData(col);
        const matchedItem = data.filter((item)=> {
            return item.val === val;
        });

        return matchedItem[0].key;
    }
};

export default constConfig;
