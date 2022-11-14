/**
 * Bundled by jsDelivr using Rollup v2.74.1 and Terser v5.15.1.
 * Original file: /npm/idb-keyval@6.2.0/dist/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
 function e(e) {
  return new Promise(((t,n)=>{
      e.oncomplete = e.onsuccess = ()=>t(e.result),
      e.onabort = e.onerror = ()=>n(e.error)
  }
  ))
}
function t(t, n) {
  const r = indexedDB.open(t);
  r.onupgradeneeded = ()=>r.result.createObjectStore(n);
  const o = e(r);
  return (e,t)=>o.then((r=>t(r.transaction(n, e).objectStore(n))))
}
let n;
function r() {
  return n || (n = t("keyval-store", "keyval")),
  n
}
function o(t, n=r()) {
  return n("readonly", (n=>e(n.get(t))))
}
function u(t, n, o=r()) {
  return o("readwrite", (r=>(r.put(n, t),
  e(r.transaction))))
}
function c(t, n=r()) {
  return n("readwrite", (n=>(t.forEach((e=>n.put(e[1], e[0]))),
  e(n.transaction))))
}
function s(t, n=r()) {
  return n("readonly", (n=>Promise.all(t.map((t=>e(n.get(t)))))))
}
function a(t, n, o=r()) {
  return o("readwrite", (r=>new Promise(((o,u)=>{
      r.get(t).onsuccess = function() {
          try {
              r.put(n(this.result), t),
              o(e(r.transaction))
          } catch (e) {
              u(e)
          }
      }
  }
  ))))
}
function i(t, n=r()) {
  return n("readwrite", (n=>(n.delete(t),
  e(n.transaction))))
}
function l(t, n=r()) {
  return n("readwrite", (n=>(t.forEach((e=>n.delete(e))),
  e(n.transaction))))
}
function f(t=r()) {
  return t("readwrite", (t=>(t.clear(),
  e(t.transaction))))
}
function d(t, n) {
  return t.openCursor().onsuccess = function() {
      this.result && (n(this.result),
      this.result.continue())
  }
  ,
  e(t.transaction)
}
function h(t=r()) {
  return t("readonly", (t=>{
      if (t.getAllKeys)
          return e(t.getAllKeys());
      const n = [];
      return d(t, (e=>n.push(e.key))).then((()=>n))
  }
  ))
}
function y(t=r()) {
  return t("readonly", (t=>{
      if (t.getAll)
          return e(t.getAll());
      const n = [];
      return d(t, (e=>n.push(e.value))).then((()=>n))
  }
  ))
}
function p(t=r()) {
  return t("readonly", (n=>{
      if (n.getAll && n.getAllKeys)
          return Promise.all([e(n.getAllKeys()), e(n.getAll())]).then((([e,t])=>e.map(((e,n)=>[e, t[n]]))));
      const r = [];
      return t("readonly", (e=>d(e, (e=>r.push([e.key, e.value]))).then((()=>r))))
  }
  ))
}
export {f as clear, t as createStore, i as del, l as delMany, p as entries, o as get, s as getMany, h as keys, e as promisifyRequest, u as set, c as setMany, a as update, y as values};
export default null;
//# sourceMappingURL=/sm/e22387484eaba42e333cb9be4935436627dcdba2fc6a5817e932e652eb088e48.map
