# 画面点検で見つかった中身の修正リスト

共通ルール：`q`・`choices`・`a`・`script`・`passage`・`questions`・`options` は変えない（音声・採点が紐づくため）。直してよいのは `ex`・`accept`（正解の表記ゆれ追加のみ）・`tasks`・`directions`・`limitMin`・write/speak の `model / modelJa / modelParts / keyLanguage / tips / pitfalls / plan / phrases / checklist`。
modelParts の en の連結は model と一致させること。完了後に `node /home/user/ielts-build/tools/check_ielts.js <file>` と `node /home/user/ielts-build/tools/check_model.js <file>` が OK。

## d1.js
1. 2026-11-26 A（Listening Part 2 図書館の地図）：地図の G は「受付の左寄り（左半分、x=30,y=46）」に移した。解説で G を「右側」「入口近くの角」と説明している箇所（Q16, Q17 など）を地図に合わせて直す。右下の角は Café。
2. 2026-11-25 B（Writing Task 2）：模範解答は4段落だが、ヒント(plan)・checklist・11/25 の tasks は「Body 3＝反論と再反論」を含む5段落になっている。**模範解答の4段落に合わせて** plan・checklist・tasks を直す（反論は Body 2 の中で1文触れる程度でよい）。「Conclusion で新しい情報を書かない」と模範解答の Conclusion が矛盾しないようにする。
3. 2026-11-25 の tasks の時間と各セットの limitMin をそろえる（Reading 18分なら limitMin 18、Writing は短縮版 22分なら limitMin 22 として directions に「今日は短縮版（22分・約200語目標）」と書く等。どちらかに統一）。
4. 2026-11-23 D（Writing Task 1）：phrases の「more than three times the figure for …」はこのグラフに当てはまらない → 「more than twice …」等に。
5. 2026-11-26 B（Speaking Part 2）：checklist・phrases の「First of all / Another reason / Finally」と模範解答の「First / Second / Third」をそろえる。
6. 2026-11-26 A Q13 の解説：「（チューズデイ／サーズデイ）」のように区切りを入れる。
7. 2026-11-23 A Q1 の解説：「Part 1 の名前は必ず1文字ずつ読み上げられる」→「多くの場合」。

## d2.js
1. 2026-11-28 C（Writing Task 2）：模範解答の "Personally, I agree with the second view." が問題文の second view（中学校まで待つ）と逆になっている。本文・結論の立場（小学校から始める）に合わせ、立場を名前で書く（例 "Personally, I agree with the view that children should start at primary school."）。modelParts・keyLanguage・phrases も同様に。
2. 2026-11-28 B Q11 の解説：「NO：…設問と一致する」は NO が正しいように読める →「設問と一致するので NO ではない」と明確に。
3. 2026-11-30 A（Speaking Part 3）：1問あたりの目標時間が tasks・directions・plan/tips・checklist でばらばら（about one minute / 30〜60秒 / 30秒以上 / 60秒）。「1問 40〜60秒」に統一。

## d3.js
1. 2026-12-05 D（Speaking Part 2）：模範解答と表現欄の "I was a mixture of excited and anxious" は誤り → "I felt both excited and anxious"（関連箇所すべて）。
2. 2026-12-05 tasks：「12/4 Task2 の…Overview を音読」→ Task 2 に Overview はない。「Task1 の Overview と Task2 の Introduction」等に。
3. 2026-12-05 A（Listening Part 3）directions：「3人の意見が行き来する。…最終的に2人がどう決めたか」→「先生と学生2人の3人。最終的に学生2人がどう決めたか」。
4. 2026-12-05 D Part 3：checklist の例語（uncertainty, more easily）が模範解答にない → 模範解答にある語に。
5. 2026-12-04 A（Writing Task 2）：tips の「260語以上」→「250語以上」。plan の「whereas」と言い換え例「study from home」を模範解答（but / study online）に合わせる。
6. 2026-12-04 B（Speaking Part 1）：「two to four sentences」と「2〜3文」の不一致 →「2〜4文」に統一。
7. 2026-12-03 A Q8 の解説のポイント：設問の語句に合わせる（「notice a difference in taste ＝ customers notice the difference in taste」）。
8. 2026-12-02 A（Writing Task 1 プロセス）：checklist・phrases の例（which makes them soft, Once dried, during which time, in order to）が模範解答にない → 模範解答で使っている表現に合わせる。plan STEP 2 の Overview の説明を模範解答（段階の数・始まりと終わり・緑の生葉が乾いた茶色の茶になる）に合わせる。
9. 2026-12-02 B（Speaking Part 2）：話す時間の目標が「1分30秒以上」と「1分40秒以上」で不一致 →「1分30秒〜2分」に統一。
10. 2026-12-02 の tasks（セットB①②が12分＋12分）とセットの limitMin（20）をそろえる。

## mockL.js / mockR.js（2026-11-29）
1. 解説の「1日1往路」→「1日1便（24時間に1本）」（Reading F の Q14 付近）。
2. Reading G Q35 付近の解説「筆者は合図を黙らせると変化に気づけない」→「退屈というサインを（スマホなどで）紛らわすと、状況を変える必要に気づけない」。
3. Listening Part 1 の和訳「コーストライン・サイクル・ハイヤー」→「コーストライン・レンタサイクル」。
4. Listening Part 4 Q38（"the high ___ of building"）：accept に "costs" を追加し、解説の理由を「本文が cost だから」に。
