// // 故事内容（可自行扩展）
// const storyScenes = [
//     {
//         title: 'Story Setting',
//         subtitle: 'In a peaceful village, the Mouse King led his army to steal food, leaving the villagers hungry and desperate. To protect the granary and the village, the people chose a black cat warrior—Shadowpaw. He embarks on an adventure, fighting through many levels, battling the mouse army, and finally defeating the Mouse King to reclaim all the food and become the village hero.'
//     },
//     {
//         title: 'Lightning Rogue: Black Cat Granary Heist',
//         subtitle: 'The harvest season should be full of laughter, but the granary of Oak Village is dead silent. Moonlight shines through the old wooden window, illuminating the scattered grain and the shocking claw marks on the wall. I—a one-eyed black cat—crouch on the highest beam, overlooking the scene of disaster.'
//     },
//     {
//         title: 'The Mystery of the Theft',
//         subtitle: '“It was here,” whispered the little girl Lily, her golden braids shining in the moonlight. “Last week there were twenty full sacks of wheat, now there’s only this much.” I flicked my tail, the scar over my right eye aching faintly. After that battle with the stray dogs three years ago, I swore never to fight again. But seeing Lily’s swollen eyes and her father’s cracked hands, I felt a long-lost fire in my veins.'
//     },
//     {
//         title: 'Mouse Army Appears',
//         subtitle: 'Five mice came out in line from the wall hole, each carrying a mini backpack. More astonishingly, they held mini shields made from sewing needles and bottle caps, and had sharpened toothpicks as spears. The leader of the mice sniffed, suddenly raised its paw to signal to stop. "I smell cat smell!" it squeaked. '
//     },
//     {
//         title: 'Black Cat Assault',
//         subtitle: 'Before Lily could scream, I rushed out. My one-eyed balance was unaffected, and I twisted in the air, claws unsheathed. The leader mouse hurriedly raised its shield, but I stepped on its shield and jumped, tail whipping across the second mouse’s face.'
//     },
//     {
//         title: 'Crisis Escalation',
//         subtitle: '"Send an alarm!" one mouse squeaked, pulling out a small whistle. I kicked the grain bag, drawing a black lightning-like trajectory in the air, and bit down on that cursed whistle. When I landed, I rolled over with a flip, and three mice were knocked over by me. The last one that tried to escape was hit by my tail into the flour pile, splattering a white mist.'
//     },
//     {
//         title: 'Mystery Clue',
//         subtitle: '"This is no ordinary theft," I pointed to the neatly bundled grain samples in their backpacks, "they are collecting the best grain." Suddenly, I noticed one mouse wearing a strange collar around its neck, with weird blue moss growing on it. As I was about to examine it closely, the collar suddenly "popped" and the moss withered into gray.'
//     },
//     {
//         title: 'Mouse Path Tracking',
//         subtitle: '"Mr. Lightning! Above!" Lily suddenly shouted. I looked up and saw dozens of armed mice perched on the beam, aiming tiny crossbows at us. The next second, a torrent of pumpkin seeds rained down.'
//     },
//     {
//         title: 'Fishy Weaponry',
//         subtitle: '"Hide!" I bit Lily’s collar and ran towards the wall corner, while pulling out dried fish from my universal vest. These were no ordinary snacks—they were my secret weapon. I stood on my hind legs, my front paws moved like a western gunfighter, and the dried fish spun towards the mouse army.'
//     },
//     {
//         title: 'Underground Adventure',
//         subtitle: 'The underground passage was wider than imagined, with glowing fungi on the walls, creating eerie blue road signs. I crept forward, my ears alertly rotating. I heard uniform footsteps—the patrol team. I stuck to the wall, waiting for them to pass before suddenly attacking.'
//     },
//     {
//         title: 'Friendly Whiskers',
//         subtitle: 'Following the sound, the tunnel led to a cell made from tin cans. Inside was a thin, weak mouse wearing goggles, fiddling with a device. "They are controlled by mushrooms, and I know how to crack the signal," I hesitated for less than a second and cut the tin can lock. Whiskers—it called itself—agilely climbed onto my shoulder, pointing to the depths of the tunnel: "The throne room is below, but first, we need to go to the armory, I need materials to upgrade your equipment."'
//     },
//     {
//         title: 'Equipment Upgrade',
//         subtitle: '"Extend your front paws," Whiskers jumped onto a workbench, quickly assembling parts, "those idiots only imitate human weapons, but true power lies in—""Biomechanics?" I interjected, watching it fix a metal wristguard on my right front leg. "In fish!" it pressed a button, the wristguard "click" opened, revealing six loading slots, "put your dried fish in."'
//     },
//     {
//         title: 'Battle Preparations',
//         subtitle: 'The cellar door suddenly burst open, a large gray mouse wearing full knight armor and twenty-odd fully armed soldiers rushed in. Its left eye had a scar, exactly opposite to my right eye scar. "Ah ha!" the gray mouse general roared, "traitors and intruders! Bonecrusher will personally execute you!"'
//     },
//     {
//         title: 'Lightning Clash',
//         subtitle: '"For Mushroom King!" "For dinner!" I roared and leaped, my front paws swung, six accelerated fish darts shot out in a fan shape. In the explosion of fire, I saw the true outline of this conspiracy—on the distant wall, a huge mushroom totem painted with fungus was emitting an eerie blue light...'
//     }
// ];
// let storyIdx = 0;

