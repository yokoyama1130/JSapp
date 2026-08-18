// エクスプレスを使えるようにする
const express = require("express");
// パスの設定ができるように取得しておく
const path = require("path");
// mongooseの取得
const mongoose = require("mongoose");
// モデルを使うために取得
const Campground = require("./models/campground");
const campground = require("./models/campground");

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

// 一覧画面のルーティング作成
app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
});

// キャンプ場新規作成フォームのルーティング作成
// :idを使うものよりも前にコード書かないとnewっていうidを探してしまうので注意が必要
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// リクエストが表示されるための魔法
// エクスプレスに対してフォームのリクエストをパースしてくださいってこと？？
app.use(express.urlencoded({extended: true}));
// 登録するルーティングを作成する
app.post("/campgrounds", async (req, res) => {
    // // 一旦どんな情報が返ってくるか確認 → OK!!!
    // res.send(req.body);
    // 新しくモデルを作成する
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});


// キャンプ場詳細画面のルーティング作成
app.get("/campgrounds/:id", async (req, res) => {
    // idから情報を取得してビューに渡せるようにする
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
});


app.listen(3000, () => {
    console.log("サーバー起動中!!!");
});
