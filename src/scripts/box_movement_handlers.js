const {
  ATTR_DATA_BOX_TYPE,
  ATTR_DATA_COLUMN,
  ATTR_DATA_ROW,
  BOX_CSS_CLASSNAME_PLACEHOLDER,
  BOX_CSS_CLASSNAME_PREFIX,
  BOX_CSS_CLASSNAME_MOVEMENT_NOT_ALLOWED,
  BOX_CSS_CLASSNAME_MOVEMENT_DRAG_N_DTOP,
  BOX_CSS_CLASSNAME_MOVEMENT_SLIDE,
  CSS_CLASSNAME_HIDE,
  PLAY_MOVEMENT,
  PLAY_MOVEMENT_OPTIONS,
  RULE_LOCK_TARGET_BOX_ONCE_ONE_ATTACHED,
  TIMEOUT_AFTER_EVENT_DROP,
  TIMEOUT_BEFORE_HIDING_ACTIVE_BOX,
  ATTR_DATA_BOARD_COLUMN,
  ATTR_DATA_BOARD_ROW,
  TOUCH_DELTA,
} = APP_SETTINGS;
import { isBoxMovementAllowed } from "./box_movement_rules";
import { IS_MOBILE } from "./game_runtime_settings";
import { updateBoxCssTranslate, onAnimationEnd } from "./ui_utils";

function _updateWatched(targetElement) {
  target.element = targetElement;
  target.location = {
    row: Number(targetElement.getAttribute(ATTR_DATA_ROW)),
    column: Number(targetElement.getAttribute(ATTR_DATA_COLUMN)),
  };
  active.location = {
    row: Number(active.element.getAttribute(ATTR_DATA_ROW)),
    column: Number(active.element.getAttribute(ATTR_DATA_COLUMN)),
  };
}

function _reset() {
  isWatching = false;
  active.location = { row: null, column: null };
  target = { element: null, location: { row: null, column: null } };
}