// function updateStoryUI() {
//     document.getElementById('story-title').innerText = storyScenes[storyIdx].title;
//     document.getElementById('story-subtitle').innerText = storyScenes[storyIdx].subtitle;
//     document.getElementById('story-next').innerText = (storyIdx < storyScenes.length - 1 ? 'Next' : 'Start Game');
//     document.getElementById('lang-btn').innerText = 'English';
// }

// document.getElementById('story-next').onclick = function () {
//     if (storyIdx < storyScenes.length - 1) {
//         storyIdx++;
//         updateStoryUI();
//     } else {
//         document.getElementById('story-panel').style.display = 'none';
//         // 可在此处启动主游戏
//     }
// };
// document.getElementById('lang-btn').onclick = function () {
//     storyLang = (storyLang === 'zh') ? 'en' : 'zh';
//     updateStoryUI();
// };

// // 自动淡入淡出动画
// const panel = document.getElementById('story-panel');
// panel.style.opacity = 0;
// setTimeout(() => { panel.style.transition = 'opacity 0.7s'; panel.style.opacity = 1; }, 100);

// updateStoryUI();

// // ========== 加载界面人物对话 ========== //
// const loadingDialog = [
//     { speaker: 'lily', text: 'Mr. Lightning, can you really help us?' },
//     { speaker: 'cat', text: "Don't worry, Lily. This time, the mice won't get away." },
//     { speaker: 'lily', text: 'But they seem so smart, and have strange equipment...' },
//     { speaker: 'cat', text: 'No matter their gear, nothing can stop my flying fishbones!' },
//     { speaker: 'lily', text: 'Go, Lightning Rogue!' }
// ];
// let dialogIdx = 0;
// let dialogTimer = null;
// function showLoadingDialog() {
//     const box = document.getElementById('dialog-box');
//     if (!box) return;
//     box.innerHTML = '';
//     const d = loadingDialog[dialogIdx];
//     // 左右头像与气泡
//     let html = '';
//     if (d.speaker === 'lily') {
//         html = `<div style="display:flex;align-items:flex-end;">
//       <div style="width:54px;height:54px;border-radius:50%;background:#ffe066;display:flex;align-items:center;justify-content:center;font-size:2em;margin-right:12px;">👧</div>
//       <div style="background:#fff;color:#222;padding:12px 18px;border-radius:18px 18px 18px 6px;max-width:320px;box-shadow:0 2px 8px #0002;">
//         <div style="font-size:1em;font-weight:bold;margin-bottom:2px;">Lily</div>
//         <div style="font-size:1.1em;">${d.text}</div>
//       </div>
//     </div>`;
//     } else {
//         html = `<div style="display:flex;align-items:flex-end;flex-direction:row-reverse;">
//       <div style="width:54px;height:54px;border-radius:50%;background:#222;display:flex;align-items:center;justify-content:center;font-size:2em;color:#ffe066;margin-left:12px;">🐾</div>
//       <div style="background:#222;color:#fff;padding:12px 18px;border-radius:18px 18px 6px 18px;max-width:320px;box-shadow:0 2px 8px #0002;">
//         <div style="font-size:1em;font-weight:bold;margin-bottom:2px;">Black Cat</div>
//         <div style="font-size:1.1em;">${d.text}</div>
//       </div>
//     </div>`;
//     }
//     box.innerHTML = html;
//     document.getElementById('skip-dialog').style.display = (dialogIdx < loadingDialog.length - 1) ? '' : 'none';
// }
// function nextDialog() {
//     dialogIdx++;
//     if (dialogIdx < loadingDialog.length) {
//         showLoadingDialog();
//         dialogTimer = setTimeout(nextDialog, 1800);
//     } else {
//         // 对话结束，自动隐藏loading-screen（与进度条同步）
//         document.getElementById('dialog-box').innerHTML = '';
//         document.getElementById('skip-dialog').style.display = 'none';
//         tryStartLoadingToMain();
//     }
// }
// function startLoadingDialog() {
//     dialogIdx = 0;
//     showLoadingDialog();
//     if (dialogTimer) clearTimeout(dialogTimer);
//     dialogTimer = setTimeout(nextDialog, 1800);
// }
// document.getElementById('skip-dialog').onclick = function () {
//     if (dialogTimer) clearTimeout(dialogTimer);
//     dialogIdx = loadingDialog.length - 1;
//     showLoadingDialog();
//     document.getElementById('dialog-box').innerHTML = '';
//     document.getElementById('skip-dialog').style.display = 'none';
//     tryStartLoadingToMain();
// };
// // 多语言切换时同步对话内容
// const oldLangBtn = document.getElementById('lang-btn');
// if (oldLangBtn) {
//     oldLangBtn.addEventListener('click', () => {
//         if (document.getElementById('loading-screen').style.display !== 'none') showLoadingDialog();
//     });
// }
// // 启动时自动播放对话
// window.addEventListener('DOMContentLoaded', startLoadingDialog);

