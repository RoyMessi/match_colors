import { GameRules } from "./game_rules";
import { GameAudio } from "./game_audio";
import { GameStatistics } from "./game_statistics";
const { ACTION_NAMES, TIMEOUT_BEFORE_ADDING_NEW_BOXES, TIMEOUT_BEFORE_RECHECK_BOARD_AFTER_ADDING_NEW_BOXES } =
  APP_SETTINGS;
import { Level } from "./level";
import { GameUI } from "./game_ui";
import { BoardMatrix } from "./board_matrix";

const HANDLERS = {
  [ACTION_NAMES.LEVEL_BOXES_DESTROYES](switchData, callback) {
    if (typeof callback !== "function") {
      throw new Error("callback is missing");
    }
    let result = GameRules.onScore(switchData.totalDestroyedBoxes);
    GameAudio.matchBoxes();
    GameStatistics.Score.update(result);
    GameUI.removeStrikesBoxes(switchData.boxes);

    setTimeout(() => {
      BoardMatrix.refillStrikesBoxes(switchData.boxes);
      GameUI.refillStrikesBoxes(switchData.boxes);
      setTimeout(callback, TIMEOUT_BEFORE_RECHECK_BOARD_AFTER_ADDING_NEW_BOXES);
    }, TIMEOUT_BEFORE_ADDING_NEW_BOXES);
  },
  [ACTION_NAMES.LEVEL_REACHED_MINIMUM_SCORE]() {
    BoardMatrix.disableSwitchBoxes();
    GameUI.levelCompleted();
  },
  [ACTION_NAMES.LEVEL_FINISHED_CLEAR_ALL_BOXES]() {
    if (Level.isLevelCompleted()) {
      Level.nextLevel();
    }
  },
  [ACTION_NAMES.NO_MORE_LEVELS]() {
    GameUI.noMoreLevels().then(() => {
      Level.dispose();
      GameUI.gameCompleted();
    });
  },
};

export default function gameEventsHandlers(action, ...data) {
  if (typeof HANDLERS[action] === "function") {
    HANDLERS[action].apply(null, data);
    return true;
  }
  console.warn("No handler for %s", action);
  return false;
}
