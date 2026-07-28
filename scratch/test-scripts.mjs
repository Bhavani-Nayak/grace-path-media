const html = await fetch('http://127.0.0.1:8787/').then(r => r.text());
const scripts = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
console.log("Found script URLs:", scripts);

for (const scriptUrl of scripts) {
  if (scriptUrl.startsWith('/')) {
    const res = await fetch('http://127.0.0.1:8787' + scriptUrl);
    console.log(res.status, res.statusText, scriptUrl);
  }
}
