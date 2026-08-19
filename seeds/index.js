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
        // 価格のランダムな数字
        const price = Math.floor(Math.random() * 2000) + 1000;
        // ランダムな数字を使って新しいインスタンスを作る
        const camp = new Campground({
            location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title: `${sample(descriptors)}・${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: "春はるは、あけぼの。やうやうしろくなりゆく山やまぎは、すこし明あかりて、紫むらさきだちたる雲くもの、細ほそくたなびきたる。夏なつは、夜よる。月つきのころはさらなり。闇やみもなほ、蛍ほたるの多おほく飛とびちがひたる。また、ただ一ひとつ二ふたつなど、ほのかにうち光ひかりて行いくも、をかし。雨あめなど降ふるも、をかし。秋あきは、夕ゆふ暮ぐれ。夕ゆふ日ひのさして、山やまの端はいと近ちかうなりたるに、烏からすの寝ねどころへ行いくとて、三みつ四よつ、二ふたつ三みつなど、飛とびいそぐさへあはれなり。まいて、雁かりなどのつらねたるが、いと小ちひさく見みゆるは、いとをかし。日ひ入いりはてて、風かぜの音おと、虫むしの音ねなど、はた、言いふべきにあらず。冬ふゆは、つとめて。雪ゆきの降ふりたるは、言いふべきにもあらず。霜しものいと白しろきも。またさらでも、いと寒さむきに、火ひなど急いそぎおこして、炭すみ持てわたるも、いとつきづきし。昼ひるになりて、ぬるくゆるびもていけば、火桶ひをけの火ひも、白しろき灰はひがちになりて、わろし。",
            price
        });
        await camp.save();
    };
};

// seedDBを実行するようにするのと、抜けるようにする
seedDB().then(() => {
    mongoose.connection.close();
});