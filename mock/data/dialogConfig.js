/**
 * @author rubyisapm
 */
module.exports = {
    '/api/config/getlist': {
        "Code": 0, // 0 正常，其他异常
        "Message": "错误信息(若有)",
        "Data": {
            "TotalCounts": 10, // 总数据条数
            "PageIndex": 1, // 实际返回的页码
            "PageData": [
                {
                    "ConfigId": 1, // 配置序号
                    "DialogType": 1, // 弹窗类型 1=登录弹窗；2=游戏弹窗；3=银子弹窗
                    "DialogTitle": "弹窗标题", // 弹窗标题
                    "DialogText": "弹窗内容", // 弹窗内容
                    "StartTime": 1503458104688, //开始时间(毫秒)
                    "StartTimeStamp": 1503458104688, //开始时间(毫秒)
                    "EndTime": 1503458104688, //结束时间（毫秒）
                    "EndTimeStamp": 1503458104688, //结束时间（毫秒）
                    "EffectStatus": 1, //生效状态 1=未生效；2=有效期内；3=已过期
                    "Status": 1 //启用状态 1=禁用 2=启用
                },
                {
                    "ConfigId": 1, // 配置序号
                    "DialogType": 1, // 弹窗类型 1=登录弹窗；2=游戏弹窗；3=银子弹窗
                    "DialogTitle": "弹窗标题", // 弹窗标题
                    "DialogText": "弹窗内容", // 弹窗内容
                    "StartTime": 1503458104688, //开始时间(毫秒)
                    "StartTimeStamp": 1503458104688, //开始时间(毫秒)
                    "EndTime": 1503458104688, //结束时间（毫秒）
                    "EndTimeStamp": 1503458104688, //结束时间（毫秒）
                    "EffectStatus": 1, //生效状态 1=未生效；2=有效期内；3=已过期
                    "Status": 1 //启用状态 1=禁用 2=启用
                }
            ]
        }
    },
    '/api/config/get': {
        "Code": 0, // 0 正常，其他异常,
        "Message": "错误信息(若有)",
        "Data": {
            "ConfigId": 1, // 配置序号
            "DialogType": 1, // 弹窗类型 1=登录弹窗；2=游戏弹窗；3=银子弹窗
            "DialogTittle": "弹窗标题", // 弹窗标题
            "DialogText": "弹窗内容", // 弹窗内容
            "DialogLevel": 2, // 弹窗等级 2=强制弹窗；5=非强制弹窗
            "ShowType": 1,   // 显示方式 1=只显示一次；2=每次都显示
            // "ConfirmBtnType": 1, // 确认按钮类型 1=无按钮；2=点击后停止；3=点击后继续；4=链接；5=功能缩写；6=游戏缩写
            // "ConfirmBtnName": "继续", //  确认按钮名称
            // "ConfirmBtnText": "www.baidu.com", //  确认按钮功能内容
            // by 黄薪静
            ConfirmBtn:{
                Name:'继续',
                ActionType:4,
                ActionContext:'www.baidu.com'
            }, // 不选时为null
            // "CloseBtnType": 1, //  关闭按钮类型 1=无按钮；2=点击后停止；3=点击后继续
            // "CloseBtnName": "取消", // 关闭按钮名称
            // by 黄薪静
            CloseBtn:{
                Type:2,
                Name:''
            },
            "StartTime": +new Date(),  //生效开始时间戳（毫秒）
            "EndTime": +new Date(),   // 生效结束时间戳（毫秒）
            "VersionLimit": true, //是否限制版本
            "HighVersion": "5.2.0",  // by 黄薪静 如果选择了最新版本，则需要自动适应到最新版本 和策划确认过了
            "LowVersion": "3.2.1",
            "ChennelLimit": 0,
            "ChennelWhiteList": "123456,456789,789123",
            "ChennelBlackList": "123456,456789,789123",
            "UserLimit": true,
            "UserList": "123456,456789,789123",
            "GameLimit": true,
            "TagList": ["tag1","tag2","tag3"], //  游戏标签列表
            "GameList": [
                {
                    "AppId": 1,
                    "GameName": "大天使之剑",
                    "PackageName": "DTSZJ"
                },
                {
                    "AppId": 2,
                    "GameName": "梦幻西游",
                    "PackageName": "MHXY"
                }
            ]
        }
    },
    "/api/config/Save": {
        "Code": 0, // 0 正常，其他异常
        "Message": "错误信息(若有)",
        "Data": null
    },
    "/api/config/ChangeStatus": {
        "Code": 0, // 0 成功，其他异常
        "Data": 0, // 这个不需要返回值
        "Message": "错误信息"
    },
    "/api/config/import": {
        "Code": 0, // 0 成功，其他异常
        "Data": "111111，222222，333333，444444，", // 解析后的信息
        "Message": "错误信息"
    }
};