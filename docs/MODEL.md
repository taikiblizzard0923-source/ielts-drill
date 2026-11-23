# 模範解答を丁寧にする指示（Writing / Speaking）

学習者は英検2級A程度の高校生（IELTS 5.0 → 5.5 目標）。iPad で一人で学習する。模範解答を「読んで真似できる」教材にする。

## 対象
指定ファイルの `type: "write"` と `type: "speak"` の item だけ。**他の item・セット・q/choices/a/script/passage などは1文字も変えない**（音声と採点に影響するため）。`questions`（speak の質問文）も変えない。

## 変更・追加するフィールド
1. `model`：書き直してよい。レベルは **バンド 5.5（Overall 5.5 を確実に取るための答案）**。満点狙いではなく「型どおりで、ミスが少なく、課題にすべて答えている」答案。英検2級レベルの語彙・文法（簡単な関係詞・接続詞・比較）で、高校生がそのまま再現できること。難しい語・凝った構文は使わない。
   - Task1：160〜180語、4段落（Introduction / Overview / Body 1 / Body 2）。数値は図表と完全に一致させる
   - Task2：260〜280語、4〜5段落（Introduction（言い換え＋意見）/ Body 1 / Body 2 /（Body 3）/ Conclusion）
   - Speaking Part1：各質問に 2〜3文（答え→理由→具体例）。質問ごとに改行し "Q: …" を前置き
   - Part2：1分40秒〜2分で話せる量（約220〜260語）。カードの全ポイントに触れる
   - Part3：各質問に 4〜5文（意見→理由→例→（反対意見）→まとめ）。質問ごとに "Q: …" を前置き
2. `modelJa`：model の自然な全訳（段落対応）。
3. **`modelParts`（新規・必須）**：model を段落（Speaking は質問ごと）に分けた配列。
   ```js
   modelParts: [
     { label: "Introduction（導入）", en: "The line graph illustrates …", ja: "この折れ線グラフは…",
       point: "問題文の shows を illustrates、young people を people aged 16 to 24 と言い換えている。Task1 の導入は1文で十分。" },
     …
   ]
   ```
   - `en` をつなげると `model` と同じ内容になること（段落区切りは \n\n）
   - `point`：その段落の**役割**と**使っているテクニック**（言い換え・つなぎ言葉・比較表現・具体例の出し方など）を日本語2〜4文で。初学者が真似できるように具体的に
4. **`keyLanguage`（新規）**：模範解答から真似したい表現 8〜12個。`[英語, 日本語, 使い方のメモ]`
   例：`["a dramatic increase", "急激な増加", "名詞で書くと文のバリエーションが増える。rose dramatically の言い換え"]`
5. **`tips`（新規）**：「5.5 を確実に取るためのポイント」3〜5個（減点されないための最低ライン・型の守り方）（日本語。評価観点：Task Achievement/Response、Coherence and Cohesion、Lexical Resource、Grammatical Range and Accuracy。Speaking は Fluency and Coherence、Lexical Resource、Grammar、Pronunciation に対応させる）
6. **`pitfalls`（新規）**：日本人学習者がやりがちなミス 3〜4個（例：「Overview を書かない」「数字を全部並べる」「I think を連発」）。`[ミス, 直し方]` の配列
7. `checklist` は今のままか、より具体的にしてよい（6〜8項目）。`phrases`・`plan` は残す

## 確認
`node /home/user/ielts-build/tools/check_ielts.js <ファイル>` が OK であること。さらに
`node /home/user/ielts-build/tools/check_model.js <ファイル>` が OK であること（modelParts の en の連結と model の一致、語数、必須フィールドを検査）。
最終報告は「直した item 数」だけ1行で。
