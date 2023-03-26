const { DEV_ALLOW_SAVING_BOARD_STATE, DEV_MODE } = APP_SETTINGS;
import { GameStatistics } from "./game_statistics";

function _gameInfoTemplate() {
  return `<div id="game_info">
    <div>Level:<span id="level" class="font-weight-bold">0</span></div>
    <div>Score:<span id="score" class="font-weight-bold">0</span></div>
    <div>Min. Score:<span id="minimum" class="font-weight-bold">0</span></div>
  </div>`;
}

export function getAppTemplate() {
  let template = `<div id="game_wrapper" class="hide">
    ${_gameInfoTemplate()}
    <div id="board"></div>
    <div id="items_wrapper"></div>
    <div id="overlap_wrapper"></div>
  </div>`;
  template += '<div id="loader_load_new_level">Loading new level...</div>';
  if (DEV_MODE && DEV_ALLOW_SAVING_BOARD_STATE) {
    template +=
      '<div id="button_wrapper"><button data-btn="save">Save State</button><button data-btn="remove">Remove State</button></div>';
  }
  return template;
}

export function getCssRepeat(times) {
  return `repeat(${times},1fr)`;
}

export function getMatchBoxTemplate(text) {
  return `<div id="match_box" class="fade-in">${text}</div>`;
}

export function getLevelCompletedTemplate() {
  return '<div id="loader_level_completed" class="fade-in">Level completed!</div>';
}

export function getGameCompletedTemplate() {
  const score = GameStatistics.Score.getGameValue();
  return `<div id="game_completed" class="show flex-dir-column fade-in">
  Game completed!
  <span>You're score is <span class="font-weight-bold">${score}</span></span>
  </div>`;
}
