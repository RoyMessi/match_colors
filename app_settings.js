export const APP_VERSION = process.env.npm_package_version;
export const DEV_MODE = process.env.DEV_MODE === "true";
export const DEV_TEST_NAME = process.env.DEV_TEST_NAME ?? null;
export const DEV_ALLOW_SAVING_BOARD_STATE = process.env.DEV_ALLOW_SAVING_BOARD_STATE === "true";
export const DEV_BOARD_STATE_NAME = process.env.DEV_BOARD_STATE_NAME ?? "dev_board_state";
export const ALLOW_SOUND = process.env.ALLOW_SOUND === "true";
export const TOUCH_DELTA = 5;

export const PLAY_MOVEMENT_OPTIONS = {
  SLIDE: "slide",
  DRAG_N_DROP: "dragNdrop",
};
export const PLAY_MOVEMENT = process.env.PLAY_MOVEMENT ?? PLAY_MOVEMENT_OPTIONS.DRAG_N_DROP;
export const RULE_LOCK_TARGET_BOX_ONCE_ONE_ATTACHED = true;
export const RULE_MINIMUE_MATCHED_BOXES = Number(process.env.RULE_MINIMUE_MATCHED_BOXES);

export const ATTR_DATA_BOARD_ROW = "data-board-row";
export const ATTR_DATA_BOARD_COLUMN = "data-board-column";
export const ATTR_DATA_ROW = "data-row";
export const ATTR_DATA_COLUMN = "data-column";
export const ATTR_DATA_BOX_TYPE = "data-box-type";

export const CSS_CLASSNAME_SHOW = "show";
export const CSS_CLASSNAME_HIDE = "hide";
export const CSS_CLASSNAME_MOVE = "move";
export const CSS_CLASSNAME_PREVENT_POINTER_EVENTS = "prevent-pointer-events";
export const ANIMATE_CSS_CLASSNAME_FADE_IN = "fade-in";
export const ANIMATE_CSS_CLASSNAME_FADE_OUT = "fade-out";
export const BOX_CSS_CLASSNAME_REPLACE = "add";
export const BOX_CSS_CLASSNAME_PREFIX = "box box-color-";
export const BOX_CSS_CLASSNAME_PLACEHOLDER = "placeholder";
export const BOX_CSS_CLASSNAME_ABOUT_TO_REMOVE = "about-to-remove";
export const BOX_CSS_CLASSNAME_MOVEMENT_NOT_ALLOWED = "move-not-allowed";
export const BOX_CSS_CLASSNAME_MOVEMENT_DRAG_N_DTOP = "drag-n-drop";
export const BOX_CSS_CLASSNAME_MOVEMENT_SLIDE = "slide";
export const BOX_TYPES = {
  RED: "red",
  BLUE: "blue",
  GREEN: "green",
  PINK: "pink",
  YELLOW: "yellow",
  ORANGE: "orange",
  PURPLE: "purple",
};
export const BOX_TYPES_DATA = {
  [BOX_TYPES.RED]: { value: 1 },
  [BOX_TYPES.BLUE]: { value: 2 },
  [BOX_TYPES.GREEN]: { value: 3 },
  [BOX_TYPES.PINK]: { value: 4 },
  [BOX_TYPES.YELLOW]: { value: 5 },
  [BOX_TYPES.ORANGE]: { value: 6 },
  [BOX_TYPES.PURPLE]: { value: 7 },
};
export const BOX_TYPE_VALUES = Object.values(BOX_TYPES);
export const TOTAL_BOX_TYPES = BOX_TYPE_VALUES.length;
export const SOUND_BOX_DESTROYED = "./media/boxes_destroyed.mp3";
export const SPACE = 6.2;
export const SPACE_FIX = 1.4;

export const TIMEOUT_SHORT_POSSIBLE_DELAY = 0;
export const TIMEOUT_BEFORE_ADDING_NEW_BOXES = 500;
export const TIMEOUT_BEFORE_RECHECK_BOARD_AFTER_ADDING_NEW_BOXES = 1000;
export const TIMEOUT_AFTER_EVENT_DROP = 500;
export const TIMEOUT_BEFORE_HIDING_ACTIVE_BOX = TIMEOUT_SHORT_POSSIBLE_DELAY;
export const TIMEOUT_AFTER_OVERLAP_STATUS_SHOWN = 2000;
export const TIMEOUT_AFTER_SETTING_NEXT_LEVEL = 1000;

export const ACTION_NAMES = {
  LEVEL_BOXES_DESTROYES: "levelBoxesDestroyes",
  LEVEL_REACHED_MINIMUM_SCORE: "levelReachedminimumScore",
  LEVEL_FINISHED_CLEAR_ALL_BOXES: "levelFinishedClearAllBoxes",
  NEXT_LEVEL: "nextLevel",
  NO_MORE_LEVELS: "noMoreLevels",
  GAME_COMPLETED: "gameCompleted",
};

export const GAME_SETTINGS = {
  ROWS: Number(process.env.GAME_ROWS),
  COLUMNS: Number(process.env.GAME_COLUMNS),
};

export const GAME_MINIMUM_REQUIREMENTS = {
  ROWS: 3,
  COLUMNS: 3,
};

export const INITIAL_LEVEL_NUMBER = 1;
export const INITIAL_STATISTICS = {
  level: INITIAL_LEVEL_NUMBER,
  gameScore: 0,
  levelScore: 0,
  minimumScore: 0,
};
