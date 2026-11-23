# IELTS Academic 予想問題データ仕様

学習者：日本の高校生（英検2級A程度）。IELTS Academic（コンピューター受験）を **2026-12-06** に受験。現在 Overall 5.0 → 目標 5.5。
4技能すべて対象。問題は **すべてオリジナル**（公式サンプル・Cambridge 過去問の文章・設問・音声をコピーしない）。
レベル：**バンド 5.0〜6.0 帯（CEFR B1〜B2 下位）**。本番形式どおりの設問・指示文。

レベル・形式の確認用（**コピー禁止、読むだけ**）：
`/tmp/claude-0/-home-user/44beb455-2426-5cc1-8658-72c0a13763e6/scratchpad/idl/Academic_Practice_Test.txt`（英検協会配布の公式 Academic 練習問題。Reading・Listening の設問形式・指示文・長さの参考）

## 公式の試験構成（英検協会サイトで確認済み）
- Listening 約30分・40問・4パート（Part1 日常会話／Part2 日常的な独白／Part3 学術的な会話（2〜4人）／Part4 学術的な講義）。音声は1回のみ。設問形式：選択、組み合わせ、地図・図の分類、フォーム・メモ・表・フローチャートの穴埋め、要約・文完成、記述
- Reading 60分・40問・3パッセージ（合計 2,150〜2,750語）。設問形式：選択、TRUE/FALSE/NOT GIVEN、YES/NO/NOT GIVEN、組み合わせ、見出し選択、文・要約・メモ・表・フローチャート・図の穴埋め、記述
- Writing 60分：Task1 約150語（グラフ・表・図・プロセスを客観的に説明、約20分）、Task2 約250語（エッセイ、約40分、配点が高い）。評価観点4つ（課題への対応・一貫性とまとまり・語彙・文法）
- Speaking 11〜14分：Part1 自己紹介と身近な質問、Part2 トピックカード（準備1分・スピーチ1〜2分）、Part3 ディスカッション。評価観点4つ（流暢さと一貫性・語彙・文法・発音）

## ファイル形式
素の JavaScript。冒頭は必ず次の2行：
```js
window.DRILL = window.DRILL || { days: {} };
window.DRILL.days["2026-11-24"] = { ... };
```
（`TEAP` ではなく `DRILL`。テンプレートリテラル禁止、通常の文字列で。" と \ のエスケープに注意）

## Day
```js
{
  theme: "L Part1 フォーム穴埋め＋S Part1",
  minutes: 60,                         // 平日60・土日祝120（指定どおり）
  cheer: "応援メッセージ（日本語1〜2文。人名・呼び名は入れない）",
  tasks: [ { min: 10, text: "…" }, ... ],   // min の合計 = minutes。4〜7個。具体的に（どのセットを何分で）
  vocab: [ ["allocate","割り当てる"], ... ], // 20語。IELTS頻出のアカデミック語彙（バンド5.5〜6.5レベル）。日ごとに重複なし
  sets: [ Set, ... ]
}
```

## Set
```js
{
  id: "A",                    // 日内で一意（A, B, C…）
  skill: "L" | "R" | "W" | "S",
  title: "Listening Part 1",
  limitMin: 8,                // 目安時間（分）
  instructions: "Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.",  // 本番どおりの英語の指示
  directions: "日本語の練習用説明（コツを1文）",
  // 以下は必要なものだけ
  passage: "# Title\n\nParagraph A text…\n\n…",   // R の本文。見出し選択では段落に A, B, C… を付ける（"A  Paragraph text"）
  passageJa: "全訳（段落は \n\n）",
  table: { caption, head: [...], rows: [[...]] },   // 表（R・L・W Task1 で使用可）
  chart: { kind: "bar"|"line", title: "…", unit: "%", x: ["2000","2005",…], series: [ { name: "…", data: [12,15,…] } ] },  // W Task1 などのグラフ（数値は正確に）
  process: { title: "…", steps: ["…","…"] },       // W Task1 のプロセス図
  plan: { title: "…", width: 100, height: 70,       // L Part2 の地図・平面図。座標は 0〜width/height の相対値
          areas: [ { x: 5, y: 5, w: 30, h: 20, name: "Car park" }, ... ],   // 名前つきの区画（答えの場所には名前を書かない）
          letters: [ { x: 50, y: 40, l: "A" }, ... ],                     // 選択肢の記号の位置
          you: { x: 50, y: 66, label: "Entrance" } },
  options: [ "A  the cost", "B  the location", … ],  // select 型の共通選択肢（見出し i, ii…／記号 A〜H）
  script: [ { sp: "M", t: "…" }, { sp: "W", t: "…" }, { sp: "PAUSE", sec: 20 }, … ],   // L の音声（セット全体で1本）
  scriptJa: [ "…", "…", "", … ],                 // script と同じ長さ。PAUSE 行は ""
  items: [ Item, ... ]
}
```
- 話者 sp：W, W2（女性）、M, M2（男性）、N（ナレーター／講師）、PAUSE（無音、sec 秒）。
- L の script は本番どおり：最初に N が "You will hear …" で場面説明 → "First, you have some time to look at questions 1 to 5." の後に {sp:"PAUSE", sec:20}（模試日のみ。練習日は PAUSE 省略可）。
- 名前などの綴りを読み上げる箇所は **文字をカンマ区切り**で書く（例："That's Hartley, H, A, R, T, L, E, Y."）。電話番号などの数字は読み方どおり（"oh seven nine four…"）。
- 音声の語数：Part1・2 は 1パート 550〜750語、Part3・4 は 650〜850語（本番相当）。練習日はパートの半分（5問分）でもよい。

