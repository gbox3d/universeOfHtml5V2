const fetch = require('node-fetch');


(async () => {
    let _res = await (await fetch(`http://redstar001.iptime.org:17390/hello?name=gbox`)).json()

    console.log(_res)

    _res = await (await fetch(`http://redstar001.iptime.org:17390/getTime`)).json()
    console.log(_res)

})()
