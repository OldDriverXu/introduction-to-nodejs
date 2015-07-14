var os = require('os');
var leak_buf_ary = [];
var show_memory_usage = function(){ //打印系统空闲内存
    console.log('free mem : ' + Math.ceil(os.freemem()/(1024*1024)) + 'mb');
}

var do_buf_leak = function(){
    var leak_char = 'l'; //泄露的几byte字符
    var loop = 100000;//10万次
    var buf1_ary = []
    while(loop--){
        buf1_ary.push(new Buffer(4096)); //申请buf1，占用4096byte空间，会得到自动释放

        //申请buf2，占用几byte空间，将其引用保存在外部数据，不会自动释放
        //*******
        // leak_buf_ary.push(new Buffer(loop+leak_char));
        //*******
    }
    console.log("before gc")
    show_memory_usage();
    buf1_ary = null;
    return;
}


console.log("process start")
show_memory_usage()
do_buf_leak();

var j =10000;
setInterval(function(){
    console.log("after gc")
    show_memory_usage()
},1000*60)
