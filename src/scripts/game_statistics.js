const statistics = { ...{}, ...APP_SETTINGS.INITIAL_STATISTICS };
const observers = { score: [], level: null };
export const GameStatistics = {
  init(level) {
    statistics.level = level;
  },
  Level: {
    set(level, minimumScore) {
      statistics.level = level;
      statistics.minimumScore = minimumScore;
      observers.level.call(null, level);
    },
    observer(callback) {
      observers.level = callback;
    },
    getValue: () => statistics.level,
    getMinimumScoreValue: () => statistics.minimumScore,
  },
  Score: {
    update(data) {
      statistics.levelScore += data.score;
      statistics.gameScore += data.score;
      observers.score.forEach((callback) =>
        callback.call(null, { ...data, ...{ currentScoreState: statistics.levelScore } })
      );
    },
    resetLevelScore() {
      statistics.levelScore = 0;
    },
    getLevelValue: () => statistics.levelScore,
    getGameValue: () => statistics.gameScore,
    observer(callback) {
      observers.score.push(callback);
    },
  },
};
