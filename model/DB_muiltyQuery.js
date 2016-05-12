/**
 * Created by chen on 15-7-7.
 *
 *
 */
var DB_muiltyQuery = {};

DB_muiltyQuery.query = function(sqls,conn,callBack){
    var task = [];
    var funcs = [];

    //获得任务数组
    for(var key in sqls){
        task.push(key);
        var func = function(key,sql,callback){
            conn.query(sql,function (err, res) {
                if(err){
                    console.log("这里是方法内部打印错误日志"+err)
                    return conn.rollback(function() {
                        throw err;
                    });
                   // throw err;
                }
                var result = {key:key,data:res};
                callback(result);
            });
        }
        funcs.push(func);
    }
    //把callBack方法放到执行函数列表里面
    funcs.push(callBack);

    function rollExec(funcs,index,results){
        if(index == task.length){
            conn.commit(function(err) {
                if (err) {
                    return conn.rollback(function() {
                        throw err;
                    });
                }
                funcs[index](results);
                conn.release();
                return
            });
        }
        else{
            var sql = sqls[task[index]];
            funcs[index](task[index],sql,function(res){
                index++;
                results.push(res);
                rollExec(funcs,index,results);
            });
        }
    }
    rollExec(funcs,0,new Array());
};

module.exports = DB_muiltyQuery;