/**
 * 常用的工具函数
 *
 */
var crypto = require('crypto');
var logger = require("../model/log4js_helper").helper;
var MongoDBTool = require("../conn/MongoDBTool");

var commUtil={};
/**
 * 签名参数
 */
commUtil.signParamters=function(query_obj){
    var sign_str=commUtil.requestParametersSort(query_obj);
    return crypto.createHash('md5').update(sign_str,'utf8').digest('hex');
};

/**
 * 排序参数
 */
commUtil.requestParametersSort=function(query_obj){
    var arr = [];
    var sign_str='';
    for(var item in query_obj){
        if(item === 'sign'){
            continue;
        }
        arr.push(item);
    }
    arr.sort();
    for(var i= 0,l=arr.length; i<l; i++){
        sign_str+="&"+arr[i]+"="+query_obj[arr[i]];
    }
    return sign_str;
};

/**
 * 检查支付订单是否执行成功
 * @param item
 * @param cb
 */
commUtil.checkPayOk = function(item){
    var allBillCount=item.result.length;
    var currentCount=0;
    if(item.sms != null && item.sms !=''){
        for(var i=0; i<item.sms.length; i++){
            if(item.sms[i].status == 1){
                currentCount+=1;
            }else{
                return false;
                break;
            }
        }
    }

    if(item.pcgame != null && item.pcgame !=''){
        if(item.pcgame.status == 1){
            currentCount+=1;
        }else{
            return false;
        }
    }

    if(currentCount === allBillCount){
        //更新订单状态
        commUtil.updatePay(item.paylogid)
    }
};

commUtil.updatePay=function(paylogid){
    var updatePay={"key":{"_id":MongoDBTool.ObjectID(paylogid)},"set":{$set:{status:8}}};
    MongoDBTool.update("bs_payorderlog",updatePay,function(err,updateused) {
        if (err) {
            logger.writeErr(err);
        } else {
            console.log(paylogid+":此订单所有通道执行成功!");
        }
    });
};

/**
 * 获得所有通道数据缓存到全局变量中
 * @type {{}}
 */

commUtil.getCacheBillTypeRemain = function(cb){
    MongoDBTool.query("bs_billingtype_remain",{},function(err,queryRes){
        cb(err,queryRes);
    });
};







module.exports = commUtil;
