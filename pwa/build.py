"""Build the installable (PWA) version of the Dvoje prototype.

Reads ../design/dvoje-prototype.html and writes index.html next to this file,
adding the manifest, icons, theme colour and service worker registration.
Run: python3 pwa/build.py
"""
from pathlib import Path

here = Path(__file__).resolve().parent
src = (here.parent / "design" / "dvoje-prototype.html").read_text(encoding="utf-8")
cut = src.index("</style>") + len("</style>")
head_part, body_part = src[:cut], src[cut:]

head = """<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#DADDD5" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#24251F" media="(prefers-color-scheme: dark)">
<meta name="description" content="Двоє — пара відповідає окремо і бачить, де розходиться.">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Двоє">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>html,body{margin:0}[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
"""
boot = """
<script>
/* installed app opens straight into the app, not the landing page */
(function(){try{var standalone=matchMedia("(display-mode: standalone)").matches||navigator.standalone;
  if(standalone||/[?&]app\\b/.test(location.search)){var k="dvoie-proto-v2",x=JSON.parse(localStorage.getItem(k)||"null");
    if(!x||!x.S||x.S.view==="site"){window.__startInApp=true}}}catch(e){}
  if("serviceWorker" in navigator){addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})})}})();
</script>
"""
body_part = body_part.replace(
    'if(S.view==="site"&&window.matchMedia("(max-width:700px)").matches&&S.couple.mode)S.view="app";',
    'if(S.view==="site"&&(window.__startInApp||(window.matchMedia("(max-width:700px)").matches&&S.couple.mode))){S.view="app";if(S.nav.p1.s==="A1"&&!S.couple.mode)S.nav.p1={s:"A1",st:[]}}',
)
assert "__startInApp" in body_part, "boot hook not found"
out = head + head_part + "\n</head>\n<body>" + boot + body_part + "\n</body>\n</html>\n"
(here / "index.html").write_text(out, encoding="utf-8")
print("wrote", here / "index.html", len(out), "bytes")
