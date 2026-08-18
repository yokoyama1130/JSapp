// エクスプレスを使えるようにする
const express = require("express");
const app = express();
// パスの設定ができるように取得しておく
const path = require("path");

// ejsが使えるように設定する
app.set("view engine", "ejs");
// app.jsを基準としたviewsディレクトリを使うように設定
app.set("views", path.join(__dirname, "views"));


// 1個目のルートを追加しておく
app.get("/", (req, res) => {
    res.render("home");
});



app.listen(3000, () => {
    console.log("サーバー起動中!!!");
});
