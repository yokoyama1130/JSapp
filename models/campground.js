// mongooseの取得
const mongoose = require("mongoose");
// スキーマをよく使うのでスキーマという変数に入れておく
// こうすることでいちいちmongoose.schema.~って書かないでSchema.~って書けるようになる
const Schema = mongoose.Schema;

// スキーマ作成
const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

// このスキーマを使ってモデルを作成
// 他のファイルでも使えるようにエクスポーツしておく
module.exports = mongoose.model("Campground", campgroundSchema);
