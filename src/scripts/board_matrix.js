const { ACTION_NAMES, BOX_TYPE_VALUES, RULE_MINIMUE_MATCHED_BOXES, TOTAL_BOX_TYPES } = APP_SETTINGS;
import { Level } from "./level";

function _reassignBoardMatrix() {
  matrix = Array(gameRows)
    .fill()
    .map(() =>
      Array(gameColumns)
        .fill()
        .map(() => _getRandomBoxType())
    );
}

function _rowColumnStringFormat(row, column) {
  return `${row}/${column}`;
}

function _rowColumnFormatToObject(str) {
  const arr = str.split("/");
  return { row: Number(arr[0]), column: Number(arr[1]) };
}

function _rowSequenceFilter(matches, index, data) {
  let sequence = [];
  data.forEach((item) => {
    item = _rowColumnFormatToObject(item);
    if (sequence.length === 0) {
      sequence.push(item.column);
    } else if (sequence[sequence.length - 1] + 1 == item.column) {
      sequence.push(item.column);
    } else {
      sequence.splice(0, sequence.length);
      sequence.push(item.column);
    }
  });
  if (sequence.length >= RULE_MINIMUE_MATCHED_BOXES) {
    matches.push(sequence.map((value) => _rowColumnStringFormat(index, value)));
  }
}

function _getFilteredResults(colorDirectionObj, directionKey) {
  let matches = [];

  for (let colorName in colorDirectionObj) {
    const colorData = colorDirectionObj[colorName];
    for (let index in colorData) {
      if (colorData[index].size >= RULE_MINIMUE_MATCHED_BOXES) {
        if (directionKey === "row") {
          _rowSequenceFilter(matches, index, colorData[index]);
        } else {
          matches.push(Array.from(colorData[index]));
        }
      }
    }
  }

  return [].concat.apply([], matches);
}

function _getStrikes() {
  let colorsRow = {};
  let colorsColumn = {};
  for (let row = 0; row < gameRows; row++) {
    for (let column = 0; column < gameColumns; column++) {
      const colorName = matrix[row][column];
      const prevRowOnMatrix = matrix[row - 1]?.[column];
      const prevColumnOnMatrix = matrix[row][column - 1];

      // Direction: Right
      if (colorName === prevColumnOnMatrix) {
        if (!colorsColumn[colorName]) {
          colorsColumn[colorName] = {};
        }
        if (!colorsColumn[colorName][row]) {
          colorsColumn[colorName][row] = new Set();
        }

        colorsColumn[colorName][row].add(_rowColumnStringFormat(row, column - 1));
        colorsColumn[colorName][row].add(_rowColumnStringFormat(row, column));
      }

      // Direction: Down
      if (colorName === prevRowOnMatrix) {
        if (!colorsRow[colorName]) {
          colorsRow[colorName] = {};
        }
        if (!colorsRow[colorName][column]) {
          colorsRow[colorName][column] = new Set();
        }
        colorsRow[colorName][column].add(_rowColumnStringFormat(row - 1, column));
        colorsRow[colorName][column].add(_rowColumnStringFormat(row, column));
      }
    }
  }

  const filteredResults = [..._getFilteredResults(colorsRow, "column"), ..._getFilteredResults(colorsColumn, "row")];
  const boxes = Array.from(new Set(filteredResults)).map(_rowColumnFormatToObject);
  totalDestroyedBoxes = boxes.length;
  return { boxes, totalDestroyedBoxes };
}

function _getRandomBoxType() {
  if (Level.currentLevelHasOnlyColors()) {
    return Level.getCurrentLevelRandomColor();
  }
  return BOX_TYPE_VALUES[Math.floor(Math.random() * TOTAL_BOX_TYPES)];
}

function _setCustomMatrixUpdateDimensions(customData) {
  matrix = customData;
  gameRows = customData.length;
  gameColumns = customData[0].length;
}

function _switchBoxes(from, to) {
  if (!switchBoxesEnabled) {
    return [];
  }
  const _from = matrix[from.row][from.column];
  const _to = matrix[to.row][to.column];
  matrix[from.row][from.column] = _to;
  matrix[to.row][to.column] = _from;
  return _getStrikes();
}

function _refillStrikesBoxes(strikes) {
  strikes.forEach((box) => {
    matrix[box.row][box.column] = _getRandomBoxType();
  });

  return this;
}

function _loopOverStrikes(origin, target) {
  return new Promise((resolve) => {
    if (switchFirstLoop) {
      switchData = _switchBoxes(origin, target);
      switchFirstLoop = false;
    }

    if (!switchData.totalDestroyedBoxes) {
      resolve(false);
      return;
    }

    observer.call(observer, ACTION_NAMES.LEVEL_BOXES_DESTROYES, switchData, () => {
      switchData = _getStrikes();
      resolve(switchData.totalDestroyedBoxes);
    });
  });
}

function _enableSwitchBoxes() {
  switchBoxesEnabled = true;
}

function _disableSwitchBoxes() {
  switchBoxesEnabled = false;
}

let matrix = [];
let gameRows = 0;
let gameColumns = 0;
let totalDestroyedBoxes = 0;
let observer;
let switchData;
let switchFirstLoop = false;
let switchBoxesEnabled = false;

export const BoardMatrix = {
  getMaxRows: () => gameRows - 1,
  getTotalRows: () => gameRows,
  getTotalColumns: () => gameColumns,
  getMatrix: () => matrix,
  getRow: (row) => matrix[row] ?? [],
  getValue: (row, column) => matrix[row]?.[column],
  getStrikes: _getStrikes,
  isSwitchBoxesEnabled: () => switchBoxesEnabled,
  disableSwitchBoxes: _disableSwitchBoxes,
  refillStrikesBoxes: _refillStrikesBoxes,
  observer(callback) {
    observer = callback;
  },
  reset(customData, rows, columns) {
    return this.start(customData, rows, columns);
  },
  async onBoxMoveAllowed(origin, target) {
    switchFirstLoop = true;
    while (await _loopOverStrikes(origin, target));
    observer.call(observer, ACTION_NAMES.LEVEL_FINISHED_CLEAR_ALL_BOXES);
  },
  start(customData, rows, columns) {
    gameRows = rows;
    gameColumns = columns;

    if (customData) {
      _setCustomMatrixUpdateDimensions(customData);
    } else if (!Level.getCurrentLevel()?.board) {
      throw new RangeError("Level doesn't exists");
    } else {
      _setCustomMatrixUpdateDimensions(Level.getCurrentLevel()?.board);
    }

    _enableSwitchBoxes();
    return this;
  },
  dispose() {
    _disableSwitchBoxes();
    matrix.splice(0, matrix.length);
    observer = null;
  },
};
