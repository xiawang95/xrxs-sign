require("./index")
const express = require('express');
const schedule = require('node-schedule');
const webhookUtil = require('./utils/webhookUtil');
global.sign_config = require("./data/sign_config.json")
let d_2022 = require("./data/2022.json")


gl.info(" === script start ===");

//放假日管理
const Holiday = {
    scheduleConfig: {cron: "0 0 0 * * * *", desc: ""}, //每月更新
    data: {},
    update() {
        // todo

    },
    isOff() {
        //判断今天是否休假
        //数据源于https://github.com/tangyan85/GetHolidays
        //需要将非工作日（包括节假日（ day_type = 0）、周末（只要是周末，不管是否调休 day_type = 2））与工作日（ day_type = 1）区分开来，写入json文件
        let now = new Date();
        let year = now.getFullYear() + "";
        let month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1) + "";
        let day = now.getDate() < 10 ? "0" + now.getDate() : "" + now.getDate();
        if (year === "2022") {
            let dayObj = d_2022[year + month][year + month + day];
            if (dayObj !== 1) {
                gl.info("今日为节假日");
                return true;
            }
        } else {
            return this.isWeekend();
        }
    },
    getWeek() {
        return new Date().getDay() + (4 - new Date(1).getDay()); //加上偏移量
    },
    isWeekend() {
        let week = this.getWeek();
        return week === 0 || week === 6;
    },
    start() {
        schedule.scheduleJob(this.scheduleConfig.cron, () => {
            this.update();
        });
        gl.info("启用更新假日调度（" + JSON.stringify(this.scheduleConfig) + "）");
    }
}
//Holiday.start();

const Sign = {
    sign(user = {}) {
        if (!user.name || !user.token || !user.location) {
            gl.err("配置不能为空！")
            return;
        }
        if (Holiday.isOff()) {
            gl.info("节假日不打卡！")
            return;
        }
        __page.doSignRequest(user, (status, res) => {
            if (status === 200) {
                if (res.data) {
                    let data = res.data;
                    if (data.message == "成功") {
                        let text = `${user.name}打卡成功！ 时间为= ${data.data.clockTime}`
                        gl.info(text);
                        //webhook
                        webhookUtil.hooks(user.webhook || [], text)
                        return;
                    }
                    gl.err(data);
                }
            } else {
                gl.err(res);
            }
        })
    },
    foreachSign() {
        //打卡
        for (let i = 0; i < sign_config.userList.length; i++) {
            const user = sign_config.userList[i];
            Sign.sign(user);
        }
    },
    scheduleConfig: [
        {cron: "0 19 9 * * *", desc: "上班"},
        {cron: "0 52 18 * * *", desc: "下班"},
    ],
    signSchedule: [],
    start() {
        this.signSchedule.forEach(v => v.cancel())
        let schedule_list = [];
        this.scheduleConfig.forEach(value => {
            gl.info("启用打卡调度（" + JSON.stringify(value) + "）");
            schedule_list.push(schedule.scheduleJob(value.cron, this.foreachSign));
        })
        this.signSchedule = schedule_list;
    }
}


module.exports = {
    sign: Sign,
    holiday: Holiday,
}

