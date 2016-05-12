/**
 * Created by chen on 15-8-17.
 */

var Transfer = require("./Transfer");
var server = http.createServer(function(req, resp) {
    var transfer = new Transfer(req, resp);
    var filePath = '/home/chen/下载/535e284a7bb1683779506d46.apk';
    transfer.Download(filePath);
});
server.listen('8000');