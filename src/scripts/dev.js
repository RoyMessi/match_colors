const {
  BOX_TYPES,
  DEV_ALLOW_SAVING_BOARD_STATE,
  DEV_BOARD_STATE_NAME,
  DEV_TEST_NAME,
  GAME_MINIMUM_REQUIREMENTS,
} = APP_SETTINGS;
import { BoardMatrix } from "./board_matrix";

export const TESTS = {
  TEST1: [
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.RED],
    [BOX_TYPES.BLUE, BOX_TYPES.PURPLE, BOX_TYPES.ORANGE],
    [BOX_TYPES.BLUE, BOX_TYPES.RED, BOX_TYPES.ORANGE],
  ],
  TEST11: [
    [BOX_TYPES.BLUE, BOX_TYPES.RED, BOX_TYPES.RED],
    [BOX_TYPES.PURPLE, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
    [BOX_TYPES.BLUE, BOX_TYPES.RED, BOX_TYPES.ORANGE],
  ],
  TEST12: [
    [BOX_TYPES.BLUE, BOX_TYPES.RED, BOX_TYPES.ORANGE],
    [BOX_TYPES.BLUE, BOX_TYPES.PURPLE, BOX_TYPES.ORANGE],
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.RED],
  ],
  TEST13: [
    [BOX_TYPES.RED, BOX_TYPES.RED, BOX_TYPES.BLUE],
    [BOX_TYPES.PURPLE, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
  ],
  TEST131: [
    [BOX_TYPES.BLUE, BOX_TYPES.RED, BOX_TYPES.RED],
    [BOX_TYPES.PURPLE, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
  ],
  TEST14: [
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.RED],
    [BOX_TYPES.PURPLE, BOX_TYPES.ORANGE, BOX_TYPES.BLUE],
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
  ],
  TEST141: [
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.RED],
    [BOX_TYPES.BLUE, BOX_TYPES.ORANGE, BOX_TYPES.PURPLE],
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
  ],
  TEST15: [
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
    [BOX_TYPES.PURPLE, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
    [BOX_TYPES.RED, BOX_TYPES.RED, BOX_TYPES.BLUE],
  ],
  TEST151: [
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
    [BOX_TYPES.PURPLE, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
    [BOX_TYPES.BLUE, BOX_TYPES.RED, BOX_TYPES.RED],
  ],
  TEST16: [
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.RED],
    [BOX_TYPES.PURPLE, BOX_TYPES.ORANGE, BOX_TYPES.BLUE],
    [BOX_TYPES.RED, BOX_TYPES.ORANGE, BOX_TYPES.BLUE],
  ],
  TEST17: [
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.RED],
    [BOX_TYPES.PURPLE, BOX_TYPES.ORANGE, BOX_TYPES.BLUE],
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
  ],
  TEST18: [
    [BOX_TYPES.RED, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
    [BOX_TYPES.PURPLE, BOX_TYPES.BLUE, BOX_TYPES.ORANGE],
    [BOX_TYPES.RED, BOX_TYPES.RED, BOX_TYPES.BLUE],
  ],
  TEST2: [
    [BOX_TYPES.GREEN, BOX_TYPES.BLUE, BOX_TYPES.YELLOW],
    [BOX_TYPES.YELLOW, BOX_TYPES.YELLOW, BOX_TYPES.ORANGE],
    [BOX_TYPES.YELLOW, BOX_TYPES.RED, BOX_TYPES.ORANGE],
  ],
  TEST3: [
    [BOX_TYPES.GREEN, BOX_TYPES.BLUE, BOX_TYPES.YELLOW, BOX_TYPES.PURPLE, BOX_TYPES.BLUE],
    [BOX_TYPES.YELLOW, BOX_TYPES.YELLOW, BOX_TYPES.ORANGE, BOX_TYPES.YELLOW, BOX_TYPES.YELLOW],
    [BOX_TYPES.PINK, BOX_TYPES.BLUE, BOX_TYPES.PURPLE, BOX_TYPES.YELLOW, BOX_TYPES.GREEN],
    [BOX_TYPES.GREEN, BOX_TYPES.BLUE, BOX_TYPES.RED, BOX_TYPES.GREEN, BOX_TYPES.RED],
  ],
};

export function dev_stateButtonsHelper() {
  if (!DEV_ALLOW_SAVING_BOARD_STATE) {
    return;
  }

  const saveStateBtn = document.querySelector("button[data-btn='save']");
  const removeStateBtn = document.querySelector("button[data-btn='remove']");
  saveStateBtn.addEventListener("click", () => {
    localStorage.setItem(DEV_BOARD_STATE_NAME, JSON.stringify(BoardMatrix.getMatrix()));
  });
  removeStateBtn.addEventListener("click", () => {
    localStorage.removeItem(DEV_BOARD_STATE_NAME);
    location.reload();
  });
}

function _camelCase(inputType) {
  return inputType.substring(0, 1).toUpperCase() + inputType.substring(1);
}

function _validateBoardMatrixStructure(data) {
  if (!data) {
    throw new TypeError("Cannot process falsy data");
  }

  const array = JSON.parse(data);
  if (!Array.isArray(array)) {
    throw new TypeError(`Data must be an Array got ${_camelCase(typeof array)}`);
  }

  if (GAME_MINIMUM_REQUIREMENTS.ROWS > array.length) {
    throw new RangeError(`The minimum rows mush be at least ${GAME_MINIMUM_REQUIREMENTS.ROWS} got ${array.length}`);
  }

  let columnsSize;
  array.every((row, rowIndex) => {
    if (GAME_MINIMUM_REQUIREMENTS.COLUMNS > row.length) {
      throw new RangeError(
        `The minimum required columns in a row is ${GAME_MINIMUM_REQUIREMENTS.ROWS} got ${row.length}`
      );
    }

    if (columnsSize && row.length != columnsSize) {
      throw new RangeError(
        `The amount of columns in row #${rowIndex} (${row.length}) is different than row #${
          rowIndex - 1
        } (${columnsSize})`
      );
    }

    columnsSize = row.length;
    return true;
  });

  return array;
}

export function dev_setMatrix() {
  if (DEV_TEST_NAME && TESTS[DEV_TEST_NAME]) {
    return TESTS[DEV_TEST_NAME];
  } else if (DEV_ALLOW_SAVING_BOARD_STATE && localStorage.getItem(DEV_BOARD_STATE_NAME) !== null) {
    const data = localStorage.getItem(DEV_BOARD_STATE_NAME);
    let savedBoardMatrix;
    try {
      savedBoardMatrix = _validateBoardMatrixStructure(data);
    } catch (err) {
      console.warn(err);
      console.error("Failed to generate the saved board matrix from storage");
    }

    return savedBoardMatrix;
  }
  return null;
}