// // ========== 加载界面滚动故事背景 ========== //
// const storyBackground = {
//     zh: '在一个宁静的村庄，鼠王带领鼠军团不断偷取村庄的粮食，导致村民食不果腹、民不聊生。村里的村长拿出他仅剩的板块玉米饼给黑猫作为干粮，准备出去为村民抢回自己的粮食。为了保卫粮仓、守护村庄，人们选出了一个黑猫战士——喵影。\n他机智、敏捷、善用鱼类作战武器。他踏上冒险之路，要穿越多重关卡，与鼠军激战，最终打败 Boss 鼠王，夺回所有粮食，成为村庄的英雄。',;
// en: 'In a peaceful village, the Mouse King led his army to steal food, leaving the villagers hungry and desperate. The village chief gave his last piece of cornbread to the black cat as rations, hoping he could reclaim the stolen food. To protect the granary and the village, the people chose a black cat warrior—Shadowpaw.\nClever, agile, and skilled with fish weapons, he embarks on an adventure, fighting through many levels, battling the mouse army, and finally defeating the Mouse King to reclaim all the food and become the village hero.';
// };
// var storyScrollIdx = 0;
// var storyScrollTimer = null;
// var storyScrollDone = false;
// let loadingToMainTimer = null;
// function tryStartLoadingToMain() {
//     // 故事滚动和对话都结束后，开始20秒倒计时
//     if (storyScrollDone && dialogIdx >= loadingDialog.length - 1 && !loadingToMainTimer) {
//         loadingToMainTimer = setTimeout(() => {
//             // 隐藏加载界面，显示主界面
//             const loading = document.getElementById('loading-screen');
//             const main = document.getElementById('game-main');
//             if (loading) loading.style.opacity = '0';
//             setTimeout(() => {
//                 if (loading) loading.style.display = 'none';
//                 if (main) main.style.display = '';
//             }, 600);
//         }, 20000); // 20秒;
//     }
// }
// function showStoryScrollBox() {
//     const box = document.getElementById('story-scroll-box');
//     const title = document.getElementById('story-media-title');
//     const img = document.getElementById('story-media-img');
//     if (!box || !title || !img) return;
//     box.innerHTML = '';
//     storyScrollIdx = 0;
//     storyScrollDone = false;
//     title.innerText = storyBackground[storyLang].title;
//     img.src = storyBackground[storyLang].img;
//     if (storyScrollTimer) clearTimeout(storyScrollTimer);
//     typewriterEffect();
// }
// function typewriterEffect() {
//     const box = document.getElementById('story-scroll-box');
//     const txt = storyBackground[storyLang];
//     if (!box || !txt) return;
//     storyScrollIdx++;
//     box.innerHTML = txt.slice(0, storyScrollIdx).replace(/\n/g, '<br>');
//     if (storyScrollIdx < txt.length) {
//         storyScrollTimer = setTimeout(typewriterEffect, 18);
//     } else {
//         storyScrollDone = true;
//         document.getElementById('enter-game-btn').style.display = '';
//     }
// }
// function skipStoryScroll() {
//     if (storyScrollTimer) clearTimeout(storyScrollTimer);
//     const box = document.getElementById('story-scroll-box');
//     const txt = storyBackground[storyLang];
//     box.innerHTML = txt.replace(/\n/g, '<br>');
//     storyScrollDone = true;
//     document.getElementById('enter-game-btn').style.display = '';
// }
// // 语言切换时重置滚动、标题、图片
// var langBtn = document.getElementById('lang-btn');
// if (langBtn) {
//     langBtn.addEventListener('click', () => {
//         showStoryScrollBox();
//         document.getElementById('enter-game-btn').style.display = 'none';
//     });
// }
// // 启动时自动播放滚动故事
// window.addEventListener('DOMContentLoaded', showStoryScrollBox);
// // 跳过按钮也跳过滚动故事
// var skipBtn = document.getElementById('skip-dialog');
// if (skipBtn) {
//     skipBtn.addEventListener('click', skipStoryScroll);
// }
// // 进入游戏按钮
// var enterBtn = document.getElementById('enter-game-btn');
// if (enterBtn) {
//     enterBtn.onclick = function () {
//         document.getElementById('loading-screen').style.opacity = '0';
//         setTimeout(() => {
//             document.getElementById('loading-screen').style.display = 'none';
//             document.getElementById('game-main').style.display = '';
//         }, 600);
//     };
// }

