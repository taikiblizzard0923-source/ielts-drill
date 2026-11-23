# Assemble index.html from the TEAP base CSS + IELTS CSS/body
import re,sys,os
os.chdir(os.path.dirname(os.path.abspath(__file__))+'/..')
base=open('base_teap.html',encoding='utf-8').read()
css=base[base.index('<style>\n/* Layout'):base.index('</style>',base.index('<style>\n/* Layout'))+len('</style>')]
css=css.replace('</style>',open('src_extra.css',encoding='utf-8').read()+'\n</style>')
head='''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="IELTSドリル">
<meta name="theme-color" content="#fdf8f9">
<title>IELTS 2週間ドリル</title>
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-family:system-ui,sans-serif;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@600;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">
'''
out=head+css+'\n</head>\n<body>\n'+open('src_body.html',encoding='utf-8').read()+'\n</body>\n</html>\n'
open('index.html','w',encoding='utf-8').write(out); print('index.html',len(out))
