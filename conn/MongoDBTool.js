/**
 使用示例
 var user ={username:'chenxiaoji',age:6};
 MongoDBTool.query('bs_remian',{},function(err,result){
    console.log(result)
});
 //var collection = ('user');//表：user
 MongoDBTool.remove('bs_remian',{age:4},function(err,result){
    console.log(result)
});

 MongoDBTool.insert("bs_remian",user,function(err,result){

});
 var data= {"key":{username:'chenxiaoji'},"set":{$set:{age:90}}};

 MongoDBTool.update("bs_remian",data,function(err,result){
    console.log(result)
});

//利用objectId查询
 MongoDBTool.query("bs_payorderlog",{_id:MongoDBTool.ObjectID('55c9b277672e9faa6f292817')},function(err,result){
   console.log(result);
});

 */


var mongodb =require('mongodb');
var conf = require("../conf/setting");

var ObjectID = require("mongodb").ObjectID;

var server = new mongodb.Server(conf.mongo.host,conf.mongo.port, {auto_reconnect:true,poolSize:10});

var db = new mongodb.Db('billingsystem', server, {safe:true});

var MongoDBTool = {};

MongoDBTool.ObjectID = ObjectID;

//插入
MongoDBTool.insert = function(collection_name,data,callback){
    server = new mongodb.Server(conf.mongo.host,conf.mongo.port, {auto_reconnect:true});
    db = new mongodb.Db('billingsystem', server, {safe:true});
    db.open(function(err,client){
        if(err){
            callback(err);
        }else{
            client.collection(collection_name, function(err, collection){
                if(err){
                    callback(err);
                }
                collection.insert(data,{safe:true},function(err, result){
                    callback(err,result);
                });
            });
        }
    });
};

//查询
MongoDBTool.query = function(collection_name,data,callback){
    server = new mongodb.Server(conf.mongo.host,conf.mongo.port, {auto_reconnect:true});
    db = new mongodb.Db('billingsystem', server, {safe:true});
    db.open(function(err,client){
        if(err){
            callback(err);
        }else{
            client.collection(collection_name).find(data).toArray(function(err, result) {
                client.close();
                callback(err,result);
            });
        }

    });
};

//查询,带可选参数 var Mdata={"key":{},"opt":{sort: [[ctime,1]],limit:1, fields:{ctime:1}}};
MongoDBTool.queryOpt = function(collection_name,data,callback){
    server = new mongodb.Server(conf.mongo.host,conf.mongo.port, {auto_reconnect:true});
    db = new mongodb.Db('billingsystem', server, {safe:true});
    db.open(function(err,client){
        if(err){
            callback(err);
        }else{
            client.collection(collection_name).find(data.key,data.opt).toArray(function(err, result) {
                client.close();
                callback(err,result);
            });
        }

    });
};

/***
 *
 * @param collection_name
 * @param data
 *
 * var search =  {phoneNum:"13051756105"}
 *var skip = 1;
 *var limit = 3;
 *var data = {};
 *data.search = search;
 *data.skip = skip;
 *data.limit = limit;
 * @param callback
 */
MongoDBTool.queryByPage = function(collection_name,data,callback){
    server = new mongodb.Server(conf.mongo.host,conf.mongo.port, {auto_reconnect:true});
    db = new mongodb.Db('billingsystem', server, {safe:true});
    db.open(function(err,client){
        if(err){
            callback(err);
        }else{
            client.collection(collection_name).find(data.search).skip(data.skip).limit(data.limit).toArray(function(err, result) {
                client.close();
                callback(err,result);
            });
        }

    });
}

/***
 * 查询纵条数
 * @param collection_name
 * @param data
 * @param callback
 *
 *
 * var search =  {phoneNum:"13051756105"}
 *var skip = 1;
 *var limit = 3;
 *var data = {};
 *data.search = search;
 *data.skip = skip;
 *data.limit = limit;
 *
 */
MongoDBTool.queryCount = function(collection_name,data,callback){
    server = new mongodb.Server(conf.mongo.host,conf.mongo.port, {auto_reconnect:true});
    db = new mongodb.Db('billingsystem', server, {safe:true});
    db.open(function(err,client){
        if(err){
            callback(err);
        }else{
            client.collection(collection_name).find(data.search).count(false,function(err, result) {
                client.close();
                callback(err,result);
            })
        }

    });
}

/***
 *
 * @param collection_name
 * @param data
 * data= {"key":{username:'chenxiaoji'},"set":{$set:{age:90}}};
 * @param callback
 */
MongoDBTool.update = function(collection_name,data,callback){
    server = new mongodb.Server(conf.mongo.host,conf.mongo.port, {auto_reconnect:true});
    db = new mongodb.Db('billingsystem', server, {safe:true});
    db.open(function(err,client){
        if(err){
            callback(err);
        }else{
            client.collection(collection_name,{safe:true}, function(err, collection){
                if(err){
                    callback(err);
                }else{
                    collection.updateMany(data["key"],data["set"],{safe:true},function(err, result){
                        callback(err,result);
                    });
                }
            });
        }
    });
};

/***
 * 聚合的方法
 *
 * data是我们要查询的条件
 *
 * 1.在mongo的aggregate这个方法里面_id是不许要的一个参数
 * 2.$参数名，这是标识用某一个参数来做计算
 *
 * 例子：[{$match:{status:8}},{$group:{_id:"$appid",amount:{$sum:"$amount"}}}]
 *
 */
MongoDBTool.aggregate = function(collection_name,data,callback){
    server = new mongodb.Server(conf.mongo.host,conf.mongo.port, {auto_reconnect:true});
    db = new mongodb.Db('billingsystem', server, {safe:true});
    db.open(function(err,client){
        if(err){
            callback(err);
        }else{
            client.collection(collection_name).aggregate(data,function(err, result) {
                client.close();
                callback(err,result);
            })
        }

    });
}

//删除
MongoDBTool.remove = function(collection_name,data,callback){
    server = new mongodb.Server(conf.mongo.host,conf.mongo.port, {auto_reconnect:true});
    db = new mongodb.Db('billingsystem', server, {safe:true});
    db.open(function(err,client){
        if(err){
            callback(err);
        }else{
            client.collection(collection_name,{safe:true},function(err, conn){
                if(err){
                    callback(err);
                }else{
                    conn.remove(data,{safe:true},function(err, result){
                        callback(err,result);
                    });
                }
            });
        }
    });
};

module.exports = MongoDBTool;