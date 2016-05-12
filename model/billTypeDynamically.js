/**
 * Created by web on 15-8-4.
 * 动态规划算法 完全背包问题--找零钱
 */

function MakeChangeDynamically( money, changes, changesUsed,  lastChange)
{
    changesUsed[0] = 0;
    lastChange[0] = changes[0];

    for (var dollars = 1; dollars <= money; dollars++)
    {
        // 至少可以全部最小的零钱来找零
        var minChangeCount = dollars;    //最小张数为1
        var newChange =  changes[0];   //最小的零钱

        for (var j = 0; j < changes.length; j++)
        {
            if (changes[j] > dollars)
            {
                continue; // 不能使用该数额来找零
            }
            // 如果使用这个数额来找所需要的数目更小
            if (changesUsed[dollars - changes[j]]*1 + 1 < minChangeCount)
            {
                minChangeCount = changesUsed[dollars - changes[j]] + 1;
                newChange = changes[j];
            }
        }
        changesUsed[dollars] = minChangeCount;
        lastChange[dollars] = newChange;
    }
}


/*var money=13;
//零钱排序
var changes=[2,5,7];
var changesUsed=[];
var lastChange=[];

MakeChangeDynamically( money,  changes,  changesUsed,  lastChange);*/
/*
 假设现在要找的数额为67，changes = { 1, 5, 10, 20, 50 }，
 changesUsed数组会保存从1到66之间的数值分别需要多少张零钱，
 在求解67的时候，会这样考虑：对于changes的每个数值，
 将67拆分为1+66，5+62，10+57，20+47，50+17，由于66、62、57、47、17这些值都已计算过，
 所以可以迅速得出对于67找零需要几张零钱；
 同时lastChange数组保存了从1到66之间的数值的最优解中，
 它们所使用的最后一张零钱是什么，这样回推过去，不但可以知道用几张零钱，
 还可以知道这些零钱的数额分别是什么。
 */
/*for(var key in changesUsed){
    console.log(key + ":"+changesUsed[key]);
}
console.log('------------------')
for(var key in lastChange){
    console.log(key + ":"+lastChange[key]);
}*/
//changesUsed
/*0:0
 1:1
 2:1
 3:2
 4:2
 5:1
 6:2
 7:1
 8:2
 9:2
 10:2
 11:3
 12:2
 13:3
 ------------------
 lastChange
 0:2
 1:2
 2:2
 3:2
 4:2
 5:5
 6:5
 7:7
 8:7
 9:2
 10:5
 11:2
 12:5
 13:5
* */

module.exports = MakeChangeDynamically;