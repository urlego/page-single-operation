/**
 * @author rubyisapm
 */
export default {
    objSlicer(obj, keys){
        var result = {};

        keys.map(key=>{
            result[key] = obj[key];
        });
        return result;
    }
};
