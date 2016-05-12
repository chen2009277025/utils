/**
 * Created by chen on 15-7-1.
 */
/*数据库链接工具类*/

var mysql = require("mysql");

var conf = require("../conf/setting");
var DB_muiltyQuery = require("../model/DB_muiltyQuery");

var mysql_pool = mysql.createPool({
    host:conf.mysql.host,
    user:conf.mysql.username,
    password:conf.mysql.password,
    database:conf.mysql.database,
    port:conf.mysql.port
});

var DbTool = new Object();

//插入的方法
DbTool.insert = function(insertSql,callBack){

    mysql_pool.getConnection(function(err,conn){

        conn.query(insertSql,function(err,returnBack){
            if(err){throw err;}
            console.log(returnBack);
            if(callBack){
                callBack(err,returnBack);
            }
        });
        conn.release();
    })
}


//查询
DbTool.select = function(selectSql,callBack){

    mysql_pool.getConnection(function(err,conn){

        conn.query(selectSql,function(err,reSet){
            if(err){throw err;}
            if(callBack){
                callBack(err,reSet);
            }
        });
        conn.release();
    })
}

//删除
DbTool.delete = function(deleteSql,callBack){
    mysql_pool.getConnection(function(err,conn){
        conn.query(deleteSql,function(err,returnBack){
            if(err){throw err;}
            if(callBack){
                callBack(err,returnBack);
            }
        });
        conn.release();
    })
}
//更新函数
DbTool.update = function(updateSql,callBack){

    mysql_pool.getConnection(function(err,conn){
        conn.query(updateSql,function(err,result){
            if(err){throw err;}
            if(callBack){
                callBack(err,result);
            }
        });
        conn.release();
    })
}


 // 同步同时执行多条sql语句的方法
 // 传进来的sql值应该是这样的
 //var sqls = {
 //          "inserSql":"insert ***",
 //          "selectSql":"select ***",
 //          "selectSql2":"select ***",
 //          "deleteSql":"delete ***"
 //          }
 // return callBack 执行的结果由callBack带回

DbTool.execAll = function(sqls,callBack)
{
    mysql_pool.getConnection(function(err,conn) {
        conn.beginTransaction(function (err) {
            if (err) {
                console.log("这里打印了错误日志：" + err);
                // throw err;
            }
            return DB_muiltyQuery.query(sqls, conn, callBack);
        });
    });
}


module.exports = DbTool;
