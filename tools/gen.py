import json, os, sys, re, subprocess, hashlib, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro("models/kokoro-v1.0.int8.onnx","models/voices-v1.0.bin")
items=json.load(open("scripts.json")); os.makedirs("teap/audio",exist_ok=True)
LECT=["am_michael","af_heart","bm_george","bf_emma"]
FIX={"W":"af_heart","W2":"af_bella","M":"am_michael","M2":"am_puck","Q":"af_sarah"}
man={}
for n,it in enumerate(items):
    fn=re.sub(r'[^0-9A-Za-z]+','_',it["key"])+".mp3"; path="teap/audio/"+fn; man[it["key"]]="audio/"+fn
    if os.path.exists(path): continue
    lect=LECT[int(hashlib.md5(it["key"].encode()).hexdigest(),16)%4]
    parts=[]; sr=24000
    for ln in it["lines"]:
        t=ln["t"].strip(); sp=ln["sp"]
        meta = sp=="Q" or re.match(r'^(Lecture \d+\.?\s*)?Situation:',t) or re.match(r'^Lecture \d+\.$',t)
        v = "af_sarah" if meta else FIX.get(sp, lect)
        a,sr=k.create(t,voice=v,speed=0.92,lang="en-us")
        if sp=="Q": parts.append(np.zeros(int(sr*1.0)))
        parts.append(a); parts.append(np.zeros(int(sr*(0.8 if meta else 0.45))))
    sf.write("tmp.wav",np.concatenate(parts),sr)
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i","tmp.wav","-ac","1","-b:a","48k",path],check=True)
    print(n+1,"/",len(items),fn,flush=True)
open("teap/data/audio.js","w").write("window.TEAP_AUDIO="+json.dumps(man)+";\n")
print("DONE")
