/**
 * 该模块主要用于配置系统中的接口、链接等地址
 *
 * 其通过检测url中的顶级域名(如org / net)和端口号来判断系统当前所在的环境(测试版/预发版/正式版)
 * 根据环境的不同将需要改变的地址改变到对应环境中的地址
 *
 * 开发时请咨询后端开发，根据实际情况进行判断环境(环境判断逻辑可修改，!!!请注意)
 *
 */

//开发：tcysys2.admin.ct108.org:5505
//测试、内测：tcysys.admin.ct108.org:1505
//预发：tcyapp.admin.ct108.net:8001
//正式：tcyapp.admin.ct108.net
import utility from 'ct-utility';
var getEnv = function() {
    let env = '';
    const port = location.port;
    const tdl = location.host.split('.').slice(-1)[0].split(':')[0];

    if (tdl === 'net' && port === '2505') {
        env = 'pre';
    } else if (tdl === 'net') {
        env = 'official';
    } else if (tdl === 'org' && port === '1506'){
        env = 'dev';
    } else {
        env = 'test';
    }
    return env;
};
var base = {
    common: {
        getTcyVersion: 'http://tcysys.admin.ct108.net/ModelRule/GetTcyVersion',
        getTcyTagFatherList: 'http://tcysys.admin.ct108.net/TcyTag/GetTcyTagFatherList',
        currencyAppList: 'http://tcysys.admin.ct108.net/newapp/CurrencyAppList',
        importChannel: '/api/Common/ImportChannel',
        importUser: '/api/Common/ImportUserId'
    },
    dialogConfig: {
        getList: '/api/config/getlist',
        getInfo: '/api/config/get',
        update: '/api/config/Save',
        updateStatus: '/api/config/ChangeStatus'
    }
};
var Interface = {
    dev: utility.base.extend(true, {}, base, {
        common: {
            getTcyVersion: 'http://tcysys2.admin.ct108.org:5505/ModelRule/GetTcyVersion',
            getTcyTagFatherList: 'http://tcysys2.admin.ct108.org:5505/TcyTag/GetTcyTagFatherList',
            currencyAppList: 'http://tcysys2.admin.ct108.org:5505/newapp/CurrencyAppList'
        }
    }),
    test: utility.base.extend(true, {}, base, {
        common: {
            getTcyVersion: 'http://tcysys.admin.ct108.org:1505/ModelRule/GetTcyVersion',
            getTcyTagFatherList: 'http://tcysys.admin.ct108.org:1505/TcyTag/GetTcyTagFatherList',
            currencyAppList: 'http://tcysys.admin.ct108.org:1505/newapp/CurrencyAppList'
        }
    }),
    pre: utility.base.extend(true, {}, base, {
        common: {
            getTcyVersion: 'http://tcysys.admin.ct108.net:8001/ModelRule/GetTcyVersion',
            getTcyTagFatherList: 'http://tcysys.admin.ct108.net:8001/TcyTag/GetTcyTagFatherList',
            currencyAppList: 'http://tcysys.admin.ct108.net:8001/newapp/CurrencyAppList'
        }
    }),
    official: utility.base.extend(true, {}, base, {
        common: {
            getTcyVersion: 'http://tcysys.admin.ct108.net/ModelRule/GetTcyVersion',
            getTcyTagFatherList: 'http://tcysys.admin.ct108.net/TcyTag/GetTcyTagFatherList',
            currencyAppList: 'http://tcysys.admin.ct108.net/newapp/CurrencyAppList'
        }
    })
};
var env = getEnv();

export default Interface[env];
