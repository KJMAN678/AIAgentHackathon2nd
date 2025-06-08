# ディレクトリ構成（※本記載は記入例です-プロジェクトに合わせて内容を更新してください-）

以下のディレクトリ構造に従って実装を行ってください：

```
/Users/koji/data/AIAgentHackathon2nd/
├── README.md # バックエンド/フロントエンド全体に影響する内容を記載するREADMEファイル.
├── backend/ # Python + Django + Django Ninja によるバックエンドのAPIディレクトリ
│   ├── Dockerfile # バックエンドのコンテナを作成
│   ├── README.md
│   ├── api/ # APIの実装を行うディレクトリ
│   │   ├── __init__.py
│   │   ├── admin.py # Django のAdmin画面に表示したいmodelを設定するファイル.
│   │   ├── api.py # Django Ninja による API
│   │   ├── apps.py # Django App 設定ファイル.
│   │   ├── migrations/ # Migration 設定用のディレクトリ.
│   │   │   └── __init__.py
│   │   ├── models.py # Django の model を設定するファイル.
│   │   ├── tests.py # テスト用のファイル.
│   │   └── urls.py # API の URL を設定するファイル.
│   ├── config/ # Django の環境設定ディレクトリ.
│   │   ├── __init__.py
│   │   ├── asgi.py # Djangoを ASGI 形式でデプロイするときに使う設定ファイル.
│   │   ├── settings.py # Django の環境設定ファイル.
│   │   ├── urls.py # Django の 各 app のURLを設定するファイル.
│   │   └── wsgi.py # Djangoを WSGI 形式でデプロイするときに使う設定ファイル.
│   ├── manage.py # Django の管理タスクのためのファイル.
│   ├── requirements.txt # バックエンドのライブラリとそのバージョンを管理するファイル
│   └── shared-images/ # フロントエンドのCANVASを画像として保存した後、バックエンドに共有するためのディレクトリ.
├── docker-compose.yaml # フロントエンドとバックエンドの Docker コンテナを作成する
├── docker_remake.sh # Docker環境を作り直すコマンドをまとめたスクリプト.
├── frontend/ # TypeScript + React + Vite によるフロントエンドのディレクトリ.
│   ├── Dockerfile # フロントエンドのコンテナを作成する Dockerfile.
│   ├── README.md # フロントエンド専用のREADMEファイル.
│   ├── eslint.config.js # フロントエンドのLinterである eslint 設定用のファイル.
│   ├── index.html # REACT が SPA 用に読み込んでいる HTMLファイル.
│   ├── node_modules/ # フロントエンド用のモジュールディレクトリ.
│   ├── package-lock.json # フロントエンドのモージュールを管理しているファイル.
│   ├── package.json # フロントエンドのモージュールを管理しているファイル.
│   ├── public/ # フロントエンド用の管理ソフトウェアである VITE のアイコンを保存しているディレクトリ.
│   │   └── vite.svg # フロントエンド用の管理ソフトウェアである VITE のアイコン画像.
│   ├── shared-images/ # フロントエンドのCANVASを画像として保存した後、バックエンドに共有するためのディレクトリ.
│   ├── src/ # フロントエンドのREACTの実装を格納するディレクトリ
│   │   ├── App.tsx # ブロック崩しゲーム用のCANVAS設定をしているファイル.
│   │   ├── Block.tsx # ブロック崩しゲーム用のブロックの設定を行うファイル.
│   │   ├── Draw.tsx # ブロック崩し用の画面演算を行うファイル.
│   │   ├── GameEngine.tsx # ブロック崩しの衝突判定を行っているファイル.
│   │   ├── keyHandler.tsx # ブロック崩しのキーボード入力を行っているファイル.
│   │   ├── main.tsx # REACT の mainファイル.
│   │   ├── style.css # Tailwind の初期設定を行っている CSSファイル.
│   │   └── vite-env.d.ts # VITE の設定ファイル
│   ├── tsconfig.app.json # TypeScript の設定ファイル.
│   ├── tsconfig.json # TypeScript の設定ファイル.
│   ├── tsconfig.node.json # TypeScript の設定ファイル.
│   └── vite.config.ts # フロントエンドの管理ツールである Vite の設定ファイル
```

### 配置ルール
- UIコンポーネント → `frontend/src`
- API関連処理 → `backend/api`
