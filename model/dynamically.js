
//20块钱找零，零钱由1、2、5、10四种币值

var Dynamically = {}

Dynamically.money_input  = 18;

//可用的零钱面值
Dynamically.changes = [];

//下一次找零的面值
Dynamically.next = {};

//存放零钱方案
Dynamically.momey_chanes = {};

Dynamically.index = 0;

/****
 * 计算找零方案
 * //递归
 * 从最小的面值开始计算找零，在把总额减去能找开的钱，再进行余额的找零
 *
 * @param nSum
 * @param pData
 * @param nDepth
 * @constructor
 */
Dynamically.SegNum = function(nSum, pData, nDepth){
    if(nSum < 0){return;}
    if(nSum == 0){
        this.momey_chanes[this.index] = [];
        for(var j = 0; j < nDepth; j++){
            this.momey_chanes[this.index][j] = pData[j];
        }
        this.index++;
        return;
    }

    var i = (nDepth == 0 ? this.next[0] : pData[nDepth-1]);
    for(; i <= nSum;){
        pData[nDepth++] = i;
        this.SegNum(nSum-i,pData,nDepth);
        nDepth--;
        i = this.next[i];
    }
}

Dynamically.MakeChanges = function(money_input,changes,nLen){
    this.index = 0;
    this.momey_chanes = {};
    this.next[0] = changes[0];
    var i = 0;
    for(; i < nLen-1; i++) {
        this.next[changes[i]] = changes[i+1];
    }

    pData = new  Array();
    this.SegNum(money_input,pData,0);
    //console.log(momey_chanes);
    return this.momey_chanes;
}


module.exports = Dynamically;
