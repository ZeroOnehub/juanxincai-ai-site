# DESIGN.md

> 为 AI 自由职业接单者打造一个深色、专业、可信、可持续经营的个人品牌首页，让潜在客户在 5 秒内理解你的身份、能力和合作价值。

## 1. Visual Theme & Atmosphere

**Style**: Dark Professional AI Portfolio  
**Keywords**: 深色专业、结果导向、可信、冷静、轻科技感、咨询感、留白、转化优先  
**Tone**: 像一个高水平 AI 顾问的品牌首页，强调效率和增长，而不是炫技展示 — NOT 赛博朋克、游戏感、过度未来风、花哨实验性  
**Feel**: 像深夜还亮着灯的顾问工作台，信息清晰、语气笃定、每个按钮都在推动成交。  

**Interaction Tier**: L3 炫酷沉浸（原为 L1，按用户要求升级，见第 7 节 “FX Layer”）  
**Dependencies**: CSS + 原生 JS（仅用于 scroll reveal / 锚点体验，不引入重动画库）  

**Hero Messaging**
- 主标题：`用AI帮你提升效率、降低成本、创造增长`
- 副标题：`提供AI文案、Prompt工程、自动化解决方案`
- 首页核心目标：快速回答“你是谁”与“你能解决什么问题”，并把用户引导到联系动作

**Page Structure**
- 导航：品牌名、服务、作品、关于我、联系我
- 首屏 Hero：身份说明、价值主张、双 CTA、能力标签
- 服务能力：AI 文案、Prompt 工程、自动化方案
- AI 作品：精选案例 / 交付成果 / 可量化价值
- 背景与方法：你的经历、合作方式、适合客户
- 联系方式：微信 / 邮箱 / 表单 / 社媒入口

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds */
  --bg: #07090d;
  --surface: #0f141c;
  --surface-alt: #131a24;
  --surface-hover: #182131;

  /* Borders */
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(138, 164, 255, 0.36);

  /* Text */
  --text: #f3f6fb;
  --text-secondary: #a9b3c5;
  --text-tertiary: #6f7b91;

  /* Accent */
  --accent: #8aa4ff;
  --accent-hover: #adc0ff;
  --accent-soft: rgba(138, 164, 255, 0.14);
  --accent-strong: #d8e1ff;
  --signal: #c9ff5a;

  /* RGB variants for rgba() */
  --bg-rgb: 7, 9, 13;
  --accent-rgb: 138, 164, 255;

  /* Semantic */
  --success: #22c55e;
  --error: #f87171;
  --warning: #f59e0b;
}
```

**Color Rules:**
- 所有颜色通过 CSS 变量引用，禁止在组件内部硬编码 hex。
- 强调色只服务于 CTA、可点击链接、关键数字和高价值关键词，不用于大面积铺底。
- `--signal` 只作为点状提示或小徽章辅助色使用，避免把整体风格拉向荧光娱乐感。
- 同一块 section 内最多使用 1 个主强调色 + 1 个辅助信号色。
- 边框优先用透明白与冷蓝混合层次，而不是纯灰分割线。

## 3. Typography Rules

**Font Stack:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;700;800&display=swap');
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | "Noto Sans SC", "Inter", sans-serif | 72px | 800 | 1.05 | -0.04em |
| Section H2 | "Noto Sans SC", "Inter", sans-serif | 40px | 700 | 1.15 | -0.02em |
| H3 | "Noto Sans SC", "Inter", sans-serif | 24px | 700 | 1.3 | -0.01em |
| Body | "Noto Sans SC", "Inter", sans-serif | 16px | 400 | 1.78 | 0.02em |
| Label | "Inter", "Noto Sans SC", sans-serif | 13px | 600 | 1.4 | 0.08em |
| Mono/Code | "JetBrains Mono", "SFMono-Regular", monospace | 13px | 500 | 1.6 | 0 |

**Typography Rules:**
- 所有中文正文行高不低于 `1.7`，保证服务说明和案例描述易读。
- 标题权重保持 `700+`，正文最多到 `500`，避免整页显得“满屏加粗”。
- Hero 标题控制在 2 到 3 行内，使用短句断行，优先突出“效率 / 成本 / 增长”。
- 标签、导航、眉标题统一使用高字重 + 小字号 + 稍大字距，建立顾问式秩序感。
- 正文最小字号不低于 `15px`，移动端默认 `16px`。
- 代码感内容仅用于 Prompt、自动化、工作流标签，不用于大段正文。
- **NEVER use**: Orbitron、Poppins、手写体、夸张衬线体、无中文支持的英文字体单独充当主字体

**Text Decoration:**
- Hero H1：不使用渐变文字；仅允许在强调短语或关键词上使用 `color: var(--accent)`，并可加 `text-shadow: 0 0 32px rgba(var(--accent-rgb), 0.16)` 的极轻 glow。
- Section H2：不使用渐变和投影，保持纯净对比。
- Eyebrow / Label：可用 `border-bottom` 或小圆点强化层级。
- 正文段落：不使用任何阴影、渐变、描边或发光效果。

## 4. Component Stylings

### Buttons
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 999px;
  border: 1px solid transparent;
  font: 600 15px/1 "Inter", "Noto Sans SC", sans-serif;
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-primary {
  background: var(--accent);
  color: #07101f;
  box-shadow: 0 10px 28px rgba(var(--accent-rgb), 0.22);
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(var(--accent-rgb), 0.28);
}

.btn-primary:active {
  background: var(--accent-hover);
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(var(--accent-rgb), 0.18);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgba(var(--bg-rgb), 1),
    0 0 0 4px rgba(var(--accent-rgb), 0.44);
}

.btn-primary:disabled,
.btn-primary[aria-disabled="true"] {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-tertiary);
  box-shadow: none;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  border-color: var(--border);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-hover);
  transform: translateY(-1px);
}

.btn-secondary:active {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(0);
}

.btn-secondary:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.18);
}

.btn-secondary:disabled,
.btn-secondary[aria-disabled="true"] {
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-tertiary);
  border-color: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
}
```

