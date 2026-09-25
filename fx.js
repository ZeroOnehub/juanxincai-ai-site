/* ============================================================
   卷心菜 · 炫酷特效层（fx.js）
   只负责视觉特效，不影响 script.js 的业务逻辑。
   所有特效在「减少动态效果」系统设置下自动关闭或降级。
   ============================================================ */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // 跑马灯里滚动展示的技能关键词，可自由修改
  const MARQUEE_WORDS = [
    "AI 文案",
    "Prompt 工程",
    "自动化流程",
    "内容工作流",
    "知识库搭建",
    "提案模板",
    "数据整理",
    "AI Agent",
  ];

  // 需要鼠标聚光效果的卡片
  const SPOT_SELECTOR = ".playground, .work-item, .process-step, .about-chat, .contact-panel, .demo-card";

  /* ---------- 1. 粒子神经网络背景 ---------- */

  function initParticles() {
    const canvas = document.createElement("canvas");
    canvas.className = "fx-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const LINK_DIST = 140;
    let w = 0;
    let h = 0;
    let points = [];
    let running = true;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 粒子数量随屏幕面积变化，手机上更少，保证流畅
      const count = Math.min(110, Math.floor((w * h) / 13000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
        hue: Math.random() < 0.18 ? "signal" : "accent",
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        // 鼠标附近的粒子被轻轻吸引
        const dxm = mouse.x - p.x;
        const dym = mouse.y - p.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 200 && dm > 1) {
          p.vx += (dxm / dm) * 0.012;
          p.vy += (dym / dm) * 0.012;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        // 保持最低漂移速度
        if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.05;
        if (Math.abs(p.vy) < 0.05) p.vy += (Math.random() - 0.5) * 0.05;

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      // 粒子间连线
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(138, 164, 255, ${(1 - d / LINK_DIST) * 0.22})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // 与鼠标之间的高亮连线
        const dMouse = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dMouse < 180) {
          ctx.strokeStyle = `rgba(201, 255, 90, ${(1 - dMouse / 180) * 0.45})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // 粒子本体
      for (const p of points) {
        ctx.fillStyle = p.hue === "signal" ? "rgba(201, 255, 90, 0.85)" : "rgba(173, 192, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      if (!running) return;
      draw();
      requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener(
      "pointermove",
      (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      },
      { passive: true },
    );
    document.addEventListener("pointerleave", () => {
      mouse.x = mouse.y = -9999;
    });

    // 切到后台标签页时暂停，省电
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden && !reduceMotion;
      if (running) loop();
    });

    if (reduceMotion) {
      running = false;
      draw(); // 只画一帧静态星图
    } else {
      loop();
    }
    requestAnimationFrame(() => canvas.classList.add("is-ready"));
  }

  /* ---------- 2. 极光 & Hero 网格地面 ---------- */

  function initAmbient() {
    const aurora = document.createElement("div");
    aurora.className = "fx-aurora";
    aurora.setAttribute("aria-hidden", "true");
    aurora.innerHTML = "<span></span><span></span><span></span>";
    document.body.prepend(aurora);

    const hero = document.querySelector(".hero");
    if (hero) {
      const grid = document.createElement("div");
      grid.className = "fx-hero-grid";
      grid.setAttribute("aria-hidden", "true");
      hero.prepend(grid);
    }
  }

  /* ---------- 3. 技能跑马灯 ---------- */

  function initMarquee() {
    const stats = document.querySelector(".stats-strip");
    if (!stats) return;
    const wrap = document.createElement("div");
    wrap.className = "fx-marquee";
    wrap.setAttribute("aria-hidden", "true");
    // 内容复制两份，平移 -50% 实现无缝循环
    const items = MARQUEE_WORDS.map((w) => `<span class="fx-marquee-item">${w}</span>`).join("");
    wrap.innerHTML = `<div class="fx-marquee-track">${items}${items}</div>`;
    stats.after(wrap);
  }

  /* ---------- 4. 卡片鼠标聚光 ---------- */

  function initSpotlight() {
    document.querySelectorAll(SPOT_SELECTOR).forEach((el) => el.classList.add("fx-spot"));
    if (!finePointer) return;

    let lit = null;
    document.addEventListener(
      "pointermove",
      (e) => {
        const card = e.target.closest?.(".fx-spot");
        if (lit && lit !== card) lit.classList.remove("is-lit");
        lit = card;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--sx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--sy", `${e.clientY - rect.top}px`);
        card.classList.add("is-lit");
      },
      { passive: true },
    );
  }

  /* ---------- 5. Hero 演示窗 3D 倾斜 ---------- */

  function initTilt() {
    const card = document.querySelector(".hero-demo");
    if (!card || !finePointer || reduceMotion) return;
    const MAX = 8; // 最大倾斜角度

    // 入场动画带 fill-mode，会覆盖行内 transform，所以播放完后移除它
    const settle = () => card.classList.add("fx-settled");
    card.addEventListener("animationend", (e) => {
      if (e.animationName === "heroFadeUp") settle();
    });
    setTimeout(settle, 1500);

    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateZ(0)`;
      card.classList.add("is-tilting");
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
      card.classList.remove("is-tilting");
    });
  }

  /* ---------- 6. 标题解码动画（乱码 → 正文） ---------- */

  const GLYPHS = "!<>-_\\/[]{}=+*^?#01AIアイウエオ░▒▓";

  function scramble(el) {
    if (el.dataset.fxDone) return;
    el.dataset.fxDone = "1";

    // 只处理纯文本节点，保留 <br>、<span> 等结构
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
    }
    const originals = nodes.map((n) => n.textContent);
    const total = originals.reduce((s, t) => s + t.length, 0);
    const duration = Math.min(1100, 300 + total * 28);
    const start = performance.now();

    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);
      let offset = 0;
      nodes.forEach((node, i) => {
        const text = originals[i];
        let out = "";
        for (let c = 0; c < text.length; c++) {
          const revealAt = (offset + c) / total;
          if (progress >= revealAt || text[c] === " ") out += text[c];
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        node.textContent = out;
        offset += text.length;
      });
      if (progress < 1) requestAnimationFrame(frame);
      else nodes.forEach((n, i) => (n.textContent = originals[i]));
    }
    requestAnimationFrame(frame);
  }

  function initScramble() {
    if (reduceMotion) return;
    const titles = document.querySelectorAll(".section-heading .section-title, .about-copy .section-title");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          scramble(e.target);
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.6 },
    );
    titles.forEach((t) => obs.observe(t));
  }

  /* ---------- 7. 点击火花 ---------- */

  function initClickSparks() {
    if (reduceMotion) return;
    document.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      const ring = document.createElement("span");
      ring.className = "fx-ring";
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      document.body.appendChild(ring);
      ring.addEventListener("animationend", () => ring.remove());

      for (let i = 0; i < 8; i++) {
        const s = document.createElement("span");
        s.className = "fx-spark";
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
        const dist = 28 + Math.random() * 26;
        s.style.left = `${e.clientX}px`;
        s.style.top = `${e.clientY}px`;
        s.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
        s.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
        document.body.appendChild(s);
        s.addEventListener("animationend", () => s.remove());
      }
    });
  }

  /* ---------- 启动（在 script.js 渲染完内容之后） ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    initAmbient();
    initParticles();
    initMarquee();
    initSpotlight();
    initTilt();
    initScramble();
    initClickSparks();
  });
})();
