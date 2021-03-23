const action = require("./action")

action.sign.sign({
    name: process.env.SIGN_NAME,
    token: process.env.SIGN_APPLET_TOKEN,
    location: process.env.SIGN_LOCATION,
})