### Cards
```css
.card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 28px;
  color: var(--text);
  transition:
    transform 0.24s ease,
    border-color 0.24s ease,
    background-color 0.24s ease,
    box-shadow 0.24s ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: var(--border-hover);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.028));
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(var(--accent-rgb), 0.06);
}

.card:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.14);
}
```

### Navigation
```css
.site-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(var(--bg-rgb), 0.72);
  border-bottom: 1px solid transparent;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: background-color 0.24s ease, border-color 0.24s ease;
}

.site-nav.is-scrolled {
  background: rgba(var(--bg-rgb), 0.9);
  border-bottom-color: var(--border);
}

.site-nav a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-nav a:hover,
.site-nav a[aria-current="page"] {
  color: var(--text);
}

.site-nav a:focus-visible {
  outline: 2px solid rgba(var(--accent-rgb), 0.5);
  outline-offset: 4px;
  border-radius: 10px;
}
```

### Links
```css
.text-link {
  position: relative;
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

.text-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0.35);
  transform-origin: left center;
  opacity: 0.7;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.text-link:hover {
  color: var(--accent-hover);
}

.text-link:hover::after {
  transform: scaleX(1);
  opacity: 1;
}

.text-link:active {
  color: var(--accent-strong);
}

.text-link:focus-visible {
  outline: 2px solid rgba(var(--accent-rgb), 0.45);
  outline-offset: 3px;
  border-radius: 6px;
}
```

### Tags / Badges
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  font: 600 12px/1 "Inter", "Noto Sans SC", sans-serif;
  letter-spacing: 0.08em;
}

.badge::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--signal);
  box-shadow: 0 0 12px rgba(201, 255, 90, 0.3);
}

.badge:hover {
  border-color: var(--border-hover);
  color: var(--text);
}

