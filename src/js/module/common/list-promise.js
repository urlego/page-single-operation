/**
 * @author rubyisapm
 */
import utility from 'ct-utility';
import Interface from 'common/interface';
export default {
    gameList(reqData){
        return Promise.resolve($.ajax({
            url: Interface.common.currencyAppList,
            cache: false,
            data: reqData
        })).then(res=> {
            res = utility.objTransfer.lowerKey(res);

            if (res.status) {
                return Promise.resolve(res.data);
            }
            return Promise.reject(res.message);
        });
    },
    gameTag(reqData){
        return Promise.resolve($.ajax({
            url: Interface.common.getTcyTagFatherList,
            cache: false,
            data: reqData
        })).then(res=> {
            res = utility.objTransfer.lowerKey(res);

            if (res) {
                return Promise.resolve(res);
            }
            return Promise.reject();
        });
    },
    versionList(reqData){
        return Promise.resolve($.ajax({
            url: Interface.common.getTcyVersion,
            cache: false,
            data: reqData
        })).then(res=> {
            res = utility.objTransfer.lowerKey(res);

            if (res) {
                return Promise.resolve(res);
            }
            return Promise.reject();
        });
    }
};
