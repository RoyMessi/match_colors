const { ACTION_NAMES, DEV_MODE, INITIAL_LEVEL_NUMBER } = APP_SETTINGS;
import { BoardMatrix } from "./board_matrix";
import { GameStatistics } from "./game_statistics";
import { GameUI } from "./game_ui";
import { LEVELS } from "./levels_db";

function _nextLevel() {
  ++currentLevel;
  if (typeof _getCurrentLevel() === "undefined") {
    observer.call(null, ACTION_NAMES.NO_MORE_LEVELS, { currentLevel });
    return;
  }
  _startNewLevel();
}

function _getCurrentLevel() {
  return LEVELS[currentLevel - 1];
}

function _scoreUpdated() {
  if (isLevelCompleted) {
    return;
  }

  const score = GameStatistics.Score.getLevelValue();
  if (_getCurrentLevel().minimumScore <= score) {
    isLevelCompleted = true;
    observer.call(observer, ACTION_NAMES.LEVEL_REACHED_MINIMUM_SCORE, score);
  }
}

function _startNewLevel() {
  isLevelCompleted = false;

  BoardMatrix.reset(_getCurrentLevel().board);
  GameStatistics.Score.resetLevelScore();
  GameStatistics.Level.set(currentLevel, _getCurrentLevel().minimumScore);
}

let currentLevel = -1;
let currentLevelTotalOnlyColors = 0;
let isLevelCompleted = false;
let observer;

export const Level = {
  isEnabled: () => LEVELS_ENABLED,
  scoreUpdated: _scoreUpdated,
  nextLevel: _nextLevel,
  getCurrentLevel: _getCurrentLevel,
  isLevelCompleted: () => isLevelCompleted,
  setUpNewLevel() {},
  tearDownCurrentLevel() {},
  currentLevelHasOnlyColors: () => {
    const size = _getCurrentLevel().onlyColors.length;
    currentLevelTotalOnlyColors = size > 0 ? size : 0;
    return currentLevelTotalOnlyColors;
  },
  getCurrentLevelRandomColor: () => {
    return _getCurrentLevel().onlyColors[Math.floor(Math.random() * currentLevelTotalOnlyColors)];
  },
  start(settings, callback) {
    settings = settings ?? {};
    observer = callback;
    currentLevel = INITIAL_LEVEL_NUMBER;
    isLevelCompleted = false;

    GameStatistics.Score.observer(Level.scoreUpdated);
    BoardMatrix.observer(callback);
    if (DEV_MODE) {
      BoardMatrix.reset(settings.levelInitialState ?? _getCurrentLevel().board);
      GameStatistics.Score.resetLevelScore();
      GameUI.start().newLevelWithoutAnimate();
    } else {
      GameUI.start();
      _startNewLevel();
    }
    return this;
  },
  dispose() {
    observer = null;
    BoardMatrix.dispose();
    GameUI.dispose();
  },
};
