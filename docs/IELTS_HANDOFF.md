# IELTS 対策ドリル 開発 指示メモ

TEAP 19日ドリル（https://taikiblizzard0923-source.github.io/teap-drill/ 、リポジトリ `taikiblizzard0923-source/teap-drill`）と同じ作り方で、
**IELTS の日ごとの対策ドリル**を作る。新しいチャットではこのメモと `docs/HANDOFF.md`（汎用化メモ）を読んでから始めること。

---

## 決まっていること（2026-11-23 時点）

- **モジュール：Academic**
- **受験：約2週間後（2026年12月7日ごろ）** → ドリルは**約14日分**。開始日と正確な受験日はユーザーに確認
- **現在 Overall 5.0 → 目標 5.5**（技能別のバンドは未確認）
- 問題のレベルは**バンド 5.0〜6.0 帯**（CEFR B1 中心）に合わせる。本番と同じ難しさの文章も使うが、★落とせない問題・解説・時間配分は「5.5 を確実に取る」ことに絞る（全問正解を狙わせない）
- 2週間と短いので、TEAP の19日版より絞る：新しい知識より**設問形式への慣れ・時間配分・取りこぼし防止**を優先。模試は2回程度（初日と後半）
- Overall は4技能の平均から決まる（丸め方は公式で確認）。短期間で上げやすいのは Listening・Reading なので、L・R で 0.5〜1.0 上げて Overall 5.5 に届かせる計画を基本にし、W・S は「型」と時間配分で取りこぼしを減らす
- **申込の確認**：2週間後に受けるには、その日程の試験に申込済みか、まだ申込できる必要がある。最初にユーザーに「申込済みか」を確認し、未申込なら公式サイトで日程・締切を確認するよう伝える

## 0. 最初にユーザーへ確認すること（番号付きの選択肢で聞く）

1. ~~モジュール~~（Academic で決定）
2. **正確な受験日**（申込済みか）と**開始日**、平日・休日の学習時間、時間が取れない日
3. **技能別の現在バンド**（分かれば）。目標は Overall 5.5（決定）。技能別の目標もあれば確認
4. **対象技能**：Listening・Reading だけか、Writing・Speaking も入れるか（2週間なので、L・R 中心＋W・S は型の確認だけ、などの案を出す）
5. **受験方式**：ペーパーかコンピューターか（解答の転記時間や画面操作の練習が変わる）
6. **使う端末**：TEAP と同じ iPad（iPadOS 18、claude.ai の Artifact は開けない）なら GitHub Pages で公開
7. **公開先**：新しい公開リポジトリ名（例 `ielts-drill`）。ユーザーに空の Public リポジトリを作ってもらい、`add_repo` で追加
8. 「〇〇の日」のテーマにする人・キャラクター（任意）と、公開ページに載せてよい呼び名（TEAP 公開版は呼び名なし）

## 1. IELTS が TEAP と違う点（エンジンの改修が必要）

試験の構成・時間・問題数・採点は **IELTS 公式サイト（ielts.org など）で必ず確認**してから仕様に書くこと（記憶で書かない）。
ネットワークで公式サイトが開けない場合は、ユーザーにホストの許可を依頼する（TEAP では eiken.or.jp を許可してもらった）。

主な違い（公式で確認すること）：
- **4択以外の設問形式が多い** → 問題の型を増やす
  - 記述（Form / Note / Table / Sentence / Summary completion、Short answer）：テキスト入力。語数制限（"NO MORE THAN TWO WORDS AND/OR A NUMBER"）、綴りの揺れ、大文字小文字、数字表記の正誤判定が必要
  - True / False / Not Given、Yes / No / Not Given：3択
  - Matching（headings、information、features、sentence endings）：プルダウン選択。選択肢が設問より多い／同じ選択肢を複数回使える場合がある
  - Multiple choice（1つ選ぶ／2つ選ぶ）
  - Map / Plan / Diagram labelling：図（SVG で自作）＋記号選択
- **採点はバンドスコア**：正答数（/40）→ バンドの換算表を公式の目安で用意し、セット結果・模試結果にバンドを表示
- **Listening**：4パート構成（日常会話 → 日常の説明 → 学術的な会話 → 講義）、音声は1回だけ。イギリス英語など複数のアクセント。設問の途中に「次のパートの設問を読む時間」がある
- **Reading**：長い文章3つに設問が並ぶ（Academic と General Training で文章の種類が違う）。1問あたりの時間が TEAP より短いので時間配分の練習が重要
- **Writing / Speaking**（対象にする場合）：自動採点はできない。課題・模範解答・採点基準（公式の Band Descriptors の観点）・自己チェックリスト・語数カウンター・タイマーを用意する。Speaking は質問の音声再生と録音（端末のマイクが使えない場合は、時間を計って声に出す練習にする）

## 2. データ形式（TEAP の SPEC.md からの拡張案）

`docs/SPEC.md` を元に、Item に `type` を追加する（既定は `"mc"`＝今の4択）。

