const { chromium } = require(process.env.QA_BROWSER_MODULE);
const fs = require('node:fs/promises'), p = require('node:path'), assert = require('node:assert/strict');
const origin = 'https://warhorse-preview.test';
const root = p.resolve('dist'), errors = [];
const routes = ['/', '/about/', '/projects/', '/service-area/', '/services/', '/projects/jackson-commercial-roof/', '/projects/riverton-flat-roof/', '/projects/fabric-reinforced-clinic-roof/', '/projects/school-roof-coating/'];
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.ttf':'font/ttf','.svg':'image/svg+xml'};
const file = u => p.join(root, u.pathname.slice(1)+(u.pathname.endsWith('/')?'index.html':''));
async function setup(ctx) {
  await ctx.route('**/*',async route=>{
    const u = new URL(route.request().url());
    if(route.request().method() !== 'GET' || u.origin !== origin) { errors.push('Unexpected '+u.href);return route.abort(); }
    if(u.pathname === '/favicon.ico')return route.fulfill({status:204});
    try {const f = file(u);return await route.fulfill({contentType:mime[p.extname(f)],body:await fs.readFile(f)});}
    catch(err){errors.push(u.pathname+' '+err.message);return route.abort();}
  });
}
(async()=>{
  const browser = await chromium.launch({executablePath:process.env.QA_CHROME});
  try {
    const ctx=await browser.newContext(); await setup(ctx);
    const page=await ctx.newPage(); page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(6000);
    const docs = new Map();
    for(const w of [320,390,680,768,841,1280,1440]){
      await page.setViewportSize({width:w,height:w<700?844:900});
      for(const path of routes){
        await page.goto(origin+path);
        const data=await page.evaluate(async()=>{
          await document.fonts.ready;
          await Promise.all([...document.querySelectorAll('img[src]')].map(async im=>{im.loading='eager';await im.decode();}));
          return {overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelectorAll('h1').length,ids:[...document.querySelectorAll('[id]')].map(e=>e.id),
            title:document.title,descriptions:[...document.images].every(i=>i.hasAttribute('alt')),text:document.body.innerText,
            urls:[...document.querySelectorAll('a[href],img[src],link[href],script[src]')].map(e=>e.getAttribute('href')||e.getAttribute('src')).filter(Boolean)};
        });
        assert(data.overflow<2,path+' overflow '+w+' '+data.overflow);assert.equal(data.h1,1,path);assert(data.title && data.descriptions);assert.equal(data.ids.length,new Set(data.ids).size,path+' duplicate ids');
        assert(!/\b(Wade|Conklin|Mitchell)\b|Request an assessment|Fort Washakie/i.test(data.text),path+' unwanted name');
        for(const name of ['Call','Request a quote'])assert(await page.locator('.site-header').getByRole('link',{name,exact:true}).isVisible(),path+' '+name);
        if(w===320)docs.set(path,data);
        if([390,1440].includes(w) && path==='/')await page.screenshot({path:'qa/qa-home-'+w+'.jpg',type:'jpeg',quality:88,fullPage:true});
      }
      console.log('10 pages checked at '+w);
    }
    let refs=0;
    for(const [path,doc] of docs)for(const link of doc.urls){const u=new URL(link,origin+path);if(u.origin!==origin)continue;refs++;await fs.access(file(u));if(u.hash)assert(docs.get(u.pathname)?.ids.includes(decodeURIComponent(u.hash.slice(1))),path+' -> '+link);}
    await page.setViewportSize({width:390,height:844});await page.goto(origin+'/');
    assert(await page.evaluate(()=>document.fonts.check('italic 32px "Instrument Serif"') && document.fonts.check('600 32px "Barlow Condensed"')));const toggle=page.locator('#menu-toggle');await toggle.click();assert(await page.locator('#primary-nav').isVisible());await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    const first=page.locator('.photo-spread a').first();await first.click();const dialog=page.locator('dialog.photo-dialog');assert(await dialog.isVisible());assert.match(await dialog.locator('figcaption').innerText(),/1 of 2/);await dialog.getByRole('button',{name:'Next'}).click();assert.match(await dialog.locator('figcaption').innerText(),/2 of 2/);await page.keyboard.press('ArrowLeft');assert.match(await dialog.locator('figcaption').innerText(),/1 of 2/);await page.keyboard.press('Escape');assert(!await dialog.isVisible());assert(await first.evaluate(e=>e===document.activeElement));
    await page.goto(origin+'/projects/jackson-commercial-roof/');await page.locator('.jackson-report-pair figure a').first().click();assert.match(await dialog.locator('figcaption').innerText(),/1 of 3/);await dialog.getByRole('button',{name:'Previous'}).click();assert.match(await dialog.locator('figcaption').innerText(),/3 of 3/);await dialog.getByRole('button',{name:'Close'}).click();
    await page.goto(origin+'/services/');const controls=page.locator('.sequence-controls button');await controls.nth(2).click();assert.equal(await controls.nth(2).getAttribute('aria-pressed'),'true');await page.locator('[data-play]').click();assert.match(await page.locator('[data-play]').innerText(),/pause/i);await page.locator('[data-play]').click();
    /*await page.goto(origin+'/contact/');assert.match(await page.locator('#quote-submit').innerText(),/email draft/i);for(const [id,val] of Object.entries({'location':'Riverton','concern':'Recurring leak at curb','name':'QA Example','contact':'qa@example.invalid'}))await page.locator('#estimate-'+id).fill(val);
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{document.body.dataset.copy=value;}}}));await page.locator('#copy-request').click();assert.match(await page.locator('body').getAttribute('data-copy'),/Recurring leak/);
    */const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});await setup(nojs);const tab=await nojs.newPage();await tab.goto(origin+'/');assert(await tab.locator('#primary-nav').isVisible());await tab.locator('.photo-spread a').first().click();assert(tab.url().endsWith('.webp'));await nojs.close();assert.deepEqual(errors,[]);console.log(refs+' internal URLs verified. Photo viewer, keyboard, contact, menu, service sequence and scripting-disabled checks passed.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});