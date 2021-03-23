let httpUtil = require("./utils/httpUtil")
global.App = function (data = {}) {
    global.__app = data;
    data.httpUtil = httpUtil;
}
global.Page = function (page = {}) {
    global.__page = page;
    page.setData = function (d = {}) {
        page.data = {...page.data, ...d};
    }
    page.selectComponent = function (id) {
        return {
            startAnimation: function () {
            },
            showDialog: function () {
            }
        }
    }
}
global.getApp = function () {
    return global.__app;
}
global.logs = [];
const Formatter = require("format-date-time");
const formatter_ = new Formatter('YYYY-MM-DD HH:mm:ss');
global.dateFormat = function (date) {
    return formatter_.parse(date);
}
global.gl = {
    info: function (str, level = "LOG") {
        let format = dateFormat(new Date());
        let msg = format + " " + level + "  " + str + "";
        console.log(msg);
        logs.unshift(msg.substring(0, msg.indexOf("\n") !== -1 ? msg.indexOf("\n") : msg.length));
    },
    err: function (str) {
        this.info("出错了： " + str, "ERR");
        throw new Error(str);
    }
}
global.log = function (str = "") {

}

const FormData = require('form-data');
global.wx = {
    request: function (data = {}) {
        let {url, header: headers} = data;
        console.log("=>request : url=" + data.url);
        console.log(data)
        let config = {
            headers: data.header
        }
        let fd = new FormData();
        for (let key in data.data) {
            fd.append(key, data.data[key])
        }

        httpUtil.fetchPost(data.url, data.data, config).then(function (response) {
            data.success(response);
        }).catch(function (error) {
            data.fail(error);
        });

    },
    showToast: function (data = {}) {
        console.log("=>showToast : title=" + data.title);
    },
    getSystemInfo: function () {

    }
}


require("./app");
require("./pages/index/index");