// // ========== 媒体风格故事内容 ========== //
// const storyMedia = {
//     zh: {
//         title: '黑猫粮仓战记：序章',;
//     img: 'story1.jpg',;
// text: '在一个宁静的村庄，鼠王带领鼠军团不断偷取村庄的粮食，导致村民食不果腹、民不聊生。村里的村长拿出他仅剩的板块玉米饼给黑猫作为干粮，准备出去为村民抢回自己的粮食。为了保卫粮仓、守护村庄，人们选出了一个黑猫战士——喵影。\n他机智、敏捷、善用鱼类作战武器。他踏上冒险之路，要穿越多重关卡，与鼠军激战，最终打败 Boss 鼠王，夺回所有粮食，成为村庄的英雄。';
//   }, ;
// en: {
//     title: 'Black Cat Granary Saga: Prologue',;
//     img: 'story1.jpg',;
//     text: 'In a peaceful village, the Mouse King led his army to steal food, leaving the villagers hungry and desperate. The village chief gave his last piece of cornbread to the black cat as rations, hoping he could reclaim the stolen food. To protect the granary and the village, the people chose a black cat warrior—Shadowpaw.\nClever, agile, and skilled with fish weapons, he embarks on an adventure, fighting through many levels, battling the mouse army, and finally defeating the Mouse King to reclaim all the food and become the village hero.';
// }
// };
// var storyScrollIdx = 0;
// var storyScrollTimer = null;
// var storyScrollDone = false;
// function showStoryScrollBox() {
//     const box = document.getElementById('story-scroll-box');
//     const title = document.getElementById('story-media-title');
//     const img = document.getElementById('story-media-img');
//     if (!box || !title || !img) return;
//     box.innerHTML = '';
//     storyScrollIdx = 0;
//     storyScrollDone = false;
//     title.innerText = storyMedia[storyLang].title;
//     img.src = storyMedia[storyLang].img;
//     if (storyScrollTimer) clearTimeout(storyScrollTimer);
//     typewriterEffect();
// }
// function typewriterEffect() {
//     const box = document.getElementById('story-scroll-box');
//     const txt = storyMedia[storyLang].text;
//     if (!box || !txt) return;
//     storyScrollIdx++;
//     box.innerHTML = txt.slice(0, storyScrollIdx).replace(/\n/g, '<br>');
//     if (storyScrollIdx < txt.length) {
//         storyScrollTimer = setTimeout(typewriterEffect, 18);
//     } else {
//         storyScrollDone = true;
//         document.getElementById('enter-game-btn').style.display = '';
//     }
// }
// function skipStoryScroll() {
//     if (storyScrollTimer) clearTimeout(storyScrollTimer);
//     const box = document.getElementById('story-scroll-box');
//     const txt = storyMedia[storyLang].text;
//     box.innerHTML = txt.replace(/\n/g, '<br>');
//     storyScrollDone = true;
//     document.getElementById('enter-game-btn').style.display = '';
// }
// // 语言切换时重置滚动、标题、图片
// var langBtn = document.getElementById('lang-btn');
// if (langBtn) {
//     langBtn.addEventListener('click', () => {
//         showStoryScrollBox();
//         document.getElementById('enter-game-btn').style.display = 'none';
//     });
// }
// // 启动时自动播放滚动故事
// window.addEventListener('DOMContentLoaded', showStoryScrollBox);
// // 跳过按钮也跳过滚动故事
// var skipBtn = document.getElementById('skip-dialog');
// if (skipBtn) {
//     skipBtn.addEventListener('click', skipStoryScroll);
// }
// // 进入游戏按钮
// var enterBtn = document.getElementById('enter-game-btn');
// if (enterBtn) {
//     enterBtn.onclick = function () {
//         document.getElementById('loading-screen').style.opacity = '0';
//         setTimeout(() => {
//             document.getElementById('loading-screen').style.display = 'none';
//             document.getElementById('game-main').style.display = '';
//         }, 600);
//     };
// }

