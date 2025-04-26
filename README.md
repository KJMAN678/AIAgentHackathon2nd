```sh
$ docker compose build --no-cache
$ docker compose up -d

http://127.0.0.1:8080/api/hello
http://127.0.0.1:3000
```

```sh
# 環境変数の設定.
$ export PROJECT_ID=HOGE_PROJECT_ID
$ export PROJECT_NUMBER=HOGE_PROJECT_NUMBER
$ export ZONE=asia-northeast1-a

# GC CLI でログイン 
$ gcloud auth login

# プロジェクトIDの設定
$ gcloud config set project $PROJECT_ID

$ export INSTANCE_NAMES=ai-game-vm

# Computer Engine の API を使えるようにする
$ gcloud services enable compute.googleapis.com

$ gcloud compute images list --project=$PROJECT_ID

$ gcloud compute machine-types list --zones=$ZONE

# Computer Engine の インスタンス作成
$ gcloud compute instances create $INSTANCE_NAMES \
    --zone=${ZONE} \
    --image-family=cos-121-lts \
    --image-project=cos-cloud

$ gcloud compute firewall-rules create allow-ssh \
  --allow tcp:22

# インスタンスにタグ名をつける
$ export TAG_NAME=webserver
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


