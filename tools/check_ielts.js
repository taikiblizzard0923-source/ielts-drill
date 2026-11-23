// Usage: node check_ielts.js file1.js [file2.js ...]
// Loads data files in order and validates every day/set/item against docs/SPEC.md.
const fs = require('fs'), vm = require('vm');
const g = {}; g.window = g; vm.createContext(g);
for (const f of process.argv.slice(2)) vm.runInContext(fs.readFileSync(f, 'utf8'), g, { filename: f });
const D = (g.DRILL || {}).days || {};
const err = [], dist = [0, 0, 0, 0, 0, 0];
const SK = ['L', 'R', 'W', 'S'];
const norm = s => String(s).toLowerCase().replace(/\s+/g, ' ').trim().replace(/\.$/, '');
const words = s => String(s).trim().split(/\s+/).filter(Boolean).length;
for (const day of Object.keys(D).sort()) {
  const d = D[day]; let pts = 0, n = 0;
  const E = m => err.push(day + ' ' + m);
  if (!d.theme) E('no theme');
  if (!d.cheer) E('no cheer');
  if (!Array.isArray(d.tasks) || !d.tasks.length) E('no tasks');
  else { const sum = d.tasks.reduce((a, t) => a + (t.min || 0), 0); if (sum !== d.minutes) E('tasks sum ' + sum + ' != minutes ' + d.minutes); }
  if (!Array.isArray(d.vocab) || d.vocab.length < 15) E('vocab < 15');
  const ids = new Set();
  for (const s of d.sets || []) {
    const S = m => E(s.id + ' ' + m);
    if (ids.has(s.id)) S('dup set id'); ids.add(s.id);
    if (!SK.includes(s.skill)) S('bad skill');
    if (!s.instructions) S('no instructions');
    if (s.passage && !s.passageJa) S('no passageJa');
    if (s.script) {
      if (!Array.isArray(s.scriptJa) || s.scriptJa.length !== s.script.length) S('scriptJa length');
      s.script.forEach((l, i) => { if (l.sp === 'PAUSE') { if (!(l.sec > 0)) S('PAUSE sec @' + i); } else if (!['W', 'W2', 'M', 'M2', 'N'].includes(l.sp) || !l.t) S('bad script line @' + i); });
    }
    if (s.skill === 'L' && !s.script) S('L set without script');
    if (s.chart) { const c = s.chart; if (!c.x || !c.series || c.series.some(x => x.data.length !== c.x.length)) S('chart data length'); }
    if (s.plan) { const p = s.plan; if (!(p.width > 0 && p.height > 0) || !Array.isArray(p.letters)) S('plan shape'); }
    (s.items || []).forEach((it, i) => {
      const I = m => S('#' + i + ' ' + m);
      const t = it.type || 'mc';
      if (!['write', 'speak'].includes(t) && !it.ex) I('no ex');
      if (it.ex && !/【正解】/.test(it.ex)) I('ex without 【正解】');
      if (t === 'mc') { if (!Array.isArray(it.choices) || it.choices.length < 2 || !(it.a >= 0 && it.a < it.choices.length)) I('mc shape'); else { n++; pts++; if (it.choices.length >= 4) dist[it.a]++; } if (new Set(it.choices).size !== it.choices.length) I('dup choices'); }
      else if (t === 'mc2') { if (!Array.isArray(it.a) || it.a.length !== 2 || it.a[0] === it.a[1] || it.a.some(x => !(x >= 0 && x < it.choices.length))) I('mc2 shape'); n++; pts += 2; }
      else if (t === 'select') { if (!Array.isArray(s.options) || !(it.a >= 0 && it.a < s.options.length)) I('select shape'); n++; pts++; }
      else if (t === 'fill') {
        if (!Array.isArray(it.accept) || !it.accept.length) I('fill no accept');
        if (!it.limit) I('fill no limit');
        const m = /ONE WORD|TWO WORDS|THREE WORDS/.exec(it.limit || ''); const max = m ? { 'ONE WORD': 1, 'TWO WORDS': 2, 'THREE WORDS': 3 }[m[0]] : 9;
        const numOK = /NUMBER/.test(it.limit || '');
        (it.accept || []).forEach(a => { const w = String(a).trim().split(/\s+/).filter(x => !(numOK && /^[\d.,:\/-]+$/.test(x))).length; if (w > max) I('accept over limit: ' + a); if (norm(a) !== norm(norm(a))) I('accept not normalisable: ' + a); });
        if (!/_{3,}|\.{3,}|…/.test(it.q)) I('fill q has no blank');
        n++; pts++;
      }
      else if (t === 'write') { if (!it.prompt || !it.model || !it.modelJa || !(it.minWords > 0) || !Array.isArray(it.checklist)) I('write shape'); else if (words(it.model) < it.minWords) I('model shorter than minWords (' + words(it.model) + ')'); }
      else if (t === 'speak') { if (!Array.isArray(it.questions) || !it.questions.length || !it.model || !Array.isArray(it.checklist)) I('speak shape'); if (it.part === 2 && !it.cueCard) I('part2 without cueCard'); }
      else I('unknown type ' + t);
    });
  }
  console.log(day, (d.theme || '').slice(0, 30), 'items', n, 'points', pts, 'tasks', (d.tasks || []).reduce((a, t) => a + (t.min || 0), 0) + '/' + d.minutes);
}
console.log('mc answer dist (4+ choices)', dist.slice(0, 4));
console.log(err.length ? 'NG\n' + err.join('\n') : 'OK');
