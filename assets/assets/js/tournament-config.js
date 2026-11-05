/**
 * 대회별 신청 링크, 규정집, 모집 기간과 공식 중계 주소를 수정하는 파일입니다.
 *
 * tournaments.youth / tournaments.campus
 *   applicationUrl: 참가 신청 폼 주소
 *   rulesUrl: 공식 규정집 주소
 *   registrationOpensAt / registrationClosesAt: 모집 시작 / 마감 시각
 *
 * channels: YouTube / SOOP / 치지직 공식 중계 주소 (Youth·Campus 공통 채널)
 *
 * 날짜는 한국 시간대를 포함한 ISO 형식(YYYY-MM-DDTHH:mm:ss+09:00)을 사용합니다.
 * 시작 시각은 포함하고 마감 시각은 포함하지 않습니다. 11월 15일까지 모집하려면
 * 마감 시각을 11월 16일 00:00으로 설정합니다.
 *
 * applicationPreviewEnabled가 true이면 모집 시작 전에도 폼을 확인할 수 있습니다.
 * 모집 일정이 없거나 잘못된 경우에는 신청을 열지 않으며, 마감 후에도 차단합니다.
 * registrationDateOnly는 모집 기간을 시각 없이 날짜로 표시하는 옵션입니다.
 * 빈 주소는 연결하지 않고, 규정집은 모집 기간과 관계없이 공개할 수 있습니다.
 */
window.OWGS_CONFIG = {
  tournaments: {
    // 청소년 대회
    youth: {
      applicationUrl: 'https://first.nexon.com/thinker/direct/public/survey/Kf1zLhSHvv',
      applicationPreviewEnabled: true,
      rulesUrl: 'https://drive.google.com/file/d/1ZgJz44Laq7MWxbx0lezZBvv4_3is6oPO/view?usp=sharing',

      registrationOpensAt: '2026-11-04T00:00:00+09:00',
      registrationClosesAt: '2026-11-16T00:00:00+09:00',
      registrationDateOnly: true
    },

    // 대학생 대회
    campus: {
      applicationUrl: 'https://first.nexon.com/thinker/direct/public/survey/qPwDLlZDyw',
      applicationPreviewEnabled: true,
      rulesUrl: 'https://drive.google.com/file/d/1Itmncou-kPds0oLpRu8fDWr2pX5qA7pH/view?usp=sharing',

      registrationOpensAt: '2026-11-04T00:00:00+09:00',
      registrationClosesAt: '2026-11-16T00:00:00+09:00',
      registrationDateOnly: true
    }
  },

  // 공식 중계 채널: Youth·Campus 모두 같은 채널에서 중계합니다.
  // 공개 시 아래 빈 따옴표 안에 각 공식 채널의 전체 주소(https://...)를 입력하세요.
  // index.html의 #broadcast에서 Coming Soon 블록을 삭제하고 channel-grid의 주석을 해제하면 복원됩니다.
  // 주소를 비워 두면 해당 채널은 연결되지 않고 '준비 중'으로 표시됩니다.
  channels: {
    youtube: '', // YouTube 공식 중계 채널 주소
    chzzk: '', // 치지직 공식 중계 채널 주소
    soop: '' // SOOP 공식 중계 채널 주소
  }
};
