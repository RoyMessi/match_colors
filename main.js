import { Game } from "./src/scripts/game";
const { APP_VERSION, CSS_CLASSNAME_HIDE, DEV_MODE, GAME_SETTINGS } = APP_SETTINGS;
import { dev_setMatrix } from "./src/scripts/dev";
import("~/boxes_package");

const localStorageKey = "__SHOW_WELCOME_PAGE__";
const appElement = document.querySelector("#app");

let showWelcomePage = localStorage.getItem(localStorageKey);
showWelcomePage = showWelcomePage === null;

function initGame() {
  Game.onReady(() => {
    const elem = document.querySelector("#app_version");
    elem.querySelector("span").innerText = APP_VERSION;
    elem.classList.remove(CSS_CLASSNAME_HIDE);
  }).start({
    ...GAME_SETTINGS,
    levelInitialState: DEV_MODE && dev_setMatrix(),
  });
}

(async (showWelcomePage) => {
  if (!showWelcomePage) {
    initGame();
  } else {
    const Welcome = (await import("./src/scripts/welcome/index")).default;
    Welcome(appElement)
      .start()
      .onStartTheGame(() => {
        localStorage.setItem(localStorageKey, false);
        initGame();
      });
  }
})(showWelcomePage);
