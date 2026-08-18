// ここはエクスプレスとは関係ないから、mongooseを再度取得する必要がある
// mongooseの取得
const mongoose = require("mongoose");
// このファイルはseedsの中に入っているので..で一個上げてモデルを指定する
const Campground = require("../models/campground");
// 使いたいダミーデータの取得
const cities = require("./cities");
// 使いたいダミーデータの取得2
const {descriptors, places} = require("./seedHelpers");

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

// ランダムな数字を作る関数
const sample = array => array[Math.floor(Math.random() * array.length)];

// テストデータを入れる処理
const seedDB = async () => {
    // 確認のためにすでに入れておいたデータの削除
    await Campground.deleteMany({});
    // // 全部消えているか確認するためにもう一度データを新しく入れる　→ 確認OK！！！
    // const c = new Campground({title: "オートキャンプ", description: "aaaaaa"});
    // await c.save();
    for (let i = 0; i < 50; i++) {
        // ランダムにデータを入れたいのでランダムなインデックスの変数を作る
        // citiesには300個くらいデータがあるので、randomCityIndexには0~300の数字が入るようにする
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        // ランダムな数字を使って新しいインスタンスを作る
        const camp = new Campground({
            location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title: `${sample(descriptors)}・${sample(places)}`
        });
        await camp.save();
    };
};

// seedDBを実行するようにするのと、抜けるようにする
seedDB().then(() => {
    mongoose.connection.close();
});