// // ========== 新闻风格故事渲染 ========== //
// function renderNewsStory(lang) {
//     const content = document.getElementById('news-story-content');
//     content.innerHTML = '';
//     storyScenes.forEach(scene => {
//         const chapter = document.createElement('div');
//         chapter.className = 'news-chapter';
//         const title = document.createElement('div');
//         title.className = 'news-chapter-title';
//         title.innerText = scene.title[lang] || '';
//         const subtitle = document.createElement('div');
//         subtitle.className = 'news-chapter-subtitle';
//         subtitle.innerText = scene.subtitle[lang] || '';
//         chapter.appendChild(title);
//         chapter.appendChild(subtitle);
//         content.appendChild(chapter);
//     });
// }
// let newsLang = 'zh';
// document.getElementById('news-lang-btn').onclick = function () {
//     newsLang = (newsLang === 'zh') ? 'en' : 'zh';
//     this.innerText = (newsLang === 'zh') ? 'English' : '中文';
//     renderNewsStory(newsLang);
// };
// renderNewsStory(newsLang);
// document.getElementById('news-start-btn').onclick = function () {
//     document.getElementById('news-story-panel').style.display = 'none';
//     document.getElementById('game-main').style.display = '';
//     // 可在此处添加更多游戏启动逻辑
// };

// // ========== 杂志风格新闻介绍渲染 ========== //
// function renderMagazineStory(lang) {
//     // 主新闻
//     const lead = storyScenes[0];
//     document.getElementById('magazine-lead-title').innerText = lead.title[lang] || '';
//     document.getElementById('magazine-lead-desc').innerText = lead.subtitle[lang] || '';
//     document.getElementById('magazine-lead-img').src = 'story1.jpg'; // 可自定义主图;

//     // Most Read 列表
//     const list = document.getElementById('magazine-mostread-list');
//     list.innerHTML = '';
//     for (let i = 1; i < storyScenes.length; i++) {
//         const scene = storyScenes[i];
//         const item = document.createElement('div');
//         item.className = 'magazine-mostread-item';
//         item.innerHTML = `;
//       <div class="magazine-mostread-num">${i}</div>;
//       <div class="magazine-mostread-content">;
//         <div class="magazine-mostread-chapter">${scene.title[lang] || ''}</div>;
//         <div class="magazine-mostread-desc">${scene.subtitle[lang] || ''}</div>;
//       </div>;
//     `;
//         list.appendChild(item);
//     }
// }
// let magazineLang = 'zh';
// document.getElementById('magazine-lang-btn').onclick = function () {
//     magazineLang = (magazineLang === 'zh') ? 'en' : 'zh';
//     this.innerText = (magazineLang === 'zh') ? 'English' : '中文';
//     renderMagazineStory(magazineLang);
// };
// renderMagazineStory(magazineLang);
// document.getElementById('magazine-start-btn').onclick = function () {
//     document.getElementById('news-magazine-panel').style.display = 'none';
//     document.getElementById('game-main').style.display = '';
//     // 可在此处添加更多游戏启动逻辑
// };