## Item（type ごと）
共通：`ex`（解説、日本語）。

```js
{ type: "mc", q: "…", choices: ["A …","B …","C …"], a: 1, ex }          // 1つ選ぶ。TFNG は choices: ["TRUE","FALSE","NOT GIVEN"]（YNNG も同様）
{ type: "mc2", q: "Which TWO …?", choices: ["A …","B …","C …","D …","E …"], a: [0,3], ex }   // 2つ選ぶ（2点分）
{ type: "select", q: "Paragraph B", a: 4, ex }                          // set.options の index を選ぶ（見出し・組み合わせ・地図記号）
{ type: "fill", q: "Name of hotel: ________", limit: "ONE WORD AND/OR A NUMBER",
  accept: ["Riverside", "the Riverside"], ex }                           // 穴埋め・記述。accept は正規化（小文字・前後空白・末尾ピリオド除去）後の完全一致で判定。表記ゆれ（数字/綴り/冠詞/単複が許される場合）を全部入れる。語数制限を守る答えだけ
{ type: "write", task: 1|2, prompt: "…（本番どおりの英語）", minWords: 150|250,
  model: "模範解答（バンド5.5相当。長すぎない。Task1 160〜190語、Task2 260〜300語）", modelJa: "和訳",
  plan: ["構成メモ：Introduction で…", "…"],            // 書き方の手順（日本語）
  phrases: [ ["rose sharply", "急増した"], … ],          // 使える表現 8〜12
  checklist: ["Overview（全体の傾向）を書いた", "…"] }    // 自己採点の観点 6〜8（4つの評価観点に対応）
{ type: "speak", part: 1|2|3, questions: ["Do you work or are you a student?", …],   // Part2 は cueCard を使い questions は Part2 の指示＋追加質問1つ
  cueCard: { topic: "Describe a …", points: ["what it was","when…","and explain…"] },  // Part2 のみ
  prepSec: 60, speakSec: 120,                     // Part2: 60/120、Part1: 0/30（1問あたり）、Part3: 0/60
  model: "模範解答（バンド5.5相当の自然な話し言葉）", modelJa: "和訳",
  phrases: [ ["To be honest,", "正直に言うと"], … ], checklist: ["質問に答えてから理由・例を足した", "…"] }
```

## 解説 ex の書き方（必須・150〜400字）
```
【正解】B（または答えの語）
【根拠】"本文・スクリプトの該当英文"（＝和訳）
【他の選択肢】A …：理由／C …：理由    ← mc・mc2・select（select は紛らわしい選択肢2〜3個だけでよい）
【よくあるミス】綴り・単複・語数オーバーなど       ← fill
【ポイント】言い換え（paraphrase）や解き方のコツ1〜2文
```
TFNG は FALSE と NOT GIVEN の区別を必ず説明する。

## 品質ルール
- 正解は本文・音声だけから一意に決まること。NOT GIVEN は「本文に書かれていない」ことが明確なものだけ
- mc の正解位置は偏らせない。誤答肢は本文の語を使ったもっともらしいもの
- 設問は本文の順に並べる（IELTS の慣習。見出し選択などを除く）
- 1つの Listening セット内の設問番号順に音声中で答えが出てくること
- Reading の練習用パッセージは 550〜800語、模試は 1パッセージ 750〜900語
- 地名・人名・企業名・研究は架空でよい（実在の研究を断定的に引用しない）

## 確認
完了後に必ず実行：
`node /home/user/ielts-build/tools/check_ielts.js <作ったファイル>`（全日・全問の形式チェック。OK が出るまで直す）
最終報告は「日付ごとの問題数（点数）」だけ短く。
