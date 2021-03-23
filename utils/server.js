const axios = require("axios")
const express = require("express")
//api
const server = express();
const port = 3000;

server.get('/logs', (req, res) => {
    res.send(global.logs);
})
server.get('/updateConfig', (req, res) => {
    axios.get("https://raw.githubusercontent.com/liaoxiangyun/xrxs-sign/master/auto_sign.json", {}).then(r => {
        if (r.status === 200 && typeof r.data == "object") {
            if (r.data.version <= sign_config.version) return;
            sign_config = r.data;
            gl.info("更新配置成功！" + JSON.stringify(r.data))
            return;
        }
    })
    res.send("更新配置...");
})
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})