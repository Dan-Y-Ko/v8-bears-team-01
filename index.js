const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
//const mongoUtil = require("./services/mongoUtil");
const keys = require("./config/keys");
const authRoute = require("./routes/auth");
const projectRoute = require("./routes/projects");
const searchRoute = require("./routes/search");
const imageRoute = require("./routes/image");
const messageRoute = require("./routes/messages");

require("./models/User");
require("./models/Projects");
require("./services/passport");

//mongoUtil.connectToServer();
mongoose.connect(keys.mongoURI).catch(err => {
    console.log("error connecting to DB:", err);
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

authRoute(app);
projectRoute(app);
searchRoute(app);
imageRoute(app);
messageRoute(app);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(__dirname + "/client/build"));

    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);

setInterval(function() {
    https.get("https://damp-ocean-88180.herokuapp.com/");
}, 300000);
