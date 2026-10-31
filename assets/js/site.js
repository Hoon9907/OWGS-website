// 상단 메뉴, 일정 진행 상태, 오시는 길 팝업을 처리합니다.
(() => {
  const body = document.body;

  // 모바일 메뉴의 열기·닫기와 포커스를 관리합니다.
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');

  function closeMenu() {
    body.classList.remove('menu-open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', '메뉴 열기');
  }

  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    body.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && body.classList.contains('menu-open')) {
      closeMenu();
      menu.focus();
    }
  });

  document.addEventListener('click', event => {
    if (!navigation?.contains(event.target) && !menu?.contains(event.target)) {
      closeMenu();
    }
  });

  navigation?.addEventListener('click', event => {
    if (event.target.closest('a')) {
      closeMenu();
    }
  });

  matchMedia('(min-width: 961px)').addEventListener('change', closeMenu);

  // 첫 화면을 지나면 헤더에 배경을 깔아 본문과 구분합니다.
  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // YOUTH / CAMPUS 탭: 주소의 ?tournament=youth|campus 로 바로 열 수 있습니다.
  document.querySelectorAll('[data-tabs]').forEach(tabList => {
    const tabs = [...tabList.querySelectorAll('[role="tab"]')];
    const requested = new URLSearchParams(location.search).get('tournament');

    function select(tab, updateUrl) {
      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
      });

      if (updateUrl) {
        const url = new URL(location.href);
        url.searchParams.set('tournament', tab.dataset.edition);
        history.replaceState(null, '', url);
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab, true));
      tab.addEventListener('keydown', event => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
        if (step) {
          const next = tabs[(index + step + tabs.length) % tabs.length];
          select(next, true);
          next.focus();
        }
      });
    });

    select(tabs.find(tab => tab.dataset.edition === requested) || tabs[0], false);
  });

  // 일정 카드: 한국 시간 기준으로 종료 / 진행 중 / 다음 일정을 순서대로 표시합니다.
  // data-start, data-end는 한국 시간 날짜(YYYY-MM-DD)이며 종료일 당일까지 포함합니다.
  const stages = [...document.querySelectorAll('[data-stage-start]')];
  const stageLabels = { done: '종료', live: '진행 중', next: '다음 일정' };

  function kstDay(value, endOfDay) {
    return Date.parse(`${value}T00:00:00+09:00`) + (endOfDay ? 86400000 : 0);
  }

  function updateStages() {
    const now = Date.now();
    let nextAssigned = false;

    stages.forEach(stage => {
      const start = kstDay(stage.dataset.stageStart, false);
      const end = kstDay(stage.dataset.stageEnd || stage.dataset.stageStart, true);
      let state = 'upcoming';

      if (now >= end) {
        state = 'done';
      } else if (now >= start) {
        state = 'live';
        nextAssigned = true;
      } else if (!nextAssigned) {
        state = 'next';
        nextAssigned = true;
      }

      stage.dataset.state = state;
      const label = stage.querySelector('.stage-state');
      if (label) {
        label.textContent = stageLabels[state] || '';
        label.hidden = !stageLabels[state];
      }
    });
  }

  if (stages.length) {
    updateStages();
    setInterval(updateStages, 60000);
  }

  // 오시는 길: 지도는 팝업으로 보여줍니다.
  const venueDialog = document.querySelector('#venue-dialog');

  document.querySelectorAll('[data-venue-open]').forEach(button => {
    button.addEventListener('click', () => {
      if (typeof venueDialog?.showModal === 'function') {
        venueDialog.showModal();
      }
    });
  });

  // 팝업 바깥(배경)을 누르면 닫습니다.
  venueDialog?.addEventListener('click', event => {
    if (event.target === venueDialog) {
      venueDialog.close();
    }
  });
})();

// Scroll motion is progressive enhancement: content stays visible without JS.
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const selector = '.section-head, .register-card, .stage, .info-item, .prize-total, .prize-card, .channel, .page-links > a, .more-link, .page-hero .container';
  const targets = [...document.querySelectorAll(selector)];
  const animations = new Set();
  let stopped = false;

  const reveal = element => {
    if (!element.classList.contains('motion-pending')) return;
    element.classList.remove('motion-pending');
    observer.unobserve(element);
    if (stopped || element.contains(document.activeElement)) return;

    const siblings = [...element.parentElement.children].filter(item => item.matches(selector));
    const delay = Math.min(Math.max(siblings.indexOf(element), 0) * 75, 225);
    const animation = element.animate([
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 650, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));

    const label = element.querySelector('.eyebrow');
    if (label) {
      label.classList.add('glitch-enter');
      label.addEventListener('animationend', () => label.classList.remove('glitch-enter'), { once: true });
    }
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  targets.forEach(element => {
    // Do not hide the initial viewport or a parent of another reveal target.
    if (element.querySelector(selector) || element.getBoundingClientRect().top < innerHeight) return;
    element.classList.add('motion-pending');
    observer.observe(element);
  });

  document.addEventListener('focusin', event => {
    const target = event.target.closest('.motion-pending');
    if (target) reveal(target);
  });

  motion.addEventListener('change', event => {
    if (!event.matches) return;
    stopped = true;
    observer.disconnect();
    targets.forEach(element => element.classList.remove('motion-pending'));
    animations.forEach(animation => animation.cancel());
    animations.clear();
  });
})();
