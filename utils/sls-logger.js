module.exports = {
    sendLog: function(e) {
        e.APIVersion = "0.6.0", wx.getSystemInfo({
            success: function(n) {
                e.brand = n.brand, e.model = n.model, e.pixelRatio = n.pixelRatio, e.screenData = n.screenWidth + "*" + n.screenHeight, 
                e.windowData = n.windowWidth + "*" + n.windowHeight, e.benchmarkLevel = n.benchmarkLevel, 
                e.language = n.language, e.wxVersion = n.version, e.system = n.system, e.platform = n.platform, 
                e.fontSizeSetting = n.fontSizeSetting, e.wxSDKVersion = n.SDKVersion, e.locationAuthorized = n.locationAuthorized, 
                e.locationEnabled = n.locationEnabled, e.wifiEnabled = n.wifiEnabled, e.locationReducedAccuracy = n.locationReducedAccuracy;
            },
            complete: function() {
                wx.request({
                    url: "https://xrxs-online.cn-beijing.log.aliyuncs.com/logstores/mini_program/track",
                    data: e,
                    header: {
                        "content-type": "application/x-www-form-urlencoded",
                        Accept: "application/json"
                    },
                    method: "GET",
                    success: function(e) {},
                    fail: function(e) {}
                });
            }
        });
    }
};