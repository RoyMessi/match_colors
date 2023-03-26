import { Level } from "./level";
import gameEventsHandlers from "./game_events_handlers";
import { GameUI } from "./game_ui";

export const Game = {
  start(settings) {
    try {
      Level.start(settings, gameEventsHandlers);
    } catch (err) {
      console.error(err);
    }
    return this;
  },
  onReady(callback) {
    GameUI.onReady(callback);
    return this;
  },
  dispose() {
    Level.dispose();
  },
};
