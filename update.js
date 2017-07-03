var https = require('https');
var qs = require('querystring');
var fs = require('fs')

// Step1:项目的ID, https://luckyzune.com/Design/xxxx/edit可以查看projectID
var projectID = "341";
// Step2:编辑里面的图面文件位置
var imageFiles = [
    // {
    //     fiel:"",
    //     dstPath: "",
    // },
    {
        file: "1024/xgbackground.png",
        dstPath: "main",
        dstFile: "xgbackground1.png",
    },
    {
        file: "1136/gmbackground.png",
        dstPath: "main",
    },
    {
        file: "1136/mmbackground.png",
        dstPath: "main",
    },
];

var textFiles = [
    // {
    //     fiel:"",
    //     dstPath: "",
    // },    
    {
        file: "gitRefresh.bat",
        dstPath: "",
    },

];

var data = {
    ref: "master",
};//这是需要提交的数据  

var content = qs.stringify(data);

imageFiles.forEach(function (item, index) {

    var gitReq = {
        hostname: 'luckyzune.com',
        port: 443,
        path: '/api/v4/projects/' + projectID + '/repository/files/' + item.file + '?' + content,
        method: 'GET',
        headers: {
            'PRIVATE-TOKEN': 'fQ3fUZxEb6uAcGhhS3zr'
        }
    };

    imageDownload(gitReq, item, "binary")
});

textFiles.forEach(function (item, index) {

    var gitReq = {
        hostname: 'luckyzune.com',
        port: 443,
        path: '/api/v4/projects/' + projectID + '/repository/files/' + item.file + '?' + content,
        method: 'GET',
        headers: {
            'PRIVATE-TOKEN': 'fQ3fUZxEb6uAcGhhS3zr'
        }
    };

    imageDownload(gitReq, item, "text")
});

function imageDownload(gitReq, item, type) {
    gitReq.path = url_encode(gitReq.path);

    req = https.request(gitReq, function (res) {
        var datas = [];
        var size = 0;
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            datas.push(chunk);
            size += data.length;
        });
        res.on("end", function () {
            var info = JSON.parse(datas);
            var buff = new Buffer(info.content, 'base64');

            var dstPath = "";
            if(item.dstPath === undefined) {
                dstPath = 'assets/texture/';
            } else {
                dstPath = 'assets/texture/' + item.dstPath + '/';
            }
            
            fs.mkdir(dstPath, function (err) {
                // 目录存在
            });

            if (item.dstFile === undefined) {
                var writeStream = fs.createWriteStream(dstPath + info.file_name);
            } else {
                 var writeStream = fs.createWriteStream(dstPath + item.dstFile);
            }

            if (type === "binary") {
                writeStream.write(buff);
            } else {
                writeStream.write(buff.toString());
            }

        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}

function url_encode(url) {
    url = encodeURIComponent(url);
    url = url.replace(/\%3A/g, ":");
    url = url.replace(/\%2F/g, "/");
    url = url.replace(/\%3F/g, "?");
    url = url.replace(/\%3D/g, "=");
    url = url.replace(/\%26/g, "&");

    return url;
}
