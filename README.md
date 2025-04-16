```sh
# サンプルコード実行
$ uv run main.py

# ブラウザで起動
$ uv run python -m pygbag .

- 暫く待つとゲーム画面が立ち上がる
http://localhost:8000/

# PyGame のサンプルゲーム起動
$ uv run python -m pygame.examples.aliens
```

### ruff によるコード整形
```sh
$ uv run ruff check . --fix
$ uv run ruff format .
```
