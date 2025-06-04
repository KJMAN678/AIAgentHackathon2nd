```sh
# GC CLI でログイン 
$ gcloud auth login
# プロジェクトIDの設定
$ export PROJECT_ID=HOGE_PROJECT_ID
$ export SERVICE_ACCOUNT_MAIL=HOGE_SERVICE_ACCOUNT_MAIL

$ export SERVICE_ACCOUNT_NAME=HOGE_SERVICE_ACCOUNT_NAME
$ gcloud config set project $PROJECT_ID

- Vertex AI と Cloud Storage API を有効にする
$ gcloud services enable aiplatform.googleapis.com
$ gcloud services enable storage.googleapis.com

$ gcloud auth application-default login

- .env ファイルをフォルダ直下に作成
$ touch .env

.env ファイルに下記を入力. HOGE はGCPのプロジェクトIDを入力する
PROJECT_ID=HOGE
SERVICE_ACCOUNT_MAIL=HOGE

- サービスアカウントキーの作成
$ gcloud iam service-accounts keys create service-account-key.json \
   --iam-account=${SERVICE_ACCOUNT_MAIL}
```

- package.json を修正
https://zenn.dev/toshi052312/articles/ffd026e96a8d97#6.-vite-%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E4%BF%AE%E6%AD%A3
```sh
  "scripts": {
    // 修正前
    "dev": "vite",
    // 修正後
    "dev": "vite --host",
```

```sh
$ npm install axios --prefix frontend

- CORS 対策

```

```sh
$ source ./docker_remake.sh
$ docker compose down
$ docker compose build
$ docker compose up -d

http://127.0.0.1:8080/api/hello
http://127.0.0.1:5173/
```

```sh
- バックエンド ruff によるコード整形
$ docker compose run --rm backend ruff check . --fix
$ docker compose run --rm backend ruff format .

- フロントエンド formatter の実行
$ npx prettier --write frontend --log-level warn
$ npx eslint --config frontend/eslint.config.js --fix frontend
```

```sh
# 環境変数の設定.
$ export PROJECT_ID=HOGE_PROJECT_ID
$ export PROJECT_NUMBER=HOGE_PROJECT_NUMBER
$ export ZONE=asia-northeast1-a

# GCE用のインスタンス名
$ export INSTANCE_NAMES=ai-game-vm
# GCE用のインスタンスのタグ名
$ export TAG_NAME=webserver

# GC CLI でログイン 
$ gcloud auth login

# プロジェクトIDの設定
$ gcloud config set project $PROJECT_ID

# Computer Engine の API を使えるようにする
$ gcloud services enable compute.googleapis.com

# GCE の自分のプロジェクトで使えるイメージの一覧を取得
$ gcloud compute images list --project=$PROJECT_ID

# GCE の特定のゾーン内で使える machine-types の一覧を表示
$ gcloud compute machine-types list --zones=$ZONE

# Computer Engine の インスタンス作成
$ gcloud compute instances create $INSTANCE_NAMES \
    --zone=${ZONE} \
    --image-family=cos-121-lts \
    --image-project=cos-cloud

# SSH接続用のファイアーウォール設定. 一度設定すれば二回目以降は不要
$ gcloud compute firewall-rules create allow-ssh \
  --allow tcp:22

# インスタンスにタグ名をつける
$ gcloud compute instances add-tags $INSTANCE_NAMES --tags=${TAG_NAME}

# 外部アクセスできるようにファイアーウォールを設定する
$ gcloud compute firewall-rules create allow-tcp-3000 \
  --direction=INGRESS \
  --priority=1000 \
  --network=default \
  --action=ALLOW \
  --rules=tcp:3000 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=${TAG_NAME}

# インスタンスに SSH接続する
$ gcloud compute ssh --project=${PROJECT_ID} --zone=${ZONE} $INSTANCE_NAMES
```

### インスタンス内で Git Clone -> Docker Comose で環境を立ち上げる
```sh
# git を使えるようにする
# git 用の設定のための環境変数
$ export GIT_USER_NAME=HOGE
$ export GIT_USER_EMAIL=HOGE

# git 用の設定
$ git config --global user.name $GIT_USER_NAME
$ git config --global user.email $GIT_USER_EMAIL

# GitHub に公開鍵を設定するため、公開鍵を作成する
$ ssh-keygen -t rsa -b 4096 -C git config --global user.email $GIT_USER_EMAIL

# 公開鍵の中身を確認
cat ~/.ssh/id_rsa.pub

- GitHub に公開鍵を登録する

# GitHub のリポジトリをクローンする
git clone --branch branch_name git_clone_url

# プロジェクトのディレクトリに移動
cd AIAgentHackathon2nd

# Docker で Docker Compose を実行する
$ docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd):$(pwd)" \
  -w "$(pwd)" \
  docker/compose:1.29.2 up
```

### VM の外部IP を元に下記URLに遷移すれば良い
http://VMの外部IP:3000

### 参考サイト
<!-- Verification test comment added by Devin -->
- [gcloud コンピューティングインスタンスの作成 by CLI](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create)
- [公開イメージからインスタンスを作成する](https://cloud.google.com/compute/docs/instances/create-vm-from-public-image?hl=ja)
- [使用可能なリージョンとゾーン](https://cloud.google.com/compute/docs/regions-zones?hl=ja)
- [OS名](https://cloud.google.com/compute/docs/images/os-details?hl=ja)
- [Image Family](https://cloud.google.com/compute/docs/images/image-families-best-practices?hl=ja)
- [compute instances にタグをつける](https://cloud.google.com/sdk/gcloud/reference/compute/instances/add-tags)
- [SSH アクセスするためのファイアーウォール設定](https://cloud.google.com/iap/docs/using-tcp-forwarding?hl=ja#preparing_your_project_for_tcp_forwarding)
- [VMへのSSH接続](https://cloud.google.com/compute/docs/gcloud-compute/common-commands?hl=ja#connecting)
- [SSH エラーのトラブルシューティング](https://cloud.google.com/compute/docs/troubleshooting/troubleshooting-ssh-errors?hl=ja)
- [Computer Engine から docker-compose する方法](https://cloud.google.com/compute/docs/images/image-families-best-practices?hl=ja)
- useEffect return に関数を設定するとクリーンナップ処理を行える
  - 公式ドキュメント
    - [useEffect](https://react.dev/reference/react/useEffect)
    - [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)
  - [useEffectのコールバック関数とcleanUp関数の実行タイミング、正しく説明できますか？](https://zenn.dev/yskn_sid25/articles/8a19f36bbcc914)
  - [【useEffect】クリーンアップ処理がなぜ必要なのか体感したい方へ(具体的なコードを交えて説明)](https://qiita.com/kaitoppp/items/36e2fc344cac17b6d5f5)

- [GCP サービスアカウントキーの作成](https://cloud.google.com/iam/docs/keys-create-delete?hl=ja)
  - サービスアカウントの作成画面でサービスアカウントを作成する