```js
{ type: "mc",     q, choices: [...], a: 1 }                       // 1つ選ぶ（選択肢数は可変）
{ type: "mc2",    q, choices: [...], a: [0, 3] }                  // 2つ選ぶ（順不同で両方正解のみ得点、または1つ1点を公式に合わせる）
{ type: "tfng",   q, a: "NOT GIVEN", labels: ["TRUE","FALSE","NOT GIVEN"] }   // YES/NO/NOT GIVEN も labels で
{ type: "match",  q, options: ["i ...","ii ...", ...], a: 2 }     // セット共通の options を set.options に置いてもよい
{ type: "fill",   q, limit: "NO MORE THAN TWO WORDS AND/OR A NUMBER",
                  accept: ["library card", "a library card"], ex }  // 正解の表記ゆれを列挙。比較は小文字化・前後空白除去
{ type: "label",  q, a: "C" }                                      // 図のラベル（set.figure に SVG）
{ type: "write",  task: 1|2, prompt, minWords: 150|250, model, checklist: [...] }
{ type: "speak",  part: 1|2|3, questions: [...], cueCard, model, checklist: [...] }
```

- 記述問題の判定は **accept の完全一致（正規化後）＋語数制限チェック**。部分点は付けない。判定が厳しすぎる場合に備えて「自己判定で正解にする」ボタンを付ける
- Listening の記述問題は、音声中で綴りを読み上げる名前・数字・日付に注意してスクリプトと accept をそろえる
- セットに `instructions`（英語の本番どおりの指示）と `directions`（日本語の練習用説明）を両方持たせる
- `must.js`（★落とせない問題）、`audio.js`（音声）の仕組みはそのまま使う

## 3. 作る手順（TEAP でうまくいった流れをそのまま使う）

1. **公式の構成と見本問題を確認**する。公式の見本や Cambridge の過去問題集の文章・設問・音声はコピーしない（オリジナルのみ。形式とレベルの確認だけに使う）
2. エンジン改修：`index.html` を config 化（`docs/HANDOFF.md` §3）＋上の新しい問題型の表示・採点・バンド換算を実装 → `tools/e2e.js` を新しい型に対応させる
3. 仕様書（SPEC）と日別プランを作り、ユーザーに日別プランの表を見せて確認を取る
4. 日・週ごとにサブエージェントで並列生成（1エージェント＝1ファイル）→ `tools/check.js` を新しい型に対応させて検査（正解の形式、fill の accept が空でない、語数制限内、tfng の a が labels にある 等）
5. 解説・和訳を別工程で追加（`docs/EXPLAIN.md` の形式。fill 問題は「本文・スクリプトのどこに答えがあるか」「よくある綴りミス」を書く）→ `tools/verify_ex.js` で問題が変わっていないことを確認
6. ★落とせない問題の判定（別エージェント）
7. **ブラインド検証**：正解を伏せて別エージェントに解かせ、正解キーと照合。fill は accept に入っていない別解がないか、tfng は NOT GIVEN と FALSE の区別が曖昧でないかを重点的に見る
8. 音声生成（§4）→ 速さを測る
9. `e2e.js`（iPad 横・縦・スマホ、JS エラーなし、横スクロールなし、全セット採点）→ GitHub Pages に push → ユーザーに Settings → Pages の手順を案内

## 4. 音声（Listening・Speaking の質問）

- TEAP と同じ Kokoro TTS（`tools/gen.py`、モデルは GitHub Releases から取得）。Hugging Face はこの環境からつながらなかった
- IELTS は**イギリス英語中心で複数のアクセント**。Kokoro のイギリス英語の声（bf_emma、bf_isabella、bm_george、bm_lewis など）を中心に、アメリカ英語の声も混ぜる。オーストラリア英語などの声はないので、その旨をユーザーに伝える
- 速さは**公式の見本音源で語/分を測って合わせる**（TEAP では公式約142語/分に対し speed=0.92 で約149語/分）。Part 1 と Part 4 で速さが違う可能性があるので、パートごとに測る
- Listening 本番の流れに合わせ、各パートの前に「You now have some time to look at questions 1 to 5.」などの案内と無音の時間を入れる（模試の日のみ。練習日は省略可）
- iPad Safari 対策として、音声は fetch → Blob URL で再生する（TEAP の `index.html` の `loadAudios` をそのまま使う）

## 5. TEAP で学んだ注意点（再掲）

- iPadOS 26 未満の iPad では claude.ai の Artifact が開けない → 最初から GitHub Pages
- 祖先要素の `overflow:hidden` は `position:sticky`（2カラムの本文固定）を壊す
- `minutes` と `tasks[].min` の合計を一致させる。時間が取れない日はユーザーに聞いて 90分コースなどに調整
- 正解の位置・形式に偏りを作らない。誤答肢は本文の語を使ったもっともらしいものに
- 実在の人物は「今日は〇〇の日」のラベルまで。本人の発言に見える応援メッセージは作らない
- 公開ページに学習者の本名・呼び名を入れない
- 報告は簡潔に、判断が必要なときは番号付きの選択肢で聞き、最後に次の一手を示す（ユーザーはスマホから操作）

## 6. 完成の条件

- 受験日までの全日分：やること（時間付き）・語彙・予想問題（形式は IELTS 本番どおり）・詳しい解説・全訳・音声
- 模試（Listening 40問・Reading 40問の通し）を数回。結果にバンドの目安を表示
- 全問のブラインド検証で正解キーと一致、指摘はすべて修正済み
- iPad（iPadOS 18 の Safari）で GitHub Pages から開けて、音声が再生できる
