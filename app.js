App({
    onLaunch: function() {},
    globalData: {
        companyId: "",
        companyName: "",
        employeeId: "",
        employeeName: "",
        openId: "",
        accuracy: -1,
        altitude: -1,
        speed: -1,
        aMap: "22.573494:114.059592:29.0",
        mac: "ce:c8:4b:43:9c:4d",
        wifiName: "",
        signDistance: -1,
        token: "297c4da4a58fbb9541e76c0c67db78f364c6f7e502357971166062fdcaeaea2137326c0e0bb008a18d8404b79e4b6390fd5461e6d2649ee7df57f4",
        rootUrl: "https://mapi.xinrenxinshi.com",
        appKey: "wechat_mini_program",
        appSecret: "Q#M7uIzi^"
    },
    httpGetReq: function(t, a, e) {
        console.log("发起网络请求" + t, a);
        a = getApp().getHttpParamData(t, a);
        wx.request({
            url: getApp().globalData.rootUrl + t,
            data: a,
            header: {
                "content-type": "application/x-www-form-urlencoded",
                Accept: "application/json"
            },
            method: "GET",
            success: function(a) {
                return console.log("网络请求有结果了" + t, a), 200 == a.statusCode ? "function" == typeof e && e(!0, a.data) : "function" == typeof e && e(!1, a.statusCode);
            },
            fail: function(a) {
                return console.log("网络请求未收到服务器返回" + t, a), "function" == typeof e && e(!1, 9999);
            }
        });
    },
    httpPostReq: function(t, a, e) {
        a = getApp().getHttpParamData(t, a);
        getApp().httpUtil.fetchPost(getApp().globalData.rootUrl + t, a).then(r => e(r.status, r));
    },
    getHttpParamData: function(t, a) {
        let e = {
            ver: "1.1.0",
            appKey: getApp().globalData.appKey,
            nonce: "1"
        };
        for (let n in a) e[n] = a[n];
        return !e.token && (e.token = getApp().globalData.token), e.timestamp = new Date().valueOf(),
        e = getApp().addHttpSign(t, e);
    },
    addHttpSign: function(t, a) {
        let e = new Array();
        for (let n in a) e.push(n);
        e.sort();
        let o = t;
        e.forEach(function(t) {
            o += t += a[t];
        }), o += getApp().globalData.appSecret;
        let r = require("./utils/hmac-sha1.js").HmacSHA1(o, getApp().globalData.appSecret).toString(), i = getApp().hexStr2base64WithUrlEncode(r);
        return a.sign = i, a;
    },
    hexStr2base64WithUrlEncode: function(t) {
        for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", e = "", n = 0, o = 0, r = 0; r < t.length; ++r) {
            n = n << 4 | (t[r] >= "A" && t[r] <= "Z" ? t.charCodeAt(r) - 55 : t[r] >= "a" && t[r] <= "z" ? t.charCodeAt(r) - 87 : t.charCodeAt(r) - 48),
            (o += 4) >= 6 && (e += a[n >>> (o -= 6)], n &= ~(-1 << o));
        }
        o > 0 && (e += a[n <<= 6 - o]);
        var i = e.length % 4;
        if (i > 0) for (r = 0; r < 4 - i; ++r) e += "=";
        return e;
    },
    urlEncode: function(t) {
        return t = (t + "").toString(), encodeURIComponent(t).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+");
    },
    checkWifiSignStatus: function(t, a) {
        let e = !1;
        wx.startWifi({
            success: function(n) {
                wx.getConnectedWifi({
                    success: function(n) {
                        return getApp().globalData.mac = n.wifi.BSSID, getApp().globalData.wifiName = n.wifi.SSID,
                        t.find(function(t) {
                            t.toLowerCase().substr(0, 14) == n.wifi.BSSID.toLowerCase().substr(0, 14) && (e = !0);
                        }), "function" == typeof a && a(e, n.wifi.SSID, n.wifi.BSSID);
                    },
                    fail: function(t) {
                        return getApp().globalData.mac = "", getApp().globalData.wifiName = "", "function" == typeof a && a(!1, "", "");
                    }
                });
            },
            fail: function() {
                return getApp().globalData.mac = "", getApp().globalData.wifiName = "", "function" == typeof a && a(!1, "");
            }
        });
    },
    checkGpsSignStatus: function(t, a, e, n, o, r) {
        let i = 0;
        o.find(function(t) {
            e < t.limit && (i = e * t.android);
        }), 0 == i && (i = e);
        for (let c = -2, p = 0, u = 0; u < n.length; u++) {
            let l = n[u], f = getApp().getDistance(t, a, l.latitude, l.longitude) - l.distance - i;
            (-2 == c || f < c) && (c = f, p = u);
        }
        let s = n[p];
        return "function" == typeof r && r(s, c);
    },
    getDistance: function(t, a, e, n) {
        let o = t * Math.PI / 180, r = e * Math.PI / 180, i = Math.abs(o - r), c = Math.abs(a * Math.PI / 180 - n * Math.PI / 180), p = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(i / 2), 2) + Math.cos(o) * Math.cos(r) * Math.pow(Math.sin(c / 2), 2)));
        return p *= 6378.137, p = Math.round(1e4 * p) / 10;
    },
    transformDistance: function(t) {
        for (let a = Math.ceil(t), e = 1, n = a; n >= 10; ) e++, n /= 10;
        return e < 4 ? a + "m" : (a / 1e3).toFixed(1) + "km";
    }
});

module.exports = global.__app;