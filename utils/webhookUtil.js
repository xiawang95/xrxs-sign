let httpUtil = require("./httpUtil")
let sckey = process.env.WEBHOOK_FTQQ_SCKEY

//@see Server酱 https://sct.ftqq.com/login
const ftqq = (sckey = "", text = "") => {
    //https://sc.ftqq.com/xx.send?text=text
    gl.info("Server酱 webhook")
    text = encodeURIComponent(text)
    let url = `https://sc.ftqq.com/${sckey}.send?text=${text}`
    httpUtil.fetchGet(url, {}).then((r) => {
        gl.info(r)
    })
}


module.exports = {
    hooks(enable = false, text) {
        if (!enable) return;
        if (sckey) {
            ftqq(sckey, text)
        }
    }
}