const MovementOptions = {
  DragNDrop() {
    let placeholderElement;

    return function (callback) {
      function _setPlaceholder(e) {
        let cssClassName = BOX_CSS_CLASSNAME_PREFIX + active.element.getAttribute(ATTR_DATA_BOX_TYPE);
        cssClassName += " " + BOX_CSS_CLASSNAME_PLACEHOLDER;

        placeholderElement = document.createElement("div");
        placeholderElement.className = cssClassName;
        active.element.after(placeholderElement);
        const b = placeholderElement.getBoundingClientRect();
        e.dataTransfer.setDragImage(placeholderElement, b.height / 2, b.width / 2);
      }

      function _removePlaceholder() {
        placeholderElement?.remove();
        placeholderElement = null;
      }

      return {
        ondragstart(e) {
          e.dataTransfer.effectAllowed = "move";
          active.element = e.target;
          isWatching = true;
          _setPlaceholder(e);
          setTimeout(() => {
            active.element.classList.add(CSS_CLASSNAME_HIDE);
          }, TIMEOUT_BEFORE_HIDING_ACTIVE_BOX);
        },
        ondrag(e) {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.effectAllowed = "none";
        },
        ondragenter(e) {
          e.preventDefault();
          e.dataTransfer.effectAllowed = "move";

          if (RULE_LOCK_TARGET_BOX_ONCE_ONE_ATTACHED) {
            if (!target.element) {
              _updateWatched(e.target);
            }
          } else {
            _updateWatched(e.target);
          }

          if (!isBoxMovementAllowed(active.location, target.location)) {
            active.element.classList.remove(CSS_CLASSNAME_HIDE);
            _removePlaceholder();
            _reset();
            return true;
          }

          updateBoxCssTranslate(target.element, active.location);
          target.element.setAttribute(ATTR_DATA_ROW, active.location.row);
          target.element.setAttribute(ATTR_DATA_COLUMN, active.location.column);

          updateBoxCssTranslate(active.element, target.location);
          active.element.setAttribute(ATTR_DATA_ROW, target.location.row);
          active.element.setAttribute(ATTR_DATA_COLUMN, target.location.column);
        },
        ondragend(e) {
          e.preventDefault();
          if (!isWatching) {
            e.dataTransfer.effectAllowed = "none";
            e.dataTransfer.dropEffect = "none";
            return;
          }
          active.element.classList.remove(CSS_CLASSNAME_HIDE);
          _removePlaceholder();

          ((activeLocation, targetLocation) => {
            if (!activeLocation || !target.element) {
              return;
            }
            setTimeout(() => {
              callback(activeLocation, targetLocation);
            }, TIMEOUT_AFTER_EVENT_DROP);
          })(active.location, target.location);
          _reset();
        },
      };
    };
  },
  Slide() {
    let moveInProcess = false;
    let lastTimeStamp = 0;

    function _move(e, direction, callback) {
      if (moveInProcess) {
        return;
      }

      moveInProcess = true;
      lastTimeStamp = e.timeStamp + 1000;

      active.location = {
        row: Number(e.target.getAttribute(ATTR_DATA_BOARD_ROW)),
        column: Number(e.target.getAttribute(ATTR_DATA_BOARD_COLUMN)),
      };
      active.element = document.querySelector(
        `[${ATTR_DATA_ROW}="${active.location.row}"][${ATTR_DATA_COLUMN}="${active.location.column}"]`
      );

      target.location = { ...{}, ...active.location };
      target.location[direction.axis] += direction.value;

      target.element = document.querySelector(
        `[${ATTR_DATA_ROW}="${target.location.row}"][${ATTR_DATA_COLUMN}="${target.location.column}"]`
      );

      if (!isBoxMovementAllowed(active.location, target.location) || !target.element) {
        lastTimeStamp += 1000;
        onAnimationEnd(active.element, (e) => {
          lastTimeStamp = e.timeStamp + 100;
          active.element.classList.remove(BOX_CSS_CLASSNAME_MOVEMENT_NOT_ALLOWED);
          _reset();
          moveInProcess = false;
        });
        active.element.classList.add(BOX_CSS_CLASSNAME_MOVEMENT_NOT_ALLOWED);
        return;
      }

      updateBoxCssTranslate(target.element, active.location);
      target.element.setAttribute(ATTR_DATA_ROW, active.location.row);
      target.element.setAttribute(ATTR_DATA_COLUMN, active.location.column);

      updateBoxCssTranslate(active.element, target.location);
      active.element.setAttribute(ATTR_DATA_ROW, target.location.row);
      active.element.setAttribute(ATTR_DATA_COLUMN, target.location.column);

      ((activeLocation, targetLocation) => {
        if (!activeLocation || !target.element) {
          _reset();
          moveInProcess = false;
          return;
        }
        setTimeout(() => {
          callback(activeLocation, targetLocation);
          _reset();
          moveInProcess = false;
        }, TIMEOUT_AFTER_EVENT_DROP);
      })(active.location, target.location);
      _reset();
    }

    return {
      Desktop(callback) {
        return {
          onwheel(e) {
            if (e.timeStamp < lastTimeStamp || moveInProcess) {
              return;
            }
            if (e.wheelDeltaY > 0) {
              _move(e, { axis: "row", value: 1 }, callback);
            } else if (e.wheelDeltaY < 0) {
              _move(e, { axis: "row", value: -1 }, callback);
            } else if (e.wheelDeltaX > 0) {
              _move(e, { axis: "column", value: 1 }, callback);
            } else {
              _move(e, { axis: "column", value: -1 }, callback);
            }
          },
        };
      },
      Mobile(callback) {
        let initialTouchY = 0;
        let initialTouchX = 0;
        let changedTouchY;
        let changedTouchX;
        let deltaY;
        let deltaX;

        return {
          ontouchstart(e) {
            active.element = e.target;
            initialTouchY = e.touches[0].clientY;
            initialTouchX = e.touches[0].clientX;
          },
          ontouchmove(e) {
            if (moveInProcess) {
              return;
            }

            changedTouchY = e.changedTouches[0].clientY;
            changedTouchX = e.changedTouches[0].clientX;
            deltaY = changedTouchY - initialTouchY;
            deltaX = changedTouchX - initialTouchX;

            if (deltaY > TOUCH_DELTA) {
              _move(e, { axis: "row", value: 1 }, callback);
            } else if (deltaY < -TOUCH_DELTA) {
              _move(e, { axis: "row", value: -1 }, callback);
            } else if (deltaX > TOUCH_DELTA) {
              _move(e, { axis: "column", value: 1 }, callback);
            } else {
              _move(e, { axis: "column", value: -1 }, callback);
            }
          },
          ontouchend(e) {
            moveInProcess = false;
          },
        };
      },
    };
  },
};

export function setWrapperElementMovementHandlers(element) {
  element.ondragover = (e) => {
    e.preventDefault();
    if (!isWatching) {
      e.dataTransfer.effectAllowed = "none";
      e.dataTransfer.dropEffect = "none";
    }
  };
  element.ondragenter = (e) => {
    e.preventDefault();
  };
  element.ondragleave = (e) => {
    e.preventDefault();
  };
}

const movementOption = IS_MOBILE
  ? MovementOptions.Slide().Mobile
  : PLAY_MOVEMENT === PLAY_MOVEMENT_OPTIONS.DRAG_N_DROP
  ? MovementOptions.DragNDrop()
  : MovementOptions.Slide().Desktop;

let target = {};
let active = {};
let isWatching = false;

export default function boxMovementHandlers(boxElement, callback) {
  const eventHandler = movementOption(callback);
  if (PLAY_MOVEMENT === PLAY_MOVEMENT_OPTIONS.SLIDE) {
    boxElement.classList.add(BOX_CSS_CLASSNAME_MOVEMENT_SLIDE);
  } else {
    boxElement.draggable = true;
    boxElement.classList.add(BOX_CSS_CLASSNAME_MOVEMENT_DRAG_N_DTOP);
  }

  for (const key in eventHandler) {
    boxElement[key] = eventHandler[key];
  }
}
