'use strict';

const os = require('os');
const nodeStatic = require('node-static');
const socketIO = require('socket.io');
//import UrlParser from "url"
const UrlParser = require('url');

const http = require('http');
const fs = require('fs');

const server_port = process.argv[2] ? parseInt(process.argv[2]) : 8000

var fileServer = new (nodeStatic.Server)('./web');
let serverApp = http.createServer((req, res) => {

    var urlObj = UrlParser.parse(req.url, true);

    if (urlObj.pathname.indexOf('/rest/') == 0) {
        //레스트 콜이면 
        var method = req.method;
        if (method == 'OPTIONS') { //post 처리 s
            method = req.headers['access-control-request-method'];
        }
        else {
        }
        // console.log(method);

        switch (method) {
            case 'GET':
                {
                    let header = {
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET',
                        'Access-Control-Max-Age': '1000',
                        "Access-Control-Allow-Headers": "*" //CORS 정책 허용  * 는 모두 허용 
                    }

                    if (urlObj.pathname == '/rest/hello') {
                        res.writeHead(200, header);
                        res.end(JSON.stringify({ r: 'ok',msg:'you say hello' }));

                    }
                    else {
                        res.writeHead(200, header);
                        res.end(JSON.stringify({ r: 'ok' }));
                    }
                }
                // process_get(req, res);
                break;
            case 'POST':
                // process_post(req, res);
                break;
        }
    }
    else {
        //정적웹 서비스 
        fileServer.serve(req, res);
    }

}).listen(server_port, () => {
    console.log(`'server start port ${server_port}'`)
});


