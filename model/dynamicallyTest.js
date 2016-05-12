/**
 * Created by web on 15-9-26.
 */

var Dynamically = require('./dynamically');
var underscore = require("underscore");

var stat = new Date().getTime();

for(var i=0;i<10000;i++){

    var money = 50;
    var changes =  [2,10,15,30];

    var group = Dynamically.MakeChanges(money,changes,changes.length);

    var groupNum=underscore.size(group);

    console.log(groupNum);

}

console.log((new Date().getTime() - stat)/1000);

/*
 var money = 50;
 var changes = [1,2,4,5,6,8,10,15,30];
  time: 36.875 秒

 var money = 50;
 var changes = [2,4,5,6,8,10,15,30];
 time: 2.976

 var money = 50;
 var changes = [1,2,4.5,6,8,10];
 time: 36.692

 var money = 50;
 var changes = [2,4.5,6,8,10,15];
 time: 3.773

 var money = 50;
 var changes = [2,5,6,8,10,15];
 time: 1.384

 var money = 50;
 var changes = [1,2,3,4,5,6];
 time: 8.104秒

 var money = 50;
 var changes = [2,3,4,5,6];
 time: 0.683秒


 var money = 50;
 var changes = [1,2,3,4,5];
 time:40.48

 var money = 50;
 var changes = [1,2,3,4];
 time:15.021


var money = 50;
var changes = [1,3,4,5];
time:6.227秒

 var money = 50;
 var changes = [2,3,4,5];
 time: 2.862

*/

/*
 var money = 50;
 var changes = [1,2,3];
 time:3.145秒

var money = 50;
var changes = [2,3,5];
time:0.75秒

*/


/*
 var money = 50;
 var changes = [1,2];
 time:0.644

 var money = 50;
 var changes = [2,3];
 time:0.221


 var money = 50;
 var changes = [3,5];
 time: 0.093

* */