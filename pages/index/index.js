let a = getApp(), t = require("../../utils/varUtils"), e = require("../../utils/obtain-image-base64");

Page({
    data: {
        miniProgramVersion: "1.0.4",
        navigationbarHeight: 0,
        windowHeight: 800,
        changeCompanyIcon: "",
        officialAccountsOpenId: "",
        loginCode: "0213wx1w3zkI1W2Q822w36CmW533wx13",
        hasOpenId: !1,
        userInfo: {},
        hasUserInfo: !1,
        loginBanner: e.getLoginBanner(),
        department: "",
        avatarUrl: "",
        showVerifyDialog: !1,
        verifyMobile: "",
        isSigning: !1,
        needAutoSign: !1,
        attendancePlan: null,
        signGpsIcon: e.getSignGpsIcon(!1),
        signWifiIcon: e.getSignWifiIcon(!1),
        signGpsRemindText: "AI识别中",
        signWifiRemindText: "AI识别中",
        showType: 0,
        signOneWayTitle: "",
        signOneWayRemindText: "AI识别中",
        signEnable: !1,
        wifiStatus: !1,
        gpsStatus: !1,
        signWay: 0,
        canAppletsSign: !1,
        outsideUrl: "",
        outsideClockUrl: "",
        outsideVisiable: !1,
        outsideText: "",
        showSignDialog: !1,
        signIsSuccess: !1,
        signBanner: e.getSignResultBanner(!1),
        signMessage: "--:--",
        showLoadingDialog: !1,
        companyId: "",
        companyName: "",
        employeeId: "",
        employeeName: "",
        openId: "",
        aMap: "",
        mac: "",
        wifiName: "",
        accuracy: -1,
        altitude: -1,
        speed: -1,
        isAutoSign: !1,
        originType: 0
    },
    onLoad: function (t) {
        let i = this;
        this.setData({
            changeCompanyIcon: e.getChangeCompanyIcon()
        }), this.transferThirdIntentData(t), wx.getSystemInfo({
            success: function (a) {
                let t = wx.getMenuButtonBoundingClientRect(), e = 2 * (t.top - a.statusBarHeight) + t.bottom,
                    n = (a.windowHeight - e) * (750 / a.windowWidth);
                i.setData({
                    signActionAreaHeight: n - 578,
                    windowHeight: a.screenHeight,
                    navigationbarHeight: e
                });
            }
        }), this.doWechatLogin(), wx.startLocationUpdate({
            success: function (a) {
            },
            fail: function () {
                wx.showToast({
                    title: "开启定位失败，请确认给予了定位权限且打开了GPS",
                    icon: "none",
                    duration: 5e3
                }), i.setData({
                    signGpsRemindText: "定位失败"
                });
            }
        }), wx.onLocationChange(function (t) {
            a.globalData.aMap = t.latitude + ":" + t.longitude + ":" + t.accuracy, a.globalData.accuracy = t.accuracy,
                a.globalData.altitude = t.altitude, a.globalData.speed = t.speed, i.setData({
                aMap: t.latitude + ":" + t.longitude + ":" + t.accuracy,
                accuracy: t.accuracy,
                altitude: t.altitude,
                speed: t.speed
            }), null == i.data.attendancePlan ? console.log("还未获取到考勤方案") : 1 != i.data.attendancePlan.hasAttendancePlan ? console.log("未设置考勤方案，不用校验") : (null != i.data.attendancePlan.mac && i.data.attendancePlan.mac.length > 0 ? a.checkWifiSignStatus(i.data.attendancePlan.mac, function (a, t, e) {
                i.setData({
                    wifiStatus: a,
                    wifiName: t,
                    mac: e
                }), i.refreshSignStatus();
            }) : console.log("有考勤方案，但无Wi-Fi信息，不校验Wi-Fi"), 0 == i.data.attendancePlan.attendancePlaces.length ? console.log("有考勤方案，但无打卡地点，不校验GPS") : 0 == t.latitude && 0 == t.longitude ? i.setData({
                gpsStatus: !1,
                signGpsRemindText: "定位失败"
            }) : t.accuracy >= 500 ? i.setData({
                gpsStatus: !1,
                signGpsRemindText: "GPS信号极差"
            }) : a.checkGpsSignStatus(t.latitude, t.longitude, t.accuracy, i.data.attendancePlan.attendancePlaces, i.data.attendancePlan.signModifyList, function (t, e) {
                a.globalData.signDistance = e, i.setData({
                    gpsStatus: e < 0
                }), i.refreshSignStatus();
            }));
        });
    },
    onShareTimeline: function (a) {
        return this.sendShareDataToSls(a.from, "wxTimeline"), {
            title: "薪人薪事，一键打卡，方便快捷",
            path: "/pages/index/index?originType=2"
        };
    },
    onShareAppMessage: function (a) {
        return this.sendShareDataToSls(a.from, "wxAppMessage"), {
            title: "一键打卡，方便快捷",
            path: "/pages/index/index?originType=3",
            imageUrl: "../image/thumbnail_share_to_friend.png"
        };
    },
    transferThirdIntentData: function (a) {
        a && a.originType && (this.setData({
            originType: a.originType
        }), 1 != a.originType && 4 != a.originType || (this.setData({
            needAutoSign: !0
        }), setTimeout(function () {
            this.setData({
                needAutoSign: !1
            });
        }.bind(this), 5e3)));
    },
    doWechatLogin: function () {
        let t = this;
        wx.login({
            success: function (e) {
                console.log("doWechatLogin success:", e), t.setData({
                    loginCode: e.code
                });
                try {
                    let i = wx.getStorageSync("xrxs_sign_openId");
                    i ? (console.log("缓存中有非空openId", i), a.globalData.openId = i, t.setData({
                        hasOpenId: !0,
                        openId: i
                    }), t.loginByOpenId(i)) : (console.log("缓存中没有openId，展示登录组件，让用户自行点击授权手机号登录"), t.setData({
                        userInfo: {},
                        hasUserInfo: !1
                    }));
                } catch (a) {
                    console.log("缓存读取openId异常，展示登录组件"), t.setData({
                        userInfo: {},
                        hasUserInfo: !1
                    });
                }
            }
        });
    },
    updateWechatLoginCode: function () {
        let a = this;
        wx.login({
            success: function (t) {
                console.log("updateWechatLoginCode success:", t), a.setData({
                    loginCode: t.code
                });
            }
        });
    },
    getPhoneNumber: function (a) {
        console.log("getPhoneNumber", a), t.isEmpty(a.detail.iv) && t.isEmpty(a.detail.encryptedData) ? wx.showToast({
            title: "获取手机号失败，" + a.detail.errMsg,
            icon: "none",
            duration: 3e3
        }) : this.loginByMobile(a.detail.iv, a.detail.encryptedData);
    },
    loginByOpenId: function (t) {
        let e = this;
        console.log("本地有缓存，直接根据openId登录", "openId:" + t), this.showCustomLoading();
        let i = {
            openId: t
        };
        a.httpPostReq("/wechatMiniProgram/v1/getTokenByOpenId", i, function (a, t) {
            a ? e.transferWxUserInfo(t) : (e.dismissCustomLoading(), wx.showToast({
                title: "登录异常，请检查网络或稍后再试" + t,
                icon: "none",
                duration: 3e3
            }));
        });
    },
    loginByMobile: function (t, e) {
        let i = this;
        console.log("本地无缓存，根据code、iv,和encryptedData登录"), this.showCustomLoading();
        let n = {
            wechatOpenId: "",
            code: this.data.loginCode,
            iv: t,
            wechatMiniProgramOpenId: "",
            encryptedData: e
        };
        a.httpPostReq("/wechatMiniProgram/v1/login", n, function (a, t) {
            a ? i.transferWxUserInfo(t) : (i.dismissCustomLoading(), wx.showToast({
                title: "登录异常，请检查网络或稍后再试" + t,
                icon: "none",
                duration: 3e3
            }));
        });
    },
    verifyMobileSuccess: function (a) {
        this.transferWxUserInfo(a.detail);
    },
    doSign: function () {
        this.data.signEnable && !this.data.isSigning && (this.setData({
            isSigning: !0
        }), this.doSignRequest());
    },
    doSignRequest: function ( user={}, callback) {
        let t = this;
        this.showCustomLoading();
        let e = {
            aMap: a.globalData.aMap,
            mac: a.globalData.mac,
            token: user.token
        };
        a.httpPostReq("/wechatMiniProgram/v1/sign", e, function (status, res) {
            t.dismissCustomLoading();
            callback(status, res);
            t.setData({
                needAutoSign: !1,
                isAutoSign: !1,
                isSigning: !1
            });
        });
    },
    transferWxUserInfo: function (e) {
        if (0 == e.code) {
            if (a.globalData.token = e.data.token, a.globalData.companyId = e.data.companyId,
                a.globalData.companyName = e.data.companyName, a.globalData.employeeId = e.data.employeeId,
                a.globalData.employeeName = e.data.name, this.setData({
                companyId: e.data.companyId,
                companyName: e.data.companyName,
                employeeId: e.data.employeeId,
                employeeName: e.data.name
            }), !t.isEmpty(e.data.openId)) {
                try {
                    wx.setStorageSync("xrxs_sign_openId", e.data.openId);
                } catch (a) {
                }
                a.globalData.openId = e.data.openId, this.setData({
                    openId: e.data.openId
                });
            }
            let i = "";
            i = t.isEmpty(e.data.departmentName) && t.isEmpty(e.data.jobName) ? "暂无部门和岗位信息" : t.isEmpty(e.data.jobName) ? e.data.departmentName : t.isEmpty(e.data.departmentName) ? e.data.jobName : e.data.departmentName + "-" + e.data.jobName,
                this.setData({
                    userInfo: e.data,
                    department: i,
                    hasUserInfo: !0,
                    hasOpenId: !0
                }), this.getAttendancePlan();
        } else if (2032 == e.code) this.dismissCustomLoading(), this.updateWechatLoginCode(),
            this.showVerifyDialog(e.data.mobile); else if (2006 == e.code) {
            this.dismissCustomLoading(), a.globalData.openId = "", this.setData({
                openId: "",
                companyId: e.data.companyId,
                companyName: e.data.companyName,
                employeeId: e.data.employeeId,
                employeeName: e.data.name
            });
            try {
                wx.setStorageSync("xrxs_sign_openId", "");
            } catch (a) {
            }
            this.setData({
                userInfo: {},
                hasUserInfo: !1
            }), wx.showToast({
                title: e.message,
                icon: "none",
                duration: 3e3
            });
        } else this.dismissCustomLoading(), this.updateWechatLoginCode(), wx.showToast({
            title: e.message,
            icon: "none",
            duration: 3e3
        });
    },
    showVerifyDialog: function (a) {
        console.log("首次使用员工端，需要验证身份"), this.setData({
            showVerifyDialog: !0,
            verifyMobile: a
        }), this.selectComponent("#verifyCodeDialog").showDialog();
    },
    getAttendancePlan: function () {
        let t = this, e = {};
        a.httpGetReq("/wechatMiniProgram/v1/getAttendancePlan", e, function (a, e) {
            t.dismissCustomLoading(), a ? 0 == e.code ? t.transferAttendancePlan(e.data) : wx.showModal({
                title: "提示",
                content: "获取考勤方案失败，" + e.message + "，请重试。",
                showCancel: !0,
                confirmText: "重试",
                success: function (a) {
                    a.confirm && t.getAttendancePlan();
                }
            }) : (t.dismissCustomLoading(), wx.showToast({
                title: "获取考勤方案异常，请检查网络或稍后再试" + e,
                icon: "none",
                duration: 3e3
            }));
        });
    },
    transferAttendancePlan: function (e) {
        let i = this, n = e.hasAttendancePlan, s = e.isFaceClock, o = e.clockWays, g = e.mac;
        e.attendancePlaces, e.signModifyList;
        this.setData({
            attendancePlan: e,
            outsideUrl: e.outsideUrl,
            outsideClockUrl: e.outsideClockUrl
        }), t.isEmpty(e.outsideClockUrl) ? t.isEmpty(e.outsideUrl) ? this.setData({
            outsideVisiable: !1
        }) : this.setData({
            outsideText: "外勤申请",
            outsideVisiable: !0
        }) : this.setData({
            outsideText: "外勤打卡",
            outsideVisiable: !0
        }), 1 != n ? (this.setData({
            showType: 0
        }), wx.showToast({
            title: "管理员未给您设置考勤方案",
            icon: "none",
            duration: 3e3
        })) : (this.transferSignWay(o, s), this.data.canAppletsSign && (2 != this.data.signWay && 3 != this.data.signWay || (console.log("macs", g),
            a.checkWifiSignStatus(g, function (a, t, e) {
                i.setData({
                    wifiStatus: a,
                    wifiName: t,
                    mac: e
                }), i.refreshSignStatus();
            }))));
    },
    transferSignWay: function (a, t) {
        let e = !1, i = !1;
        t ? (this.setData({
            canAppletsSign: !1,
            showType: 0
        }), wx.showToast({
            title: "您的打卡方案为人脸打卡\n小程序目前还不支持人脸打卡",
            icon: "none",
            duration: 3e3
        })) : (a.find(function (a) {
            1 == a ? e = !0 : 4 == a && (i = !0);
        }), e && i ? this.setData({
            signWay: 3,
            canAppletsSign: !0,
            showType: 1
        }) : e ? this.setData({
            signWay: 1,
            canAppletsSign: !0,
            showType: 2
        }) : i ? this.setData({
            signWay: 2,
            canAppletsSign: !0,
            showType: 2
        }) : (this.setData({
            canAppletsSign: !1,
            showType: 0
        }), wx.showToast({
            title: "管理员未给您设置打卡方案",
            icon: "none",
            duration: 3e3
        }))), this.transferSignWayData();
    },
    refreshSignStatus: function () {
        if (null != this.data.attendancePlan) {
            if (this.setData({
                signGpsIcon: e.getSignGpsIcon(this.data.gpsStatus),
                signWifiIcon: e.getSignWifiIcon(this.data.wifiStatus)
            }), this.data.wifiStatus ? this.setData({
                signWifiRemindText: "已连接公司Wi-Fi"
            }) : this.setData({
                signWifiRemindText: a.globalData.mac ? "未连接公司Wi-Fi" : "未识别到Wi-Fi"
            }), this.data.gpsStatus) this.setData({
                signGpsRemindText: "已进入考勤范围"
            }); else if (null != a.globalData.aMap) {
                if (a.globalData.signDistance > 0) {
                    let t = a.transformDistance(a.globalData.signDistance);
                    this.setData({
                        signGpsRemindText: "距考勤范围" + t
                    });
                }
            } else this.setData({
                signGpsRemindText: "AI分析中"
            });
            this.transferSignWayData(), this.setData({
                signEnable: this.data.wifiStatus || this.data.gpsStatus
            }), !this.data.isSigning && this.data.needAutoSign && (this.data.wifiStatus || this.data.gpsStatus) && (this.setData({
                isAutoSign: !0
            }), this.doSign());
        }
    },
    transferSignWayData: function () {
        1 == this.data.signWay ? this.setData({
            signOneWayTitle: "GPS",
            signOneWayRemindText: this.data.signGpsRemindText
        }) : 2 == this.data.signWay && this.setData({
            signOneWayTitle: "Wi-Fi",
            signOneWayRemindText: this.data.signWifiRemindText
        });
    },
    showSignDialog: function (a, t) {
        this.setData({
            showSignDialog: !0,
            signIsSuccess: a,
            signBanner: e.getSignResultBanner(a),
            signMessage: t
        }), this.selectComponent("#signDialog").showDialog();
    },
    changeCompany: function () {
        let a = this;
        wx.navigateTo({
            url: "/pages/company/company?navigationbarHeight=" + this.data.navigationbarHeight,
            events: {
                acceptDataFromOpenedPage: function (t) {
                    t.changeCompanyResult && (a.resetLocalData(), a.showCustomLoading(), a.transferWxUserInfo(t.changeCompanyResult));
                }
            }
        });
    },
    showCustomLoading: function () {
        this.setData({
            showLoadingDialog: !0
        }), this.selectComponent("#loadingDialog").startAnimation();
    },
    dismissCustomLoading: function () {
        this.setData({
            showLoadingDialog: !1
        });
    },
    resetLocalData: function () {
        this.setData({
            attendancePlan: null,
            signGpsIcon: e.getSignGpsIcon(!1),
            signWifiIcon: e.getSignWifiIcon(!1),
            signGpsRemindText: "AI识别中",
            signWifiRemindText: "AI识别中",
            showType: 0,
            signOneWayTitle: "",
            signOneWayRemindText: "AI识别中",
            signEnable: !1,
            wifiStatus: !1,
            gpsStatus: !1,
            signWay: 0,
            canAppletsSign: !1,
            outsideUrl: "",
            outsideClockUrl: "",
            outsideVisiable: !1,
            outsideText: ""
        }), a.globalData.aMap = "", a.globalData.mac = "", a.globalData.wifiName = "", a.globalData.signDistance = -1,
            this.setData({
                aMap: "",
                mac: "",
                wifiName: "",
                accuracy: -1,
                altitude: -1,
                speed: -1
            });
    },
    sendSignDataToSls: function (t, e) {
        let i = {
            __topic__: "e_signResult",
            code: t,
            msg: e,
            openId: a.globalData.openId,
            companyId: a.globalData.companyId,
            companyName: a.globalData.companyName,
            employeeId: a.globalData.employeeId,
            employeeName: a.globalData.employeeName,
            aMap: a.globalData.aMap,
            mac: a.globalData.mac,
            wifiName: a.globalData.wifiName,
            accuracy: a.globalData.accuracy,
            altitude: a.globalData.altitude,
            speed: a.globalData.speed,
            miniProgramVersion: this.data.miniProgramVersion,
            isAutoSign: this.data.isAutoSign,
            originType: this.data.originType
        };
        require("../../utils/sls-logger").sendLog(i);
    },
    sendShareDataToSls: function (t, e) {
        let i = {
            __topic__: "e_share",
            from: t,
            target: e,
            openId: a.globalData.openId,
            companyId: a.globalData.companyId,
            companyName: a.globalData.companyName,
            employeeId: a.globalData.employeeId,
            employeeName: a.globalData.employeeName,
            miniProgramVersion: this.data.miniProgramVersion,
            originType: this.data.originType
        };
        require("../../utils/sls-logger").sendLog(i);
    }
});

module.exports = __page;