# VertexAIを使った音声解説機能の追加

## 概要
現在のブロック崩しゲームでは、VertexAI（Gemini）を使用してテキストベースのゲーム解説を提供していますが、これを音声解説に拡張したいと考えています。ユーザーがより没入感のあるゲーム体験を得られるよう、リアルタイムの音声コメンタリー機能を実装します。

## 現在の状況
- ✅ VertexAI（gemini-1.5-flash-002）によるテキスト解説機能は実装済み
- ✅ 5秒間隔でキャンバス画像をキャプチャしてAI分析
- ✅ ゲーム状況に応じたテキストコメンタリー生成

## 提案する機能

### 1. 音声合成機能の追加
- **Google Cloud Text-to-Speech API**を使用してテキスト解説を音声に変換
- 日本語音声での自然な読み上げ
- 音声の速度・ピッチ調整オプション

### 2. フロントエンド音声再生機能
- Web Audio APIを使用した音声再生
- 音量調整コントロール
- 音声のON/OFF切り替えボタン
- 音声キューイング（前の音声が終わってから次を再生）

### 3. バックエンドAPI拡張
- 新しいエンドポイント: `/api/voice-commentary`
- テキスト解説を音声ファイル（MP3/WAV）に変換
- 音声ファイルのキャッシュ機能

## 実装計画

### Phase 1: バックエンド実装
- [ ] Google Cloud Text-to-Speech APIの有効化
- [ ] `requirements.txt`に`google-cloud-texttospeech`を追加
- [ ] 音声生成用の新しいAPIエンドポイント作成
- [ ] 音声ファイル保存用のディレクトリ設定

### Phase 2: フロントエンド実装
- [ ] 音声再生用のReactコンポーネント作成
- [ ] 音声コントロールUI（音量、ON/OFF）の実装
- [ ] 音声キューイングシステムの実装
- [ ] レスポンシブデザインでの音声コントロール配置

### Phase 3: 統合・最適化
- [ ] 音声とテキストの同期
- [ ] 音声ファイルのキャッシュ機能
- [ ] エラーハンドリングの強化
- [ ] パフォーマンス最適化

## 技術仕様

### バックエンド
```python
# 新しい依存関係
google-cloud-texttospeech==2.16.3

# 新しいAPIエンドポイント
@api.post("/voice-commentary")
def generate_voice_commentary(request):
    # テキスト解説を音声に変換
    # 音声ファイルを返却
```

### フロントエンド
```typescript
// 新しいコンポーネント
interface VoiceControlProps {
  isEnabled: boolean;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
}
```

### ディレクトリ構造の変更
```
backend/
├── shared-audio/          # 新規: 音声ファイル保存用
│   ├── commentary/
│   └── cache/
frontend/src/
├── components/            # 新規: コンポーネント分割
│   ├── VoiceControl.tsx
│   └── AudioPlayer.tsx
```

## 期待される効果
1. **ユーザーエクスペリエンスの向上**: 音声による没入感の向上
2. **アクセシビリティの改善**: 視覚障害者にも優しいゲーム体験
3. **マルチタスク対応**: 画面を見なくてもゲーム状況を把握可能
4. **エンターテイメント性の向上**: よりリアルなゲーム実況体験

## 考慮事項
- **レイテンシ**: 音声生成に時間がかかる可能性
- **コスト**: Text-to-Speech APIの使用料金
- **ブラウザ対応**: 各ブラウザでの音声再生互換性
- **ネットワーク**: 音声ファイルのダウンロード時間

## 代替案
1. **事前録音音声**: よく使われるフレーズを事前録音
2. **ローカル音声合成**: Web Speech APIのSpeechSynthesisを使用
3. **段階的実装**: まずは基本的な音声再生から開始

## 完了条件
- [ ] 音声解説がリアルタイムで再生される
- [ ] 音声コントロール（音量、ON/OFF）が正常に動作する
- [ ] 既存のテキスト解説機能に影響を与えない
- [ ] モバイルデバイスでも正常に動作する
- [ ] 適切なエラーハンドリングが実装されている

## 関連リソース
- [Google Cloud Text-to-Speech API](https://cloud.google.com/text-to-speech)
- [Web Audio API](https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API)
- [React Audio Player Libraries](https://github.com/topics/react-audio-player)

---

**優先度**: High  
**推定工数**: 2-3週間  
**担当者**: TBD  
**関連Issue**: なし