import type { Messages } from './en.js';

/** Korean UI strings. Typed as `Messages`, so a missing or extra key fails type-checking. */
export const ko: Messages = {
  // ── Common ──
  'common.close': '닫기',
  'common.gotIt': '확인',
  'common.loading': '불러오는 중...',
  'common.joinDiscord': 'Discord 참여하기!',

  // ── Bottom toolbar ──
  'toolbar.addAgent': '+ 에이전트',
  'toolbar.skipPermissions': '권한 확인 건너뛰기 모드',
  'toolbar.layout': '레이아웃',
  'toolbar.layoutTitle': '사무실 레이아웃 편집',
  'toolbar.settings': '설정',

  // ── Settings modal ──
  'settings.title': '설정',
  'settings.openSessionsFolder': '세션 폴더 열기',
  'settings.exportLayout': '레이아웃 내보내기',
  'settings.importLayout': '레이아웃 가져오기',
  'settings.assetDirPlaceholder': '에셋 디렉터리 절대 경로',
  'settings.add': '추가',
  'settings.addAssetDirectory': '에셋 디렉터리 추가',
  'settings.soundNotifications': '알림 소리',
  'settings.watchAllSessions': '모든 세션 보기',
  'settings.instantDetection': '즉시 감지 (Hooks)',
  'settings.alwaysShowLabels': '라벨 항상 표시',
  'settings.ghostHeadless': '헤드리스 에이전트를 유령으로 표시',
  'settings.showAreas': '구역 표시',
  'settings.debugView': '디버그 보기',
  'settings.language': '언어',

  // ── Layout import (standalone) ──
  'layout.replaceConfirm': '현재 레이아웃을 바꿀까요? 저장하지 않은 편집 내용은 사라집니다.',
  'layout.invalidFile': '올바르지 않은 레이아웃 파일입니다.',
  'layout.parseFailed': '레이아웃 파일을 읽거나 해석하지 못했습니다.',

  // ── Edit action bar ──
  'edit.undo': '실행 취소',
  'edit.undoTitle': '실행 취소 (Ctrl+Z)',
  'edit.redo': '다시 실행',
  'edit.redoTitle': '다시 실행 (Ctrl+Y)',
  'edit.save': '저장',
  'edit.saveTitle': '레이아웃 저장',
  'edit.reset': '초기화',
  'edit.resetTitle': '마지막으로 저장한 레이아웃으로 되돌리기',
  'edit.resetConfirm': '초기화할까요?',
  'edit.yes': '예',
  'edit.no': '아니요',
  'edit.rotateHint': '회전 (R)',

  // ── Layout editor toolbar ──
  'editor.furniture': '가구',
  'editor.furnitureTitle': '가구 배치',
  'editor.floor': '바닥',
  'editor.floorTitle': '바닥 타일 칠하기',
  'editor.walls': '벽',
  'editor.wallsTitle': '벽 칠하기 (클릭하여 전환)',
  'editor.pets': '펫',
  'editor.petsTitle': '펫 배치',
  'editor.areas': '구역',
  'editor.areasTitle': '폴더별 구역 지정 — 에이전트가 해당 폴더의 구역에 나타납니다',
  'editor.erase': '지우기',
  'editor.eraseTitle': '타일을 빈 공간으로 지우기',
  'editor.pick': '스포이트',
  'editor.pickFloorTitle': '기존 타일에서 바닥 패턴과 색상 가져오기',
  'editor.color': '색상',
  'editor.floorColorTitle': '바닥 색상 조정',
  'editor.floorPattern': '바닥 {n}',
  'editor.wallColorTitle': '벽 색상 조정',
  'editor.wallSet': '벽 {n}',
  'editor.areasHelp':
    '지도에 구역을 칠한 뒤 작업 폴더를 지정하세요. 에이전트는 자기 폴더의 구역에 앉습니다.',
  'editor.noAreas': '아직 구역이 없습니다 — 위에서 추가하세요',
  'editor.carpet': '카펫',
  'editor.carpetTitle': '카펫 칠하기',
  'editor.pickCarpetTitle': '기존 타일에서 카펫 종류와 색상 가져오기 (P)',
  'editor.pickFurnitureTitle': '배치된 가구에서 가구 종류 가져오기',
  'editor.carpetColorTitle': '카펫 주 색상 + 강조 색상 조정',
  'editor.furnitureColorTitle': '새 가구 색상 조정',
  'editor.carpetVariant': '카펫 {n}',
  'editor.main': '주 색상',
  'editor.accent': '강조 색상',
  'editor.selectedColorTitle': '선택한 가구 색상 조정',
  'editor.clear': '색상 제거',
  'editor.clearColorTitle': '색상 제거 (원래대로)',
  'editor.areaNamePlaceholder': '구역 이름…',
  'editor.addArea': '구역 추가',
  'editor.addAreaTitle': '새 구역 추가',
  'editor.areaColor': '구역 색상',
  'editor.renameAreaHint': '{label} — 더블클릭하여 이름 변경',
  'editor.removeArea': '구역 삭제',
  'editor.noFolders': '지정된 폴더 없음',
  'editor.unmapFolder': '폴더 지정 해제',
  'editor.allFoldersMapped': '모든 폴더가 이미 지정됨',
  'editor.mapFolder': '폴더 지정…',
  'editor.addFolder': '폴더 추가…',
  'editor.category.desks': '책상',
  'editor.category.chairs': '의자',
  'editor.category.storage': '수납',
  'editor.category.electronics': '전자기기',
  'editor.category.decor': '장식',
  'editor.category.wall': '벽',
  'editor.category.misc': '기타',

  // ── Color picker ──
  'color.hue': '색조',
  'color.saturation': '채도',
  'color.brightness': '밝기',
  'color.contrast': '대비',
  'color.colorize': '색 입히기',
  'color.colorizeTitle': '색 입히기 모드 전환',
  'color.reset': '초기화',
  'color.resetTitle': '기본값으로 되돌리기',

  // ── Zoom ──
  'zoom.in': '확대 (Ctrl+스크롤)',
  'zoom.out': '축소 (Ctrl+스크롤)',

  // ── Terminal drawer (standalone) ──
  'terminal.unavailable': '이 서버에서는 터미널을 사용할 수 없습니다.',
  'terminal.dragToResize': '드래그하여 크기 조절',
  'terminal.closePanel': '터미널 닫기',
  'terminal.agentTab': '에이전트 {id}',

  // ── Agent overlay ──
  'agent.needsApproval': '승인 필요',
  'agent.waitingForInput': '입력 대기 중',
  'agent.idle': '대기',
  'agent.subtask': '하위 작업',
  'agent.lead': '리더',
  'agent.close': '에이전트 닫기',
  'agent.contextUsage': '컨텍스트 {pct}% 사용 ({max}k 중 {used}k 토큰)',

  // ── Agent tool status (server sends English; translated at display time) ──
  'status.reading': '{file} 읽는 중',
  'status.editing': '{file} 편집 중',
  'status.writing': '{file} 작성 중',
  'status.running': '실행 중: {command}',
  'status.searchingFiles': '파일 검색 중',
  'status.searchingCode': '코드 검색 중',
  'status.fetchingWeb': '웹 콘텐츠 가져오는 중',
  'status.searchingWeb': '웹 검색 중',
  'status.subtask': '하위 작업: {description}',
  'status.runningSubtask': '하위 작업 실행 중',
  'status.waitingForAnswer': '답변 기다리는 중',
  'status.planning': '계획 세우는 중',
  'status.editingNotebook': '노트북 편집 중',
  'status.creatingTeamNamed': '팀 만드는 중: {team}',
  'status.creatingTeam': '팀 만드는 중',
  'status.sendingMessage': '메시지 보내는 중',
  'status.using': '{tool} 사용 중',

  // ── Debug view ──
  'debug.title': '디버그 보기',
  'debug.agent': '에이전트 #{id}',
  'debug.jsonlConnected': 'JSONL 연결됨',
  'debug.jsonlNotFound': 'JSONL 없음',
  'debug.lines': '줄 수: {count}',
  'debug.lastData': '마지막 데이터: {time}',
  'debug.projectDirMissing': '프로젝트 디렉터리가 없습니다: {dir}',
  'debug.parseIssue':
    '파일에 데이터({bytes}바이트)가 있지만 파싱된 줄이 0개입니다. 형식 문제일 수 있습니다.',
  'debug.never': '없음',
  'debug.justNow': '방금',
  'debug.secondsAgo': '{n}초 전',
  'debug.minutesAgo': '{n}분 전',
  'debug.hoursAgo': '{n}시간 전',

  // ── Connection indicator ──
  'connection.connecting': '연결 중…',
  'connection.reconnecting': '다시 연결 중…',
  'connection.disconnected': '연결 끊김',

  // ── Version / changelog ──
  'version.updated': 'v{version}(으)로 업데이트됨!',
  'version.seeWhatsNew': '새로운 기능 보기',
  'version.seeWhatsNewHover': '새로운 기능 보기!',
  'changelog.title': 'v{version}의 새로운 기능',
  'changelog.contributors': '기여자',
  'changelog.viewOnGitHub': 'GitHub에서 보기',

  // ── Migration notice ──
  'migration.title': '사과드립니다!',
  'migration.body1':
    '방금 처음부터 정성껏 새로 만든 완전한 오픈소스 에셋으로 이전했습니다. 아쉽게도 이 때문에 기존 레이아웃이 초기화되었습니다.',
  'migration.body2': '정말 죄송합니다.',
  'migration.body3':
    '좋은 소식은요? 이번 한 번뿐이며, 앞으로 정말 흥미로운 업데이트를 위한 발판이 될 거예요.',
  'migration.body4': '앞으로도 기대해 주세요. Pixel Agents를 사용해 주셔서 감사합니다!',

  // ── Hooks info (tooltip + modal) ──
  'hooks.tooltipTitle': '즉시 감지 활성화됨',
  'hooks.tooltipBody': '이제 에이전트가 실시간으로 반응합니다.',
  'hooks.viewMore': '더 보기',
  'hooks.modalTitle': '즉시 감지 켜짐',
  'hooks.modalIntro': '이제 Pixel Agents 사무실이 실시간으로 반응합니다:',
  'hooks.bulletPermission': '권한 요청이 즉시 표시됩니다',
  'hooks.bulletTurn': '턴 완료를 바로 감지합니다',
  'hooks.bulletSound': '알림 소리가 즉시 재생됩니다',
  'hooks.explanation':
    'Claude Code Hooks를 통해 동작합니다. Hooks는 Claude 세션에서 무언가 일어날 때마다 Pixel Agents에 알려 주는 작은 이벤트 리스너입니다.',
  'hooks.disableHint': '끄려면 설정 > 즉시 감지로 이동하세요',

  // ── Intro tour ──
  'intro.welcomeTitle': 'Pixel Agents에 오신 것을 환영합니다!',
  'intro.claudeCodeTitle': 'Claude Code 기반',
  'intro.failedTitle': 'Hooks를 설치하지 못했습니다',
  'intro.allSetTitle': '준비 완료!',
  'intro.stepOf': '{total}단계 중 {current}단계',
  'intro.welcomeBody':
    '이 사무실에서 AI 에이전트는 작은 픽셀 캐릭터가 됩니다. 일할 때는 책상에서 타이핑하고, 일을 마치면 돌아다니며, 도움이 필요하면 말을 겁니다.',
  'intro.claudeCodeBody':
    '이 사무실은 Claude Code 세션을 지켜보며 여기서 생생하게 보여 줍니다. Claude Code가 처음이신가요? 먼저 설치하세요:',
  'intro.moreInfo': '자세한 정보:',
  'intro.failedBody':
    'Claude Code 설정에 쓰는 중 문제가 발생해, 사무실은 대신 조금 느린 방식으로 세션을 지켜봅니다. 걱정 마세요. 모든 기능은 그대로 동작하며 언제든 설정에서 다시 활성화할 수 있습니다.',
  'intro.enjoyBody':
    '새 사무실을 즐겨 보세요! 질문이나 아이디어, 자랑하고 싶은 픽셀 아트가 있나요? Discord에서 함께 어울려요.',
  'intro.back': '뒤로',
  'intro.dontAskAgain': '다시 묻지 않기',
  'intro.notNow': '나중에',
  'intro.installing': '설치 중...',
  'intro.installHooks': 'Hooks 설치',
  'intro.letsGo': '시작하기',
  'intro.continue': '계속',
};
