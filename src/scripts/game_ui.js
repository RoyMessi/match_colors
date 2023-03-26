const {
  ANIMATE_CSS_CLASSNAME_FADE_IN,
  ANIMATE_CSS_CLASSNAME_FADE_OUT,
  ATTR_DATA_BOARD_COLUMN,
  ATTR_DATA_BOARD_ROW,
  ATTR_DATA_BOX_TYPE,
  ATTR_DATA_COLUMN,
  ATTR_DATA_ROW,
  BOX_CSS_CLASSNAME_ABOUT_TO_REMOVE,
  BOX_CSS_CLASSNAME_PREFIX,
  BOX_CSS_CLASSNAME_REPLACE,
  CSS_CLASSNAME_HIDE,
  CSS_CLASSNAME_PREVENT_POINTER_EVENTS,
  CSS_CLASSNAME_SHOW,
  DEV_MODE,
  PLAY_MOVEMENT,
  PLAY_MOVEMENT_OPTIONS,
  TIMEOUT_AFTER_SETTING_NEXT_LEVEL,
} = APP_SETTINGS;
import { BoardMatrix } from "./board_matrix";
import boxMovementHandlers, { setWrapperElementMovementHandlers } from "./box_movement_handlers";
import { dev_stateButtonsHelper } from "./dev";
import { GameStatistics } from "./game_statistics";
import { GameUIStatus } from "./game_ui_status";
import { getAppTemplate, getCssRepeat, getGameCompletedTemplate } from "./ui_templates";
import { updateBoxCssTranslate, onAnimationEnd, addAnimateCssClass } from "./ui_utils";

function _removeStrikesBoxes(strikes) {
  strikes.forEach((box) => {
    const element = document.querySelectorAll(`[${ATTR_DATA_ROW}="${box.row}"][${ATTR_DATA_COLUMN}="${box.column}"]`);
    element.forEach((childElem) => {
      addAnimateCssClass(childElem, BOX_CSS_CLASSNAME_ABOUT_TO_REMOVE).then(() => childElem.remove());
    });
  });
}

function _refillStrikesBoxes(strikes) {
  strikes.forEach((box) => {
    const value = BoardMatrix.getValue(box.row, box.column);
    _getNewBox(box.row, box.column, value, true);
  });
}

function _getNewBox(row, column, value, isReplacing = false) {
  const div = document.createElement("div");
  const boxType = value.toLowerCase();
  updateBoxCssTranslate(div, { row, column });
  div.className = BOX_CSS_CLASSNAME_PREFIX + boxType + (isReplacing ? " " + BOX_CSS_CLASSNAME_REPLACE : "");
  div.setAttribute(ATTR_DATA_ROW, row);
  div.setAttribute(ATTR_DATA_COLUMN, column);
  div.setAttribute(ATTR_DATA_BOX_TYPE, boxType);
  itemsWrapperElem.append(div);
  onAnimationEnd(div, () => {
    div.classList.remove(BOX_CSS_CLASSNAME_REPLACE);
  });
  if (PLAY_MOVEMENT === PLAY_MOVEMENT_OPTIONS.DRAG_N_DROP) {
    boxMovementHandlers(div, BoardMatrix.onBoxMoveAllowed);
  }
}

function _prepareBoard() {
  boardElem.style.gridTemplateColumns = getCssRepeat(BoardMatrix.getTotalColumns());
  if (PLAY_MOVEMENT === PLAY_MOVEMENT_OPTIONS.DRAG_N_DROP) {
    setWrapperElementMovementHandlers(itemsWrapperElem);
  }

  if (DEV_MODE) {
    dev_stateButtonsHelper();
  }

  for (let row = 0; row < BoardMatrix.getTotalRows(); row++) {
    for (let column = 0; column < BoardMatrix.getTotalColumns(); column++) {
      const div = document.createElement("div");
      div.setAttribute(ATTR_DATA_BOARD_ROW, row);
      div.setAttribute(ATTR_DATA_BOARD_COLUMN, column);
      if (PLAY_MOVEMENT === PLAY_MOVEMENT_OPTIONS.SLIDE) {
        boxMovementHandlers(div, BoardMatrix.onBoxMoveAllowed);
      }
      boardElem.append(div);
    }
  }
}

function _initBoard() {
  appElem = document.querySelector("#app");
  appElem.innerHTML = getAppTemplate();
  gameWrapperElem = document.querySelector("#game_wrapper");
  gameInfoElem = document.querySelector("#game_info");
  levelElem = gameInfoElem.querySelector("#level");
  levelMinimumScoreElem = gameInfoElem.querySelector("#minimum");
  scoreElem = gameInfoElem.querySelector("#score");
  boardElem = document.getElementById("board");
  itemsWrapperElem = document.getElementById("items_wrapper");
  loaderLoadNewLevelElem = document.getElementById("loader_load_new_level");

  if (PLAY_MOVEMENT === PLAY_MOVEMENT_OPTIONS.SLIDE) {
    itemsWrapperElem.classList.add(CSS_CLASSNAME_PREVENT_POINTER_EVENTS);
  }

  GameUIStatus.start();
}

