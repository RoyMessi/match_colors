import { Game } from "./src/scripts/game";
const { APP_VERSION, CSS_CLASSNAME_HIDE, DEV_MODE, GAME_SETTINGS } = APP_SETTINGS;
import { dev_setMatrix } from "./src/scripts/dev";
import("~/boxes_package");

Game.onReady(() => {
  const elem = document.querySelector("#app_version");
  elem.querySelector("span").innerText = APP_VERSION;
  elem.classList.remove(CSS_CLASSNAME_HIDE);
}).start({
  ...GAME_SETTINGS,
  levelInitialState: DEV_MODE && dev_setMatrix(),
});
