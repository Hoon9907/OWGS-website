// 설정된 주소와 모집 기간에 맞춰 신청·규정·중계 버튼의 링크와 상태를 갱신합니다.
(() => {
  const tournamentLinks = [
    ...document.querySelectorAll('[data-tournament][data-action]')
  ];
  const channelLinks = [...document.querySelectorAll('[data-channel]')];
  const tournamentIds = [
    ...new Set(tournamentLinks.map(link => link.dataset.tournament))
  ];

  const timeFormat = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });
  const dateFormat = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  let refreshTimer;

  function config() {
    return window.OWGS_CONFIG || {};
  }

  // 외부 주소와 한국 시간 기준 일시의 형식을 확인합니다.
  function externalUrl(value) {
    if (typeof value !== 'string' || !value.trim()) {
      return null;
    }

    try {
      const url = new URL(value.trim());
      return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
        ? url.href
        : null;
    } catch {
      return null;
    }
  }

  function timestamp(value) {
    // 방문자 기기의 시간대가 아닌, 설정에 명시된 시간대를 사용합니다.
    if (typeof value !== 'string') {
      return NaN;
    }

    const parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:Z|[+-]\d{2}:\d{2})$/.exec(value);

    if (!parts) {
      return NaN;
    }

    const [year, month, day, hour, minute, second] = parts
      .slice(1)
      .map(part => Number(part || 0));
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (
      month < 1
      || month > 12
      || day < 1
      || day > days[month - 1]
      || hour > 23
      || minute > 59
      || second > 59
    ) {
      return NaN;
    }

    return Date.parse(value);
  }

  // 모집 전·진행 중·마감 상태와 버튼에 표시할 문구를 계산합니다.
  function registration(tournament, now) {
    const opens = timestamp(tournament.registrationOpensAt);
    const closes = timestamp(tournament.registrationClosesAt);

    if (!Number.isFinite(opens) || !Number.isFinite(closes) || opens >= closes) {
      return {
        state: 'unannounced',
        label: '모집 일정 공개 예정',
        detail: '모집 예정'
      };
    }

    const period = tournament.registrationDateOnly
      ? `${dateFormat.format(opens)} ~ ${dateFormat.format(closes - 1)} (한국 시간)`
      : `${timeFormat.format(opens)} ~ ${timeFormat.format(closes)} (한국 시간)`;

    if (now < opens) {
      const url = tournament.applicationPreviewEnabled === true
        ? externalUrl(tournament.applicationUrl)
        : null;

      return {
        state: 'scheduled',
        label: '모집 시작 전',
        detail: url ? '확인하기 ↗' : '모집 예정',
        url,
        opens,
        closes,
        period
      };
    }

    if (now >= closes) {
      return {
        state: 'closed',
        label: '참가 모집이 마감되었습니다.',
        detail: '모집 마감',
        opens,
        closes,
        period
      };
    }

    const url = externalUrl(tournament.applicationUrl);
    return url
      ? {
        state: 'open',
        label: '참가 모집 중',
        detail: '확인하기 ↗',
        url,
        opens,
        closes,
        period
      }
      : {
        state: 'pending',
        label: '참가 신청 링크 준비 중',
        detail: '준비 중',
        opens,
        closes,
        period
      };
  }

  // 링크, 접근성 안내, 모집 상태와 기간을 화면에 반영합니다.
  function setLink(link, url, detail) {
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
      link.setAttribute('aria-label', `${link.dataset.label} (새 탭에서 열림)`);
    } else {
      link.removeAttribute('href');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('aria-label', `${link.dataset.label}: ${detail}`);
    }

    link.querySelector('.link-state').textContent = detail;
  }

  function refresh() {
    clearTimeout(refreshTimer);
    const now = Date.now();
    const settings = config();
    let nextRefresh = 60000;

    tournamentIds.forEach(id => {
      const tournament = settings.tournaments?.[id] || {};
      const status = registration(tournament, now);

      tournamentLinks
        .filter(link => link.dataset.tournament === id)
        .forEach(link => {
          if (link.dataset.action === 'application') {
            setLink(link, status.url, status.detail);
          } else {
            const url = externalUrl(tournament.rulesUrl);
            setLink(link, url, url ? '규정집 보기 ↗' : '공개 예정');
          }
        });

      document
        .querySelectorAll(`[data-registration-status="${id}"]`)
        .forEach(statusElement => {
          if (statusElement.textContent !== status.label) {
            statusElement.textContent = status.label;
          }

          statusElement.dataset.state = status.state;
        });

      document
        .querySelectorAll(`[data-registration-period="${id}"]`)
        .forEach(periodElement => {
          periodElement.hidden = !status.period;
          periodElement.textContent = status.period || '';
        });

      [status.opens, status.closes].forEach(boundary => {
        if (boundary > now) {
          nextRefresh = Math.min(nextRefresh, boundary - now + 10);
        }
      });
    });

    // 공식 중계는 Youth·Campus 공통 채널 하나로 운영합니다.
    channelLinks.forEach(link => {
      const url = externalUrl(settings.channels?.[link.dataset.channel]);
      setLink(link, url, url ? '채널 바로가기 ↗' : '준비 중');
    });

    if (!document.hidden) {
      refreshTimer = setTimeout(refresh, Math.max(20, nextRefresh));
    }
  }

  // 클릭 직전에도 상태를 갱신해, 오래 열린 페이지의 마감된 신청을 차단합니다.
  [...tournamentLinks, ...channelLinks].forEach(link => {
    const check = event => {
      refresh();
      if (link.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
      }
    };

    link.addEventListener('click', check);
    link.addEventListener('auxclick', check);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(refreshTimer);
    } else {
      refresh();
    }
  });

  window.addEventListener('focus', refresh);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('pagehide', () => clearTimeout(refreshTimer));
  refresh();
})();
