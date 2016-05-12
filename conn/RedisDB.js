


var logger = require("../model/log4js_helper").helper;
var underscore = require("underscore");
var conf = require("../conf/setting");
var redis = require('redis');

var client = redis.createClient(conf.redis.port, conf.redis.host);

client.on('error',function(err){
    console.log("connect redis error... " + err);
    logger.writeErr(err);
});

var RedisDB = {};

/**
 * 手机注册
 * @param keyAndValue 格式: keyAndValue={key:"13051756105",value:"454lksdfsd"};
 * @param cb
 */

RedisDB.addandExpireString = function(keyAndValue,cb){
    RedisDB.isExists(keyAndValue.key,function(err,exist){
       if(err){
           console.log(err);
           logger.writeErr(err);
       } else {
           if(exist === 0){
               RedisDB.addKeyAndValue(keyAndValue,function(err,result){
                   cb(err,result);
               });
           }else if(exist ===1 ){
               RedisDB.updateExpire(keyAndValue.key,function(err,result){
                   cb(err,result);
               });
           }
       }
    });
};
/**
 * 添加键值对
 * @param keyAndValue
 * @param cb
 */
RedisDB.addKeyAndValue = function(keyAndValue,cb){
    client.set("phone"+keyAndValue.key,keyAndValue.value,function(err,res){
        if(err){
            console.log(err);
            cb(err);
        }else{
            RedisDB.updateExpire(keyAndValue.key,cb);
        }
    });
};
/**
 * 检测该手机号是否存在
 * @param phoneNum
 * @param cb
 */
RedisDB.isExists = function(phoneNum,cb){
    client.exists("phone"+phoneNum,function(err,exist){
        if(err){
            console.log(err);
            cb(err);
        } else {
            cb(err,exist);
        }
    });
};
/**
 * 更新过期时间
 * @param phoneNum 手机号
 * @param cb
 */
RedisDB.updateExpire = function(phoneNum,cb){
    client.expire("phone"+phoneNum,conf.phoneExpire,function(err,res){
        cb(err,res);
    });
};


/**
 * 获取字符串所有手机号
 */
RedisDB.getStringAllPhoneNumArr = function(cb){
    client.keys("phone*",function(err,result){
        if(err){
            console.log(err);
            cb(err);
        }else{
            var phoneNums=[];
            for(var i=0; i<result.length; i++){
                phoneNums.push(result[i].substr(5));
            }
            cb(err,phoneNums);
        }
    });
};

/**
 * 获取队列所有手机号
 * 队列名:bs_phone
 */
RedisDB.getListAllPhoneNumArr = function (cb) {
    client.lrange(["bs_phone",0,-1],function(err,allPhoneNum){
        cb(err,allPhoneNum);
    });
};
/**
 * 队列:左进右出
 * num :0->失败 ,大于等于1->成功;
 */
RedisDB.leftPush = function(member,cb){
    client.lpush("bs_phone",member,function(err,num){
        cb(err,num);
    });
};

/**
 * 弹出最右边一个手机号
 */
RedisDB.rightPop = function(cb){
    client.rpop("bs_phone",function(err,phoneNum){
        if(err){
            console.log(err);
            cb(err);
        }else{
            if(phoneNum != null){
                RedisDB.leftPush(phoneNum,function(err1,num){
                    if(err){
                        console.log(err1);
                        cb(err1);
                    }else{
                        if(num > 0){
                            cb(null,phoneNum);
                        }else{
                            cb("redis lpush err!");
                        }
                    }
                });
            }else{
                cb("网关空！");
            }
        }
    });
};

/**
 * 删除队列其中的一个
 */
RedisDB.delOnePhoneFromList = function(member,cb){
    client.lrem('bs_phone',0,member,function(err,num){
        cb(err,num);
    })
};

/**
 * 添加一个集合成员imei
 */
RedisDB.sadd = function(member,cb){
    client.sadd('bs_gatewayImei',member,function(err){
        cb(err);
    })
};

/**
 * 删除一个集合成员imei
 */
RedisDB.srem = function(member,cb){
    client.srem('bs_gatewayImei',member,function(err){
        cb(err);
    })
};
/**
 * 集合是否存在某成员
 */
RedisDB.sismember = function(member,cb){
    client.sismember('bs_gatewayImei',member,function(err,num){
        cb(err,num);
    })
};

function syncAndWarn(){
    syncString2List();
    warn();
}

function warn(){
    client.llen('bs_phone',function(err,num){
        if(err){
            console.log(err);
            logger.writeErr(err);
        }else{
            if(num<3){
                RedisDB.getListAllPhoneNumArr(function(err,listPhoneNum) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('phone count ='+num+' < '+conf.phoneWarnCount+' 临界值,报警!');
                        console.log("剩余手机号为:"+listPhoneNum);
                    }
                })
            }
        }
    })
}

function syncString2List(){
    //console.log("刷新网关...");
    RedisDB.getStringAllPhoneNumArr(function(err,stringPhoneNum){
        if(err){
            console.log(err);
        }else{
            RedisDB.getListAllPhoneNumArr(function(err,listPhoneNum){
                if(err){
                    console.log(err);
                }else{
                    var addPhoneNum =underscore.difference(stringPhoneNum,listPhoneNum);
                    var delPhoneNum =underscore.difference(listPhoneNum,stringPhoneNum);
                    if(addPhoneNum !=null && addPhoneNum.length > 0){
                        addPhoneNum.forEach(function(phone,i){
                            RedisDB.leftPush(phone,function(err,res){
                                if(err){
                                    console.log(err);
                                }else{
                                    if(res > 0){
                                        console.log(phone+" lpush ok!");
                                    }else{
                                        console.log(phone+" lpush err!");
                                    }
                                }
                            })
                        });
                    }

                    if(delPhoneNum !=null && delPhoneNum.length > 0){
                        console.log('delPhoneNum');
                        console.log(delPhoneNum);
                        delPhoneNum.forEach(function(phone,i){
                            RedisDB.delOnePhoneFromList(phone,function(err,num){
                                if(err){
                                    console.log(err);
                                }else{
                                    if(num > 0){
                                        console.log(phone+" rpop ok!");
                                    }else{
                                        console.log(phone+" rpop err!");
                                    }
                                }
                            })
                        });
                    }
                }
            })
        }
    })
}
/**
 * 定时任务
 */
setInterval(syncAndWarn,conf.phoneRefresh);
//刚打开执行一次
syncAndWarn();


//RedisDB.rightPop();
//var member =111666;
//RedisDB.leftPush(member);

//RedisDB.getListAllPhoneNumArr();

//队列：lpush和rpop


/*
var keyAndValue={key:"13051756105",value:"167777"};
RedisDB.addandExpireString(keyAndValue,function(err,result){
    if(err){
        console.log(err);
    }else{
        if(result === 1){
            console.log("成功!");
        }else if(result === 0){
            console.log("失败!")
        }
    }
});
*/

module.exports = RedisDB;