function _updateLevel() {
  levelElem.innerText = GameStatistics.Level.getValue();
  scoreElem.innerText = 0;
  levelMinimumScoreElem.innerText = GameStatistics.Level.getMinimumScoreValue();

  if (isFirstLoad) {
    isFirstLoad = false;
    gameWrapperElem.classList.remove(CSS_CLASSNAME_HIDE);
  }
}

function _updateScore(gameRulesScore) {
  scoreElem.innerText = GameStatistics.Score.getLevelValue();
  if (gameRulesScore) {
    GameUIStatus.goodAmountOfDestroyedBoxes(gameRulesScore);
  }
}

function _drawBoxes() {
  BoardMatrix.getMatrix().map((rowArr, row) => rowArr.map((value, column) => _getNewBox(row, column, value)));
}

function _removeLevelStructure() {
  boardElem.innerHTML = "";
  itemsWrapperElem.innerHTML = "";
}

function _prepareNewLevel() {
  _updateLevel();
  GameUIStatus.reset();
  _removeLevelStructure();
  _prepareBoard();
  _drawBoxes();
}

function _waitBeforeContinue() {
  return new Promise((resolve) => {
    setTimeout(resolve, TIMEOUT_AFTER_SETTING_NEXT_LEVEL);
  });
}

function _animateLevelCompleted() {
  return addAnimateCssClass(loaderLoadNewLevelElem, CSS_CLASSNAME_SHOW, ANIMATE_CSS_CLASSNAME_FADE_IN).then(() => {
    _prepareNewLevel();
    return _waitBeforeContinue();
  });
}

function _enableMovement() {
  boardElem.classList.remove(CSS_CLASSNAME_PREVENT_POINTER_EVENTS);
}

function _disableMovement() {
  boardElem.classList.add(CSS_CLASSNAME_PREVENT_POINTER_EVENTS);
}

function _animateNewLevel() {
  gameWrapperElem.classList.remove(ANIMATE_CSS_CLASSNAME_FADE_OUT);
  _enableMovement();
  addAnimateCssClass(loaderLoadNewLevelElem, ANIMATE_CSS_CLASSNAME_FADE_OUT).then(() => {
    loaderLoadNewLevelElem.classList.remove(
      ANIMATE_CSS_CLASSNAME_FADE_IN,
      ANIMATE_CSS_CLASSNAME_FADE_OUT,
      CSS_CLASSNAME_SHOW
    );
  });
}

function _newLevel() {
  addAnimateCssClass(gameWrapperElem, ANIMATE_CSS_CLASSNAME_FADE_OUT)
    .then(_animateLevelCompleted)
    .then(_animateNewLevel);
}

function _newLevelWithoutAnimate() {
  _prepareNewLevel();
  _enableMovement();
  loaderLoadNewLevelElem.classList.remove(
    ANIMATE_CSS_CLASSNAME_FADE_IN,
    ANIMATE_CSS_CLASSNAME_FADE_OUT,
    CSS_CLASSNAME_SHOW
  );
}

function _noMoreLevels() {
  return addAnimateCssClass(gameWrapperElem, ANIMATE_CSS_CLASSNAME_FADE_OUT);
}

let isFirstLoad = true;
let appElem;
let gameWrapperElem;
let gameInfoElem;
let levelElem;
let levelMinimumScoreElem;
let scoreElem;
let boardElem;
let itemsWrapperElem;
let loaderLoadNewLevelElem;

const observers = { ready: null };
export const GameUI = {
  drawBoxes: _drawBoxes,
  removeStrikesBoxes: _removeStrikesBoxes,
  refillStrikesBoxes: _refillStrikesBoxes,
  levelCompleted() {
    _disableMovement();
    itemsWrapperElem.classList.add(CSS_CLASSNAME_PREVENT_POINTER_EVENTS);
    GameUIStatus.levelCompleted();
  },
  noMoreLevels: _noMoreLevels,
  gameCompleted() {
    appElem.innerHTML = getGameCompletedTemplate();
  },
  onReady(callback) {
    observers.ready = callback;
  },
  start() {
    GameStatistics.Level.observer(_newLevel);
    GameStatistics.Score.observer(_updateScore);
    _initBoard();
    observers.ready?.call(null);
    return this;
  },
  newLevelWithoutAnimate() {
    _newLevelWithoutAnimate();
  },
  dispose() {
    scoreElem = null;
    boardElem = null;
    gameInfoElem?.remove();
    gameInfoElem = null;
    boardElem?.remove();
    levelElem = null;
    levelMinimumScoreElem = null;
    itemsWrapperElem?.remove();
    itemsWrapperElem = null;
    loaderLoadNewLevelElem?.remove();
    loaderLoadNewLevelElem = null;
    itemsWrapperElem = null;
    gameWrapperElem?.remove();
    gameWrapperElem = null;
    GameUIStatus.dispose();
  },
};
