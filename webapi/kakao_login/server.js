/**
 * Created by gbox3d on 2014. 8. 15..
 */

import http from "http";
import { URL } from 'url';
import nodeStatic from "node-static"
import fetch from "node-fetch"

import YAML from 'yaml';
import fs from 'fs';

class CCoreApp {
    static version = [1, 0, 0];
    constructor({server_conf,client_id,client_secret,redirect_uri}) {

        this.port = server_conf.port
        this.fileServer = new (nodeStatic.Server)(server_conf.web_pub);
        // this.api_key = '42729699e847e0531758a0031b235b56'
        // this.client_secret = 'rna6kMXkqHfcdOfcwM1pn9ieRmv2pmnc'
        // this.redirect_uri = 'http://gears001.iptime.org:20180/rest/login'

        this.client_id = client_id
        this.client_secret = client_secret
        this.redirect_uri = redirect_uri

        this.httpServer = http.createServer(
            async (req, res) => {

                if (req.url.indexOf('/rest/') == 0) {
                    try {
                        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        console.log(`remote address (${ip})`);
                    }
                    catch (e) {
                        console.log(e);
                    }

                    var method = req.method;
                    if (method == 'OPTIONS') { //post 처리 
                        method = req.headers['access-control-request-method'];
                    }
                    else {
                    }

                    switch (method) {
                        case 'GET':
                            // console.log(this.repos_path);
                            this.process_get(req, res)
                            break;
                        case 'POST':
                            // console.log(this.repos_path);
                            // (process_post.bind(this))(req, res);
                            this.process_post(req, res);
                            break;
                    }
                }
                else {
                    //정적웹 서비스 
                    // console.log('static web ' )
                    this.fileServer.serve(req, res);
                }
            }
        );

        //start http server
        this.httpServer.listen(this.port);

        console.log(`version : ${CCoreApp.version[0]}  web port : ${this.port} `);
    }
    //get 처리 해주기
    async process_get(req, res) {
        //  var result = UrlParser.parse(req.url,true);
        let urlObj = new URL(
            req.url, // url이 상대적인 경로일경우(path만존재) 두번째 인자인 base url을 꼭 지정해주어야한다.
            'http://example.org/' //base url (The base URL to resolve against if the input is not absolute.)
        )
        //크로스 도메인 무시
        let header = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Max-Age': '1000'
        };

        switch (urlObj.pathname) {
            case '/rest/getSettings':
                {
                    header['Content-Type'] = 'text/plain';
                    res.writeHead(200, header);

                    let _settings = YAML.parse(fs.readFileSync('./settings.yaml', 'utf8'))

                    res.end(
                        JSON.stringify({ result: 'ok',content : _settings  })
                    );
                }

                break;
            case '/rest/login':

                let _code = urlObj.searchParams.get('code')

                let _err_code = urlObj.searchParams.get('error')

                if (!_err_code) {
                    console.log(`success get auth code : ${_code}`);
                    let _body = `grant_type=authorization_code&client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&code=${_code}&client_secret=${this.client_secret}`

                    console.log(_body)

                    let _res = await (await (fetch('https://kauth.kakao.com/oauth/token', {
                        method: 'POST',
                        body: _body,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }

                        // body: `grant_type=authorization_code\r\ncode=${_code}`
                    }))).json();

                    console.log(_res)
                }
                else {
                    console.log(`err : ${_err_code}`);
                }



                // console.log(_res);s

                header['Content-Type'] = 'text/plain';

                res.writeHead(200, header);

                res.end(
                    JSON.stringify({ result: 'ok' })
                );
                break;

            default:
                header['Content-Type'] = 'text/plain';
                res.writeHead(200, header);
                res.end(JSON.stringify({
                    result: 'ok',
                    msg: 'it is http server ' + theApp.version
                }));
                break;
        }
    }

    //post 방식으로 처리하기
    async process_post(req, res) {

    }


}

// const settings_file = fs.readFileSync('./settings.yaml', 'utf8')
// let _settings = YAML.parse(fs.readFileSync('./settings.yaml', 'utf8'))

let app = new CCoreApp(YAML.parse(fs.readFileSync('./settings.yaml', 'utf8')));