.badge:focus-visible {
  outline: 2px solid rgba(var(--accent-rgb), 0.45);
  outline-offset: 3px;
}
```

### Contact Panel
```css
.contact-panel {
  background:
    radial-gradient(circle at top right, rgba(var(--accent-rgb), 0.14), transparent 38%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.025));
  border: 1px solid var(--border);
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
}

.contact-panel:hover {
  border-color: var(--border-hover);
}

.contact-panel:focus-within {
  border-color: var(--accent);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.3),
    0 0 0 4px rgba(var(--accent-rgb), 0.14);
}
```

## 5. Layout Principles

**Container:**
- Max width: `1200px`
- Padding: desktop `32px`, tablet `24px`, mobile `20px`
- Narrow variant (text-heavy): `760px`

**Spacing Scale:**
- Section padding: `112px` desktop / `88px` tablet / `64px` mobile
- Component gap: `24px`
- Card internal padding: `28px`

**Content Hierarchy:**
- Hero 首屏左侧为价值文案，右侧为一张“能力总览 / 代表成果 / 工作方式”的视觉卡片，不使用复杂 3D 物件。
- 首页结构按“身份与价值 → 服务 → 作品 → 背景 → 联系”顺序排列，避免访客滚动过久才看到核心卖点。
- 服务与作品区可采用 3 列卡片，但每一块只突出一个核心信息，不堆叠长段落。
- 联系区必须在页面中出现至少 2 次 CTA：首屏 1 次、末屏 1 次。

**Grid:**
```css
.container {
  width: min(1200px, calc(100% - 64px));
  margin: 0 auto;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 40px;
  align-items: center;
}

.services-grid,
.works-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 32px;
}
```

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | `background: var(--bg)` | 页面主背景、页脚 |
| Subtle | `1px border + rgba(255,255,255,0.02)` | 默认标签、导航、分组容器 |
| Elevated | `linear-gradient(...) + 24px radius + 0 18px 40px rgba(0,0,0,0.28)` | 服务卡、作品卡、关于我摘要 |
| Highlight | `radial accent glow + elevated shadow` | Hero 视觉面板、联系面板、主 CTA 周边 |

**Depth Rules**
- 阴影只用于区分层级，不用于制造“漂浮游戏 UI”。
- 深色页面靠背景明度阶梯 + 细边框表达层级，避免大面积厚重投影。
- 同一屏最多 1 个显著 glow 容器，保证重心稳定。

## 7. Animation & Interaction

**Motion Philosophy**: 克制、稳定、可信，只让内容更好读，不让动效抢走成交注意力。  
**Tier**: L1

### Dependencies
```html
<!-- 无第三方动画库；仅使用原生 CSS + 原生 JS -->
```

### Base Setup
```js
function initScrollReveal(selector = ".reveal", activeClass = "in-view") {
  const elements = document.querySelectorAll(selector);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add(activeClass);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  elements.forEach((element) => observer.observe(element));
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
});
```

### Entrance Animation
```css
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

