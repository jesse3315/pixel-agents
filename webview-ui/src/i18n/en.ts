/** English UI strings — the source of truth. Every other language must provide exactly these keys. */
export const en = {
  // ── Common ──
  'common.close': 'Close',
  'common.gotIt': 'Got it',
  'common.loading': 'Loading...',
  'common.joinDiscord': 'Join our Discord!',

  // ── Bottom toolbar ──
  'toolbar.addAgent': '+ Agent',
  'toolbar.skipPermissions': 'Skip permissions mode',
  'toolbar.layout': 'Layout',
  'toolbar.layoutTitle': 'Edit office layout',
  'toolbar.settings': 'Settings',

  // ── Settings modal ──
  'settings.title': 'Settings',
  'settings.openSessionsFolder': 'Open Sessions Folder',
  'settings.exportLayout': 'Export Layout',
  'settings.importLayout': 'Import Layout',
  'settings.assetDirPlaceholder': 'Absolute asset directory path',
  'settings.add': 'Add',
  'settings.addAssetDirectory': 'Add Asset Directory',
  'settings.soundNotifications': 'Sound Notifications',
  'settings.watchAllSessions': 'Watch All Sessions',
  'settings.instantDetection': 'Instant Detection (Hooks)',
  'settings.alwaysShowLabels': 'Always Show Labels',
  'settings.ghostHeadless': 'Display Headless as Ghosts',
  'settings.showAreas': 'Show Areas',
  'settings.debugView': 'Debug View',
  'settings.language': 'Language',

  // ── Layout import (standalone) ──
  'layout.replaceConfirm': 'Replace the current layout? Unsaved edits will be lost.',
  'layout.invalidFile': 'Invalid layout file.',
  'layout.parseFailed': 'Failed to read or parse layout file.',

  // ── Edit action bar ──
  'edit.undo': 'Undo',
  'edit.undoTitle': 'Undo (Ctrl+Z)',
  'edit.redo': 'Redo',
  'edit.redoTitle': 'Redo (Ctrl+Y)',
  'edit.save': 'Save',
  'edit.saveTitle': 'Save layout',
  'edit.reset': 'Reset',
  'edit.resetTitle': 'Reset to last saved layout',
  'edit.resetConfirm': 'Reset?',
  'edit.yes': 'Yes',
  'edit.no': 'No',
  'edit.rotateHint': 'Rotate (R)',

  // ── Layout editor toolbar ──
  'editor.furniture': 'Furniture',
  'editor.furnitureTitle': 'Place furniture',
  'editor.floor': 'Floor',
  'editor.floorTitle': 'Paint floor tiles',
  'editor.walls': 'Walls',
  'editor.wallsTitle': 'Paint walls (click to toggle)',
  'editor.pets': 'Pets',
  'editor.petsTitle': 'Place pets',
  'editor.areas': 'Areas',
  'editor.areasTitle': "Define folder-bound areas — agents spawn in their folder's area",
  'editor.erase': 'Erase',
  'editor.eraseTitle': 'Erase tiles to void',
  'editor.pick': 'Pick',
  'editor.pickFloorTitle': 'Pick floor pattern + color from existing tile',
  'editor.color': 'Color',
  'editor.floorColorTitle': 'Adjust floor color',
  'editor.floorPattern': 'Floor {n}',
  'editor.wallColorTitle': 'Adjust wall color',
  'editor.wallSet': 'Wall {n}',
  'editor.areasHelp':
    "Paint areas on the map, then assign workspace folders. Agents will sit in their folder's area.",
  'editor.noAreas': 'No areas yet — add one above',
  'editor.carpet': 'Carpet',
  'editor.carpetTitle': 'Paint carpets',
  'editor.pickCarpetTitle': 'Pick carpet variant + colors from existing tile (P)',
  'editor.pickFurnitureTitle': 'Pick furniture type from placed item',
  'editor.carpetColorTitle': 'Adjust carpet main + accent colors',
  'editor.furnitureColorTitle': 'Adjust color for new furniture',
  'editor.carpetVariant': 'Carpet {n}',
  'editor.main': 'Main',
  'editor.accent': 'Accent',
  'editor.selectedColorTitle': 'Adjust selected furniture color',
  'editor.clear': 'Clear',
  'editor.clearColorTitle': 'Remove color (restore original)',
  'editor.areaNamePlaceholder': 'Area name…',
  'editor.addArea': 'Add Area',
  'editor.addAreaTitle': 'Add a new Area',
  'editor.areaColor': 'Area color',
  'editor.renameAreaHint': '{label} — double-click to rename',
  'editor.removeArea': 'Remove area',
  'editor.noFolders': 'No folders mapped',
  'editor.unmapFolder': 'Unmap folder',
  'editor.allFoldersMapped': 'All folders already mapped',
  'editor.mapFolder': 'Map a folder…',
  'editor.addFolder': 'Add folder…',
  'editor.category.desks': 'Desks',
  'editor.category.chairs': 'Chairs',
  'editor.category.storage': 'Storage',
  'editor.category.electronics': 'Tech',
  'editor.category.decor': 'Decor',
  'editor.category.wall': 'Wall',
  'editor.category.misc': 'Misc',

  // ── Color picker ──
  'color.hue': 'Hue',
  'color.saturation': 'Saturation',
  'color.brightness': 'Brightness',
  'color.contrast': 'Contrast',
  'color.colorize': 'Colorize',
  'color.colorizeTitle': 'Toggle colorize mode',
  'color.reset': 'Reset',
  'color.resetTitle': 'Reset to default',

  // ── Zoom ──
  'zoom.in': 'Zoom in (Ctrl+Scroll)',
  'zoom.out': 'Zoom out (Ctrl+Scroll)',

  // ── Agent overlay ──
  'agent.needsApproval': 'Needs approval',
  'agent.waitingForInput': 'Waiting for input',
  'agent.idle': 'Idle',
  'agent.subtask': 'Subtask',
  'agent.lead': 'LEAD',
  'agent.close': 'Close agent',
  'agent.contextUsage': '{pct}% context used ({used}k of {max}k tokens)',

  // ── Agent tool status (server sends English; translated at display time) ──
  'status.reading': 'Reading {file}',
  'status.editing': 'Editing {file}',
  'status.writing': 'Writing {file}',
  'status.running': 'Running: {command}',
  'status.searchingFiles': 'Searching files',
  'status.searchingCode': 'Searching code',
  'status.fetchingWeb': 'Fetching web content',
  'status.searchingWeb': 'Searching the web',
  'status.subtask': 'Subtask: {description}',
  'status.runningSubtask': 'Running subtask',
  'status.waitingForAnswer': 'Waiting for your answer',
  'status.planning': 'Planning',
  'status.editingNotebook': 'Editing notebook',
  'status.creatingTeamNamed': 'Creating team: {team}',
  'status.creatingTeam': 'Creating team',
  'status.sendingMessage': 'Sending message',
  'status.using': 'Using {tool}',

  // ── Debug view ──
  'debug.title': 'Debug View',
  'debug.agent': 'Agent #{id}',
  'debug.jsonlConnected': 'JSONL connected',
  'debug.jsonlNotFound': 'JSONL not found',
  'debug.lines': 'Lines: {count}',
  'debug.lastData': 'Last data: {time}',
  'debug.projectDirMissing': 'Project dir does not exist: {dir}',
  'debug.parseIssue': 'File has data ({bytes} bytes) but 0 lines parsed. Possible format issue.',
  'debug.never': 'never',
  'debug.justNow': 'just now',
  'debug.secondsAgo': '{n}s ago',
  'debug.minutesAgo': '{n}m ago',
  'debug.hoursAgo': '{n}h ago',

  // ── Connection indicator ──
  'connection.connecting': 'Connecting…',
  'connection.reconnecting': 'Reconnecting…',
  'connection.disconnected': 'Disconnected',

  // ── Version / changelog ──
  'version.updated': 'Updated to v{version}!',
  'version.seeWhatsNew': "See what's new",
  'version.seeWhatsNewHover': "See what's new!",
  'changelog.title': "What's New in v{version}",
  'changelog.contributors': 'Contributors',
  'changelog.viewOnGitHub': 'View on GitHub',

  // ── Migration notice ──
  'migration.title': 'We owe you an apology!',
  'migration.body1':
    "We've just migrated to fully open-source assets, all built from scratch with love. Unfortunately, this means your previous layout had to be reset.",
  'migration.body2': "We're really sorry about that.",
  'migration.body3':
    'The good news? This was a one-time thing, and it paves the way for some genuinely exciting updates ahead.',
  'migration.body4': 'Stay tuned, and thanks for using Pixel Agents!',

  // ── Hooks info (tooltip + modal) ──
  'hooks.tooltipTitle': 'Instant Detection Active',
  'hooks.tooltipBody': 'Your agents now respond in real-time.',
  'hooks.viewMore': 'View more',
  'hooks.modalTitle': 'Instant Detection is ON',
  'hooks.modalIntro': 'Your Pixel Agents office now reacts in real-time:',
  'hooks.bulletPermission': 'Permission prompts appear instantly',
  'hooks.bulletTurn': 'Turn completions detected the moment they happen',
  'hooks.bulletSound': 'Sound notifications play immediately',
  'hooks.explanation':
    'This works through Claude Code Hooks, small event listeners that notify Pixel Agents whenever something happens in your Claude sessions.',
  'hooks.disableHint': 'To disable, go to Settings > Instant Detection',

  // ── Intro tour ──
  'intro.welcomeTitle': 'Welcome to Pixel Agents!',
  'intro.claudeCodeTitle': 'Powered by Claude Code',
  'intro.failedTitle': "Hooks couldn't be installed",
  'intro.allSetTitle': "You're all set!",
  'intro.stepOf': 'Step {current} of {total}',
  'intro.welcomeBody':
    "In this office, your AI agents become tiny pixel characters: they type at their desks while they work, wander off when they're done, and speak up when they need you.",
  'intro.claudeCodeBody':
    'The office watches your Claude Code sessions and brings them to life in here. New to Claude Code? Download it first:',
  'intro.moreInfo': 'For more info, visit',
  'intro.failedBody':
    'Something went wrong writing to your Claude Code settings, so the office will watch your sessions the slower way instead. No worries, everything still works and you can retry activating them any time from Settings.',
  'intro.enjoyBody':
    'Enjoy your new office! Questions, ideas, or pixel art to show off? Come hang out in our Discord.',
  'intro.back': 'Back',
  'intro.dontAskAgain': "Don't Ask Again",
  'intro.notNow': 'Not Now',
  'intro.installing': 'Installing...',
  'intro.installHooks': 'Install Hooks',
  'intro.letsGo': "Let's Go",
  'intro.continue': 'Continue',
};

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
