import { IS_MOBILE } from "../game_runtime_settings";

export function getWelcomeContainerTemplate() {
  return '<div id="welcome" class="p-2"></div>';
}

export function getFirstScreenTemplate() {
  let rtn = `<h1>Welcome to ${APP_SETTINGS.APP_NAME}!</h1>`;
  if (IS_MOBILE) {
    rtn += `<p>To play: touch the box you want to move and slide to the desired direction.</p>`;
  } else {
    let instructions = `To play: Place the mouse on the box you want to move and `;
    if (APP_SETTINGS.PLAY_MOVEMENT === APP_SETTINGS.PLAY_MOVEMENT_OPTIONS.SLIDE) {
      instructions += `slide with the scroll wheel to`;
    } else {
      instructions += `click with the mouse to Drag N Drop in`;
    }
    rtn += `<p>${instructions} the desired direction.</p>`;
  }
  rtn += `<button class='btn' data-next-step>Got it</button>`;
  return rtn;
}
