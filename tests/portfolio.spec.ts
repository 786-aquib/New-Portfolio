import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const shots=path.resolve('verification');
test.beforeAll(()=>fs.mkdirSync(shots,{recursive:true}));
test.beforeEach(async({page})=>{await page.goto('/');await page.getByRole('heading',{name:'Aquib Mahmood.'}).waitFor();});

test('content, original résumé and self-hosted fonts are available',async({page,request})=>{
 await expect(page.getByRole('link',{name:'Explore payu-codex',exact:true})).toBeVisible();
 for(const file of ['InstrumentSerif-Regular.ttf','InstrumentSerif-Italic.ttf','Amiamie-Regular.woff2','Amiamie-Black.woff2','JetBrainsMono-Regular.woff2']){const r=await request.get(`/fonts/${file}`);expect(r.ok()).toBeTruthy();expect((await r.body()).length).toBeGreaterThan(10000)}
 const r=await request.get('/Aquib-Mahmood-Resume.pdf');expect(r.ok()).toBeTruthy();expect((await r.body()).equals(fs.readFileSync('public/Aquib-Mahmood-Resume.pdf'))).toBeTruthy();
 await expect(page.getByText('7754949404')).toHaveCount(0);
});
for(const theme of [{name:'Local AI',nodes:['Code','Context','Answer'],id:'payu-codex'},{name:'Product Systems',nodes:['Interface','Services','Outcome'],id:'payu-products'},{name:'Research Tools',nodes:['Articles','Screening','Evidence'],id:'easyslr'}]){
 test(`constellation: ${theme.name} completes, replays and opens the correct case study`,async({page})=>{
  await page.getByRole('button',{name:theme.name,exact:true}).click();
  for(const n of [...theme.nodes].reverse())await page.getByRole('button',{name:`Connect ${n}`,exact:true}).click();
  await expect(page.getByRole('link',{name:'Explore this work'})).toHaveAttribute('href',`/work?project=${theme.id}`);
  await page.getByRole('button',{name:'Replay constellation'}).click();
  await expect(page.getByRole('link',{name:'Explore this work'})).toHaveCount(0);
  for(const n of theme.nodes)await page.getByRole('button',{name:`Connect ${n}`,exact:true}).click();
  await page.getByRole('link',{name:'Explore this work'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();await expect(page).toHaveURL(new RegExp(`project=${theme.id}`));
 });
}
test('switching constellation themes resets progress',async({page})=>{await page.getByRole('button',{name:'Connect Code',exact:true}).click();await page.getByRole('button',{name:'Research Tools',exact:true}).click();await expect(page.getByRole('button',{name:'Connect Articles',exact:true})).toHaveAttribute('aria-pressed','false');await expect(page.getByRole('status').first()).toContainText('0 of 3 connected');});
test('search and categories combine, empty state resets, and URL state survives reload',async({page})=>{
 await page.goto('/work?search=Python&category=AI%20%26%20Developer%20Tools');
 await expect(page.getByRole('textbox',{name:'Search work'})).toHaveValue('Python');await expect(page.locator('.work-card')).toHaveCount(1);
 await page.getByRole('link',{name:'Explore payu-codex',exact:true}).click();await expect(page).toHaveURL(/search=Python/);await page.keyboard.press('Escape');await expect(page.getByRole('textbox',{name:'Search work'})).toHaveValue('Python');
 await page.getByRole('button',{name:'Research Platforms',exact:true}).click();await expect(page.getByText('No connections yet.')).toBeVisible();
 await page.reload();await expect(page.getByRole('button',{name:'Research Platforms',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Reset filters'}).click();await expect(page.locator('.work-card')).toHaveCount(3);
});
test('palette keyboard selection opens requested project; Escape restores focus',async({page})=>{
 const trigger=page.getByRole('button',{name:'Search command palette',exact:true});await trigger.click();
 const field=page.getByRole('combobox');await expect(field).toBeFocused();await field.fill('EasySLR');await field.press('ArrowDown');await field.press('Enter');
 await expect(page).toHaveURL(/project=easyslr/);const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog.getByRole('heading',{name:'EasySLR',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(page.getByRole('button',{name:'Search command palette',exact:true})).toBeFocused();
});
test('project modal traps focus, dismisses by backdrop and preserves browser history',async({page})=>{
 await page.goto('/work');await page.getByRole('link',{name:'Explore payu-codex',exact:true}).click();const dialog=page.getByRole('dialog');
 await expect(dialog).toBeVisible();await page.keyboard.press('Shift+Tab');await expect(dialog.getByRole('button',{name:'Back to work'})).toBeFocused();
 await page.keyboard.press('Tab');await expect(dialog.getByRole('button',{name:/Close payu-codex/})).toBeFocused();
 await page.mouse.click(5,5);await expect(dialog).toHaveCount(0);await expect(page).toHaveURL(/\/work$/);
 await page.goBack();await expect(page.getByRole('dialog')).toBeVisible();await page.goBack();await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('theme persists, clipboard handles success and failure, and résumé downloads',async({page,context})=>{
 await page.getByRole('button',{name:'Switch to light theme'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.goto('/contact');await context.grantPermissions(['clipboard-read','clipboard-write']);await page.getByRole('button',{name:'Copy email address'}).click();await expect(page.getByRole('status')).toHaveText('Email copied');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('Unavailable'))},configurable:true}));
 await page.getByRole('button',{name:'Copy email address'}).click();await expect(page.getByRole('status')).toContainText('Could not copy');
 const download=page.waitForEvent('download');await page.getByRole('link',{name:'Résumé',exact:true}).last().click();expect((await download).suggestedFilename()).toBe('Aquib-Mahmood-Resume.pdf');
});
test('theme switch fallback, unknown project and 404 retain a way home',async({page})=>{
 await page.evaluate(()=>Object.defineProperty(document,'startViewTransition',{value:undefined,configurable:true}));await page.getByRole('button',{name:'Switch to light theme'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.goto('/work?project=missing');await expect(page.getByText('This case study couldn’t be found.')).toBeVisible();await page.getByRole('button',{name:'Back to the collection'}).click();await expect(page).toHaveURL(/\/work$/);
 await page.goto('/not-a-real-route');await expect(page.getByRole('heading',{name:'Lost connection.'})).toBeVisible();await page.getByRole('link',{name:'Back to home'}).click();await expect(page.getByRole('heading',{name:'Aquib Mahmood.'})).toBeVisible();
});
test('reduced motion and pause stop ambient motion without changing scroll position',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');await expect(page.locator('.constellation')).not.toHaveClass(/is-moving/);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#skills').scrollIntoViewIfNeeded();const before=await page.evaluate(()=>scrollY);
 await page.getByRole('button',{name:'Pause animations',exact:true}).first().click();await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');const after=await page.evaluate(()=>scrollY);expect(Math.abs(before-after)).toBeLessThan(5);
});
for(const width of [1440,768,390,320]){
 test(`responsive ${width}px: no overflow, navigation, screenshots`,async({page})=>{
  await page.setViewportSize({width,height:1000});await page.getByRole('button',{name:'Pause animations',exact:true}).first().click();
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  if(width<640){await page.getByRole('button',{name:'Open navigation menu'}).click();await expect(page.getByRole('dialog',{name:'Navigation'})).toBeVisible();await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Contact'}).click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page).toHaveURL(/\/contact$/);await page.goto('/');}
  await page.screenshot({path:path.join(shots,`home-dark-${width}.png`),fullPage:true});
  await page.getByRole('button',{name:'Switch to light theme'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.screenshot({path:path.join(shots,`home-light-${width}.png`),fullPage:true});
  await page.goto('/work?project=payu-codex');await expect(page.getByRole('dialog')).toBeVisible();await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:path.join(shots,`case-study-${width}.png`)});await page.keyboard.press('Escape');
 });
}
test('all local routes render without browser errors',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['/','/work','/experience','/contact']){await page.goto(route);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('main')).not.toBeEmpty();}
 expect(errors).toEqual([]);
});
