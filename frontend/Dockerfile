# ビルドステージ
FROM node:22.15-alpine3.20 as build

# 作業ディレクトリを設定
WORKDIR /app

# パッケージ依存関係のコピーとインストール
COPY package*.json ./
RUN npm ci

# ソースコードをコピー
COPY . .

# プロダクションビルドを作成
RUN npm install

CMD ["npm", "start"]
