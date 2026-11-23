# Generate IELTS listening / speaking-question audio with Kokoro TTS.
# Usage: python gen_ielts.py <site_dir> <models_dir> [speed]
# Reads <site_dir>/data/*.js via node, writes <site_dir>/audio/*.mp3 and <site_dir>/data/audio.js
import json, os, re, sys, subprocess, hashlib
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

site, models = sys.argv[1], sys.argv[2]
speed = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
k = Kokoro(os.path.join(models, "kokoro-v1.0.int8.onnx"), os.path.join(models, "voices-v1.0.bin"))

dump = subprocess.check_output(["node", "-e", r"""
const fs=require('fs'),vm=require('vm'),p=require('path');const g={};g.window=g;vm.createContext(g);
for(const f of ['d1','d2','mockL','mockR','d3']){const fp=p.join(process.argv[1],'data',f+'.js'); if(fs.existsSync(fp)) vm.runInContext(fs.readFileSync(fp,'utf8'),g);}
const D=g.DRILL;(D.pending||[]).forEach(x=>{if(D.days[x.day])D.days[x.day].sets=D.days[x.day].sets.concat(x.sets)});
const out=[];for(const [day,d] of Object.entries(D.days))for(const s of d.sets){
 if(s.script) out.push({key:day+'|'+s.id,lines:s.script});
 s.items.forEach((it,i)=>{ if(it.type==='speak') it.questions.forEach((q,j)=>out.push({key:day+'|'+s.id+'|'+i+'|q'+j,lines:[{sp:'X',t:q}]})); });}
process.stdout.write(JSON.stringify(out));""", site]).decode()
items = json.loads(dump)
os.makedirs(os.path.join(site, "audio"), exist_ok=True)

NARR = re.compile(r"^(Part \d|You will hear|You now have|Now (look|listen|you)|First,? you|That is the end|Before you|You will see|Questions? \d|Look at questions)", re.I)
FIX = {"W": "bf_emma", "W2": "af_heart", "M": "bm_george", "M2": "am_michael", "X": "bm_daniel"}
LECT = ["bm_daniel", "bf_isabella", "bm_lewis", "bf_alice"]
man = {}
for n, it in enumerate(items):
    fn = re.sub(r"[^0-9A-Za-z]+", "_", it["key"]) + ".mp3"
    path = os.path.join(site, "audio", fn); man[it["key"]] = "audio/" + fn
    sig = hashlib.md5((json.dumps(it["lines"]) + str(speed)).encode()).hexdigest()
    if os.path.exists(path) and os.path.exists(path + ".sig") and open(path + ".sig").read() == sig: continue
    lect = LECT[int(hashlib.md5(it["key"].encode()).hexdigest(), 16) % 4]
    parts, sr = [], 24000
    for ln in it["lines"]:
        if ln["sp"] == "PAUSE":
            parts.append(np.zeros(int(sr * float(ln.get("sec", 5))))); continue
        t = ln["t"].strip()
        if ln["sp"] == "N" and NARR.match(t): v = "bf_alice"
        else: v = FIX.get(ln["sp"], lect)
        lang = "en-us" if v.startswith("a") else "en-gb"
        a, sr = k.create(t, voice=v, speed=speed, lang=lang)
        parts.append(a); parts.append(np.zeros(int(sr * 0.45)))
    tmp = os.path.join(site, "audio", "_tmp.wav")
    sf.write(tmp, np.concatenate(parts), sr)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-ac", "1", "-b:a", "48k", path], check=True)
    os.remove(tmp); open(path + ".sig", "w").write(sig)
    print(n + 1, "/", len(items), fn, flush=True)
open(os.path.join(site, "data", "audio.js"), "w").write("window.DRILL_AUDIO=" + json.dumps(man) + ";\n")
print("DONE", len(items))
