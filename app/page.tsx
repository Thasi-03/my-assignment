"use client";
import { useMemo, useState } from "react";

type Tab = { title: string; content: string };
const esc = (s:string) => s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]!));

export default function HomePage() {
  const [label, setLabel] = useState("Sample tabs");
  const [tabs, setTabs] = useState<Tab[]>([
    { title: "Tab 1", content: "Hello from Tab 1" },
    { title: "Tab 2", content: "Hello from Tab 2" },
  ]);
  const [out, setOut] = useState("");

  const move = (i:number, dir:-1|1) => {
    setTabs(prev => {
      const a=[...prev]; const j=i+dir;
      if (j<0 || j>=a.length) return a;
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
  };

  const generated = useMemo(() => {
    const html = `
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tabs</title>

<!-- Student: 21969946 -->
<div id="app" style="font-family:system-ui,Arial,sans-serif;max-width:960px;margin:1rem auto;">
  <h1 style="font-size:1.25rem;margin:0 0 .75rem;">Tabs Demo</h1>

  <div role="tablist" aria-label="${esc(label)}" style="display:flex;gap:.25rem;flex-wrap:wrap;">
    ${tabs.map((t,i)=>`
      <button role="tab" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}"
        style="border:1px solid #888;padding:.5rem .75rem;border-radius:.5rem;background:${i===0?"#eee":"#fff"};cursor:pointer;">
        ${esc(t.title)}
      </button>`).join("")}
  </div>

  ${tabs.map((t,i)=>`
  <div role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}" ${i===0?"":"hidden"}
    style="border:1px solid #888;border-radius:.5rem;padding:1rem;margin-top:.5rem;">
    ${esc(t.content)}
  </div>`).join("")}
</div>

<script>
(function(){
  function setCookie(name,value,days){var d=new Date();d.setTime(d.getTime()+days*864e5);document.cookie=name+"="+encodeURIComponent(value)+";expires="+d.toUTCString()+";path=/";}
  function getCookie(name){var m=document.cookie.match(new RegExp('(?:^|; )'+name+'=([^;]*)'));return m?decodeURIComponent(m[1]):null;}
  var n=${tabs.length}, idx=[${tabs.map((_,i)=>i).join(",")}];
  var selected=parseInt(getCookie("selected_tab")||"0",10);

  function select(i){
    idx.forEach(function(j){
      var tab=document.getElementById("tab-"+j);
      var panel=document.getElementById("panel-"+j);
      var active=j===i;
      tab.setAttribute("aria-selected", active);
      tab.tabIndex = active?0:-1;
      tab.style.background = active?"#eee":"#fff";
      if(active){ panel.removeAttribute("hidden"); tab.focus(); }
      else { panel.setAttribute("hidden",""); }
    });
    setCookie("selected_tab", i, 30);
  }
  idx.forEach(function(i){
    var el=document.getElementById("tab-"+i);
    el.addEventListener("click", function(){ select(i); });
    el.addEventListener("keydown", function(e){
      if(e.key==="ArrowRight"){ select((i+1)%n); }
      if(e.key==="ArrowLeft"){ select((i-1+n)%n); }
    });
  });
  if(!isNaN(selected) && selected>=0 && selected<n){ select(selected); }
})();
</script>
</html>`.trim();
    return html;
  }, [tabs, label]);

  const generate = () => setOut(generated);

  const download = () => {
    const blob = new Blob([out || generated], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Hello.html";
    document.body.appendChild(a); a.click();
    a.remove(); URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">HTML Tabs Generator</h1>

      <label className="block">ARIA label for tablist
        <input className="border rounded p-2 w-full"
               value={label} onChange={e=>setLabel(e.target.value)} />
      </label>

      <div className="space-y-2" aria-label="Configure tabs">
        {tabs.map((t,i)=>(
          <fieldset key={i} className="border rounded p-3">
            <legend className="px-1">Tab {i+1}</legend>
            <div className="flex gap-2 mb-2">
              <button type="button" className="px-2 py-1 border rounded" onClick={()=>move(i,-1)}>↑</button>
              <button type="button" className="px-2 py-1 border rounded" onClick={()=>move(i, 1)}>↓</button>
              <button type="button" className="px-2 py-1 border rounded ml-auto"
                      onClick={()=>setTabs(p=>p.filter((_,j)=>j!==i))}>Remove</button>
            </div>
            <label className="block mb-1">Title
              <input className="border rounded p-2 w-full" value={t.title}
                onChange={e=>setTabs(p=>p.map((x,j)=>j===i?{...x,title:e.target.value}:x))}/>
            </label>
            <label className="block">Content
              <textarea className="border rounded p-2 w-full min-h-24" value={t.content}
                onChange={e=>setTabs(p=>p.map((x,j)=>j===i?{...x,content:e.target.value}:x))}/>
            </label>
          </fieldset>
        ))}
        <button className="px-3 py-2 border rounded" type="button"
          onClick={()=>setTabs(p=>[...p,{title:`Tab ${p.length+1}`,content:"..."}])}>
          + Add Tab
        </button>
      </div>

      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded" type="button" onClick={generate}>Generate</button>
        <button className="px-3 py-2 border rounded" type="button"
                onClick={()=>navigator.clipboard.writeText(out || generated)}>Copy</button>
        <button className="px-3 py-2 border rounded" type="button" onClick={download}>Download</button>
      </div>

      {/* Live preview */}
      <div className="border rounded">
        <iframe title="Preview" className="w-full" style={{height: 360}}
                srcDoc={out || generated} />
      </div>

      <label className="block">Output HTML:
        <textarea className="border rounded p-2 w-full min-h-64" value={out || generated} readOnly />
      </label>
    </section>
  );
}
