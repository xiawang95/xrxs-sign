require("./index")
const axios = require("axios")
const express = require('express');
const schedule = require('node-schedule');
let sign_config = require("./auto_sign.json")
let d_2021 = require("./data/2021.json")


gl.info(" === script start ===");

//放假日管理
const Holiday = {
    scheduleConfig: {cron: "0 0 0 * * * *", desc: ""}, //每月更新
    data: {},
    update() {
        // todo

    },
    isOff() {
        //判断今天是否休假 todo
        //数据源于https://github.com/tangyan85/GetHolidays
        //需要将非工作日（包括节假日（ day_type = 0）、周末（只要是周末，不管是否调休 day_type = 2））与工作日（ day_type = 1）区分开来，写入json文件
        let now = new Date();
        let year = now.getFullYear() + "";
        let month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1) + "";
        let day = now.getDate() < 10 ? "0" + now.getDate() : "" + now.getDate();
        let dayObj = d_2021[year + month][year + month + day];
        if (dayObj !== 1) {
            gl.info("今日为节假日");
            return true;
        }
        return false;
    },
    getWeek() {
        return new Date().getDay() + (4 - new Date(1).getDay()); //加上偏移量
    },
    isWeekend() {
        let week = this.getWeek();
        return week === 0 || week === 6;
    },
    start() {
        schedule.scheduleJob(this.cron, () => {
            this.update();
        });
        gl.info("启用更新假日调度（" + JSON.stringify(this.scheduleConfig) + "）");
    }
}
Holiday.start();

const Sign = {
    sign(now = new Date()) {
        if (Holiday.isOff()) {
            return;
        }
        //打卡
        for (let i = 0; i < sign_config.userList.length; i++) {
            const user = sign_config.userList[i];
            console.log("**************")
            __page.doSignRequest(user, (status, res) => {
                if (status === 200) {
                    if (res.data) {
                        let data = res.data;
                        if (data.message == "成功" && /^\d+:\d+$/.test(data?.data?.clockTime || "")) {
                            gl.info(`${user.name}打卡成功！ 时间为= ${data.data.clockTime}`);
                            return;
                        }
                        gl.err(data);
                    }
                } else {
                    gl.err(res);
                }
            })
        }
    },
    scheduleConfig: [
        {cron: "0 0 9 * * * *", desc: "上班"},
        {cron: "0 31 18 * * * *", desc: "下班"},
    ],
    signSchedule: [],
    start() {
        this.signSchedule.forEach(v => v.cancel())
        let schedule_list = [];
        this.scheduleConfig.forEach(value => {
            gl.info("启用打卡调度（" + JSON.stringify(value) + "）");
            schedule_list.push(schedule.scheduleJob(value.cron, this.sign));
        })
        this.signSchedule = schedule_list;
    }
}
Sign.start();


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


