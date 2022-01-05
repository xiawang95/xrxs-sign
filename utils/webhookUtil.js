let httpUtil = require("./httpUtil")

//@see Server酱 https://sct.ftqq.com/login
const ftqq = (sckey = "", text = "") => {
    //https://sc.ftqq.com/xx.send?text=text
    let url = `https://sc.ftqq.com/${sckey}.send?text=${text}`
    httpUtil.fetchGet(url, {}).then((r) => {
        gl.info(r)
    })
}

const hook = (c, text) => {
    let {type} = c;
    if (type === "Server酱" && c.SCKEY) {
        ftqq(c.SCKEY, text);
    }
}


module.exports = {
    hooks(configs = [], text) {
        for (let c of configs) {
            try {
                hook(c, text)
            } catch (e) {
                console.error(e)
            }
        }
    }
}