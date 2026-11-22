const { chromium } = require(process.env.QA_BROWSER_MODULE);
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, process.env.QA_DIST || '../dist'), origin = 'https://warhorse-preview.test';
const phone = 'tel:+13074381030', recipient = 'wade.lebeau@warhorse-roofing.com';
const routes = ['/', '/services/', '/projects/', '/service-area/', '/about/', '/contact/', '/projects/riverton-flat-roof/', '/projects/school-roof-coating/', '/projects/fabric-reinforced-clinic-roof/'];
const mime = { css:'text/css', html:'text/html; charset=utf-8', js:'text/javascript', jpg:'image/jpeg', png:'image/png', svg:'image/svg+xml', webp:'image/webp', woff2:'font/woff2' };
function localFile(pathname) {
  const local=decodeURIComponent(pathname).replace(/^\/+/,'');
  const file=path.resolve(root, local, !local || local.endsWith('/') ? 'index.html':'');
  assert(!path.relative(root,file).startsWith('..'));
  return file;
}
async function localRoutes(context, errors) {
  await context.route('**/*',async request=>{
    const u=new URL(request.request().url());
    if (u.origin!==origin) {errors.push('External request '+u.pathname); return request.abort();}
    if (u.pathname==='/__form/') return request.fulfill({contentType:'text/html',body:'<iframe sandbox="allow-same-origin allow-scripts allow-forms" title="Assessment" src="/contact/" style="width:100%;height:860px"></iframe>'});
    try {const f=localFile(u.pathname);await request.fulfill({contentType:mime[path.extname(f).slice(1)],body:await fs.readFile(f)});}
    catch(e) {errors.push(u.pathname+' '+e.message);await request.fulfill({status:404,body:'Missing file'});}
  });
}
async function menu(page,width) {
  const toggle=page.locator('#menu-toggle');
  if(await toggle.isVisible()) {
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    await toggle.click();
    const nav=page.locator('[id="'+await toggle.getAttribute('aria-controls')+'"]');
    assert(await nav.isVisible());
    assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    assert(await nav.locator('a:visible').count()>=3);
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  }
  if(width<=390) {
    const bar=await page.evaluate(()=>{
      const e=Array.from(document.querySelectorAll('body *')).find(x=>getComputedStyle(x).position==='fixed' && x.offsetHeight && Math.abs(innerHeight - x.getBoundingClientRect().bottom)<3 && x.querySelector('a[href^="tel:"]') && x.querySelector('a[href*="contact/"]'));
      return e && {offset:innerHeight-e.getBoundingClientRect().bottom,call:e.querySelector('a[href^="tel:"]').getAttribute('href')};
    });
    assert(bar && bar.call===phone && Math.abs(bar.offset)<3,'Sticky mobile CTA missing at '+width);
  }
}
async function inspect(page,width,route) {
  const r=await page.goto(origin+route); assert.equal(r.status(),200,route);
  const data=await page.evaluate(async()=>{
    const images=[...document.images];
    await document.fonts.ready;
    await Promise.all(images.map(i=>{i.loading='eager';return i.decode();}));
    return {overflow:document.documentElement.scrollWidth-innerWidth, h1:document.querySelectorAll('h1').length, hasAlt:images.every(i=>i.hasAttribute('alt')), ids:[...document.querySelectorAll('[id]')].map(e=>e.id), urls:[...document.querySelectorAll('a[href],script[src],link[href],img[src]')].map(e=>e.getAttribute('src')||e.getAttribute('href')), body:document.body.innerText};
  });
  const label=route+' at '+width+'px';
  assert(data.overflow<=1,label+' overflows by '+data.overflow);
  assert(data.h1===1 && data.hasAlt,label+' heading/alt');
  assert.equal(new Set(data.ids).size,data.ids.length,label+' duplicate ids');
  assert(!/conklin|mitchell|sweetwater|tharp|waller|wind river renewal|junk removal/i.test(data.body),label+' outside name');
  return data;
}
async function services(page) {
  await page.goto(origin+'/services/');
  const controls=page.locator('.sequence-controls button'), frames=page.locator('.sequence-frame');
  assert.equal(await controls.count(),3);
  for(const i of [2,1,0]){
    await controls.nth(i).click();
    assert.equal(await controls.nth(i).getAttribute('aria-pressed'),'true');
    assert.equal(await frames.nth(i).getAttribute('aria-hidden'),'false');
    assert.equal(await page.locator('.sequence-frame.active').count(),1);
  }
  const play=page.locator('[data-play]');
  await play.click();assert.match(await play.innerText(),/pause/i);
  await play.click();assert.match(await play.innerText(),/play/i);
  for(const topic of await page.locator('details').all()){
    const before=await topic.evaluate(e=>e.open);await topic.locator('summary').click();assert.equal(await topic.evaluate(e=>e.open),!before);
  }
}
async function gallery(page){
  await page.goto(origin+'/projects/');
  const photos=page.locator('main figure a[href$=".webp"]');
  assert.equal(await photos.count(),5);
  const href=await photos.first().getAttribute('href');
  await photos.first().click();assert.equal(page.url(),new URL(href,origin+'/projects/').href);
  assert(await page.locator('img').evaluate(e=>e.naturalWidth>0));
}
async function contact(page){
  // Sandboxing blocks external mail handlers during the supervised draft test.
  await page.goto(origin+'/__form/');
  const frame=page.frameLocator('iframe'),form=frame.locator('#estimate-request');
  const send=form.locator('[type="submit"]');
  await send.click();assert.equal(await form.evaluate(f=>f.checkValidity()),false);
  for(const [id,s] of [['estimate-location','123 QA Example, Riverton'],['estimate-concern','Coating near the curb'],['estimate-name','QA Example Owner'],['estimate-contact','555-0100']]) await form.locator('#'+id).fill(s);
  assert(await form.evaluate(f=>f.checkValidity()));
  await send.click();
  const draft=new URL(await form.locator('#assessment-email-fallback').getAttribute('href'));
  assert.equal(draft.protocol,'mailto:');assert.equal(draft.pathname,recipient);
  for(const v of ['123 QA Example','Coating near the curb','QA Example Owner','555-0100']) assert((draft.searchParams.get('body')||'').includes(v));
  await form.locator('#copy-request').click();
  const manual=form.locator('#copy-fallback');
  if(await manual.isVisible()) assert((await manual.inputValue()).includes('555-0100'));
  else assert.match(await form.locator('#estimate-status').innerText(),/copied/i);
}
async function noScript(browser,errors){
  const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});await localRoutes(ctx,errors);
  try{const p=await ctx.newPage();await p.goto(origin+'/');
    const hrefs=await p.locator('header nav a:visible').evaluateAll(a=>a.map(e=>new URL(e.href).pathname));assert(hrefs.includes('/projects/')&&hrefs.includes('/services/'),'JS-off nav');
    await p.goto(origin+'/services/');assert.equal(await p.locator('.sequence-frame:visible').count(),3);
    await p.goto(origin+'/contact/');assert(await p.locator('main a[href="'+phone+'"]:visible').count()>0);assert(await p.locator('main a[href="mailto:'+recipient+'"]:visible').count()>0);
  }finally{await ctx.close();}
}
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.QA_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try{
    const ctx=await browser.newContext(),errors=[],docs=new Map();await localRoutes(ctx,errors);
    const page=await ctx.newPage();page.setDefaultTimeout(5000);page.on('pageerror',e=>errors.push(e.message));
    for(const width of [360,390,768,1440]){
      await page.setViewportSize({width,height:width===1440?900:844});
      for(const route of routes){
        const data=await inspect(page,width,route);if(width===360)docs.set(route,data);
        if(route==='/'){await menu(page,width);if(width===390||width===1440)await page.screenshot({path:path.join(__dirname,'qa-home-'+width+'.jpg'),type:'jpeg',quality:84,fullPage:true});}
      }
      console.log('9 pages passed at '+width+'px');
    }
    let refs=0;const paths=new Set();
    for(const [route,doc] of docs){for(const raw of doc.urls){const target=new URL(raw,origin+route);if(target.origin!==origin)continue;refs++;if(!paths.has(target.pathname)){await fs.access(localFile(target.pathname));paths.add(target.pathname);}if(target.hash)assert(docs.get(target.pathname)?.ids.includes(decodeURIComponent(target.hash.slice(1))),route+' '+raw);}}
    await services(page);await gallery(page);await contact(page);await noScript(browser,errors);assert.deepEqual(errors,[]);
    console.log(refs+' local refs verified. Menu, mobile actions, sequence, FAQ, full-size photos, email/copy and JS-off fallbacks passed.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
