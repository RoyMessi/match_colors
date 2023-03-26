const { ANIMATE_CSS_CLASSNAME_FADE_OUT, CSS_CLASSNAME_SHOW, TIMEOUT_AFTER_OVERLAP_STATUS_SHOWN } = APP_SETTINGS;
import { getMatchBoxTemplate, getLevelCompletedTemplate } from "./ui_templates";
import { addAnimateCssClass } from "./ui_utils";

function _showWrapper() {
  if (!overlapWrapperElem.classList.contains(CSS_CLASSNAME_SHOW)) {
    overlapWrapperElem.classList.add(CSS_CLASSNAME_SHOW);
  }
}

function _hideWrapper() {
  if (!overlapWrapperElem.childElementCount) {
    overlapWrapperElem.classList.remove(CSS_CLASSNAME_SHOW);
  }
}

function _appendTemplate(selector_id, template) {
  if (itemsElements[selector_id]) {
    return;
  }

  overlapWrapperElem.insertAdjacentHTML("beforeend", template);
  itemsElements[selector_id] = document.getElementById(selector_id);
  _showWrapper();
}

function _appendTemplateWithTimeout(selector_id, template, timeout) {
  return new Promise((resolve) => {
    _appendTemplate(selector_id, template);
    setTimeout(() => {
      resolve(selector_id);
    }, timeout);
  });
}

function _fadeOutAndRemove(selector_id) {
  addAnimateCssClass(itemsElements[selector_id], ANIMATE_CSS_CLASSNAME_FADE_OUT).then(() => {
    itemsElements[selector_id].remove();
    delete itemsElements[selector_id];
    _hideWrapper();
  });
}

let overlapWrapperElem;
let itemsElements = {};

export const GameUIStatus = {
  goodAmountOfDestroyedBoxes(gameRulesScore) {
    if (!gameRulesScore.isGoodScore) {
      return;
    }

    _appendTemplateWithTimeout(
      "match_box",
      getMatchBoxTemplate(gameRulesScore.text),
      TIMEOUT_AFTER_OVERLAP_STATUS_SHOWN
    ).then(_fadeOutAndRemove);
  },
  levelCompleted() {
    _appendTemplate("level_completed", getLevelCompletedTemplate());
  },
  reset() {
    for (let key in itemsElements) {
      delete itemsElements[key];
    }
    overlapWrapperElem.innerHTML = "";
    _hideWrapper();
  },
  start() {
    overlapWrapperElem = document.querySelector("#overlap_wrapper");
  },
  dispose() {
    overlapWrapperElem?.remove();
    overlapWrapperElem = null;
  },
};
