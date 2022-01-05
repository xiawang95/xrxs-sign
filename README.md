# 薪人薪事自动打卡工具

[![auto-sign-task](https://github.com/liaoxiangyun/xrxs-sign/actions/workflows/auto-sign-task.yml/badge.svg)](https://github.com/liaoxiangyun/xrxs-sign/actions/workflows/auto-sign-task.yml)
[![star](https://img.shields.io/github/stars/liaoxiangyun/xrxs-sign.svg?logo=github)](https://github.com/liaoxiangyun/xrxs-sign)
[![license](https://img.shields.io/github/license/liaoxiangyun/xrxs-sign)](https://github.com/liaoxiangyun/xrxs-sign)

> 通过薪人薪事打卡小程序的 API 提交打卡 <br/>
> 低调使用😒.

## 实现功能

- [x] 每日8:31/18:31自动请求打卡
- [x] 自动判断节假日(2021年)，跳过打卡
- [x] Github Action 运行

## 配置参数

| 环境变量                 | 说明                | 值                  |
| ------------------------ | ------------------- | ------------------- |
| SIGN_NAME  | 用户名              | 张三           |
| SIGN_APPLET_TOKEN  | token                | xxxxxx              |
| SIGN_LOCATION   | 经纬度      | 22.573494:114.059592:29.0              |

## webhook

| 环境变量                 | 说明                | 值                  | 链接    |
| ------------------------ | ------------------- | ------------------- | ------------------- |
| WEBHOOK_FTQQ_SCKEY   | SCKEY      | xxxxxxxxxx              | [Server酱](https://sct.ftqq.com/login)

## 构建

- 推荐使用 Node.js 12 及以上的运行/构建当前项目
- 可选 Github Actions / 命令行 两种方式运行

## Github Actions 部署

- fork 本项目
- 将环境变量参数填到 Setting -> Secrets (参数必填)
- 开启 actions (默认`actions`处于禁止状态)
- 执行 auto-sign-task workflow

## 命令行运行

```
git clone https://github.com/liaoxiangyun/xrxs-sign.git
cd xrxs-sign
npm install
npm run run

或者使用forever
npm install -g forever
forever start run.js
```


😒😒😒😒😒😒😒😒😒😒😒😒😒😒😒😒😒😒😒