.hero-copy > * {
  opacity: 0;
  transform: translateY(12px);
  animation: heroFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.hero-copy > *:nth-child(1) { animation-delay: 0.05s; }
.hero-copy > *:nth-child(2) { animation-delay: 0.14s; }
.hero-copy > *:nth-child(3) { animation-delay: 0.23s; }
.hero-copy > *:nth-child(4) { animation-delay: 0.32s; }

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Scroll Behavior
```css
html {
  scroll-behavior: smooth;
}

[id] {
  scroll-margin-top: 96px;
}
```

```js
const nav = document.querySelector(".site-nav");

window.addEventListener("scroll", () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 12);
}, { passive: true });
```

### Hover & Focus States
```css
.card,
.btn,
.text-link,
.badge,
.social-link {
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.social-link:hover {
  color: var(--text);
  transform: translateY(-1px);
}

:focus-visible {
  outline: 2px solid rgba(var(--accent-rgb), 0.45);
  outline-offset: 3px;
}
```

### Special Effects
- Hero 右侧视觉卡允许使用 1 个低透明度径向光斑背景，制造轻微科技氛围。
- 徽章与关键数字可以使用极轻 glow，但正文、表单和案例描述不做发光。
- 不使用鼠标跟随、粒子、视差、打字机、全局光标替换。

### FX Layer（L3 升级，`fx.css` + `fx.js`）
> 用户要求“把网站做得炫酷一点”，以下特效覆盖上方“不使用鼠标跟随、粒子、视差”的限制。
- 背景：Canvas 粒子神经网络（鼠标吸引 + 高亮连线，后台标签页自动暂停）+ 3 个缓慢漂移的极光光斑
- Hero：透视网格地面滚动、轮换关键词流光渐变文字、演示窗旋转流光边框 + 扫描线 + 鼠标 3D 倾斜
- 卡片：鼠标位置聚光边框（`.fx-spot`，作用于工坊、流程、案例、关于、联系、demo 卡片）
- 标题：进入视口时乱码解码成正文
- 其他：统计区下方技能描边跑马灯、主按钮周期性光泽扫过、点击涟漪火花
- 所有特效在 `prefers-reduced-motion: reduce` 下关闭或只绘制静态帧；触屏设备不启用聚光与倾斜

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .reveal,
  .hero-copy > * {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

## 8. Do's and Don'ts

### Do
- 用一句清楚的人话解释你能为客户提升什么，而不是只列 AI 热词。
- 用卡片和短句呈现服务与案例，让潜在客户能快速扫描。
- 在首屏和末屏都提供明确联系动作。
- 保持深色背景、冷色强调和足够留白的统一关系。
- 所有可点击元素都提供 hover 与 focus 可见反馈。
- 作品区优先展示“问题 -> 方案 -> 结果”，而不是纯截图。

### Don't
- ❌ 不要把页面做成赛博朋克、黑客终端或游戏宣传页。
- ❌ 不要使用多种高饱和强调色同时竞争注意力。
- ❌ 不要把整页塞满发光边框、渐变字、玻璃卡片和重阴影。
- ❌ 不要在正文里堆满“赋能、生态、全链路、颠覆式”这类空泛词。
- ❌ 不要在首屏出现过多 CTA，主 CTA 最多 1 个，次 CTA 最多 1 个。
- ❌ 不要虚构客户 logo、成交数字或案例成果；没有真实数据就用中性占位。
- ❌ 不要让服务、作品、联系入口埋得太深。
- ❌ 不要在移动端保留双列 Hero 或过小按钮。
- ❌ 不要使用超过 `14px` 的大面积 `backdrop-filter`。
- ❌ 不要在未确认真实信息前写死你的姓名、头像、微信号、案例结果。

## 9. Responsive Behavior

**Breakpoints:**
| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | `>= 1200px` | Hero 双列，服务/作品 3 列，导航全量展开 |
| Tablet | `768px - 1199px` | Hero 改 1:1.1 双列或上下堆叠，服务/作品 2 列 |
| Mobile | `< 768px` | 所有 section 单列，CTA 宽度更大，导航折叠 |

**Touch Targets:** minimum `44px`  
**Collapsing Strategy:** Hero 先文案后视觉；服务、作品、背景、联系全部改为单列堆叠；导航折叠为按钮或抽屉；长句拆成更短行。

```css
@media (max-width: 1199px) {
  .container {
    width: min(100% - 48px, 1080px);
  }

  .hero-grid,
  .about-grid {
    grid-template-columns: 1fr;
  }

  .services-grid,
  .works-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-title {
    font-size: 56px;
  }
}

@media (max-width: 767px) {
  .container {
    width: calc(100% - 40px);
  }

  .services-grid,
  .works-grid {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 42px;
    line-height: 1.12;
    letter-spacing: -0.03em;
  }

  .section-title {
    font-size: 30px;
  }

  .btn {
    width: 100%;
  }

  .card,
  .contact-panel {
    padding: 22px;
    border-radius: 22px;
  }
}
```
