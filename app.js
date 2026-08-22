// エクスプレスを使えるようにする
const express = require("express");
// パスの設定ができるように取得しておく
const path = require("path");
// mongooseの取得
const mongoose = require("mongoose");
// ejsのレイアウトを綺麗にするライブラリの取得
const ejsMate = require("ejs-mate");

// エラークラスを使うために取得
const ExpressError = require("./utils/ExpressError");

// モデルを使うために取得
const Campground = require("./models/campground");
const campground = require("./models/campground");
// putとかpacthとか使えるようにmethod-overrideを取得
const methodOverride = require("method-override");

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

// ejs-mateが使えるように設定する
app.engine("ejs", ejsMate);
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

//ミドルウェアを設定
// リクエストが表示されるための魔法
// エクスプレスに対してフォームのリクエストをパースしてくださいってこと？？
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

// 登録するルーティングを作成する
app.post("/campgrounds", async (req, res) => {
    // エラーハンドリング（Express 5では「本当にBodyが空」だと req.body が undefined になる）
    if (!req.body?.campground) throw new ExpressError("不正なキャンプ場のデータです", 400);
    // 非同期処理のエラーハンドリングは５からtry-catchしなくても良くなった
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

// キャンプ場の編集画面のルーティング作成
app.get("/campgrounds/:id/edit", async (req, res) => {
    // idから情報を取得してビューに渡せるようにする
    const campground = await Campground.findById(req.params.id);
    // テンプレートを指定して遷移先を指定（データは渡しておく）
    res.render("campgrounds/edit", { campground });
});

// 編集する処理
app.put("/campgrounds/:id", async (req, res) => {
    // // 一旦putリクエストが飛んでくるか確認 → OK
    // res.send("PUT!!!");
    // パラムズからidを取ってくる
    const { id } = req.params;
    // モデルを使って更新する（第二引数にどう編集するか設定する）
    // タイトルにはタイトル、ロケーションにはロケーションを入れるようにスプレット構文を使っている
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // リダイレクト先を設定
    res.redirect(`/campgrounds/${campground._id}`);
});

// 削除ルートの作成
app.delete("/campgrounds/:id", async (req, res) => {
    // パラムズからidを取ってくる
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});

// 全てのリクエストを対象にできるall
// 全てのパスを対象にできる*（Express 5では * 単体が使えない。/{*splat} を使う
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError("ページが見つかりませんでした", 404));
});

// 自分達のエラーハンドルミドルウェアを追加
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "問題が起きました" } = err;
    res.status(statusCode).send(message);
});

app.listen(3000, () => {
    console.log("サーバー起動中!!!");
});
