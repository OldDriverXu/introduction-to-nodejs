module.exports = function (opts) {
    var time = opts.time || 100;  //超时阈值 100ms

    // 返回一个中间件函数
    return function (req, res, next) {
        var timer = setTimeout(function () {
            console.log('\033[90m %s %s \033[39m \033[91m mis taking too long!\033[39m', req.method, req.url);
        }, time);

        var end = res.end;  // 缓存res.end

        // 重写res.end
        res.end = function (chunk, encoding) {
            res.end = end;  // 回复原始res.end
            res.end(chunk, encoding);  // 调用重写的方法
            clearTimeout(timer);  // 清除计时器
        };
        next();
    };
};
