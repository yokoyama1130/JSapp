// エクスプレスを使えるようにする
const express = require("express");
// パスの設定ができるように取得しておく
const path = require("path");
// mongooseの取得
const mongoose = require("mongoose");
// モデルを使うために取得
const Campground = require("./models/campground");

// DBに接続
mongoose.connect('mongodb://localhost:27017/yelp-camp',
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        console.log("MongoDBコネクションOK!!!!");
    })
    .catch(err => {
        console.log("MongoDBコネクションエラー");
        console.log(err);
    });

// エクスプレスの実行
const app = express();


// ejsが使えるように設定する
app.set("view engine", "ejs");
// app.jsを基準としたviewsディレクトリを使うように設定
app.set("views", path.join(__dirname, "views"));


// 1個目のルートを追加しておく
app.get("/", (req, res) => {
    res.render("home");
});

// モデルが使えるか確認
app.get("/makecampground", async (req, res) => {
    const camp = new Campground({title: "私の庭", description: "気軽に安くキャンプ!!!"});
    await camp.save();
    res.send(camp);
});



app.listen(3000, () => {
    console.log("サーバー起動中!!!");
});
