# Mongoose With Express

Express、MongoDB（Mongoose）、EJSを使用したWebアプリケーションです。

## 使用技術

* Node.js
* Express
* MongoDB
* Mongoose v5
* EJS

## セットアップ方法

### 1. リポジトリをクローン

```bash
git clone リポジトリのURL
```

### 2. プロジェクトディレクトリへ移動

```bash
cd リポジトリ名
```

### 3. パッケージをインストール

```bash
npm install
```

`package.json`をもとに、Express、Mongoose、EJSなど必要なパッケージがインストールされます。

### 4. MongoDBを起動

ローカル環境のMongoDBを起動してください。

```bash
brew services start mongodb-community
```

### 5. アプリを起動

```bash
node app.js
```

ブラウザで以下のURLにアクセスします。

```text
http://localhost:3000
```
