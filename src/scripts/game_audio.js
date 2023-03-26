const { ALLOW_SOUND, SOUND_BOX_DESTROYED } = APP_SETTINGS;

const audio = new Audio();
audio.src = SOUND_BOX_DESTROYED;
audio.volume = 1;

export const GameAudio = {
  matchBoxes() {
    if (ALLOW_SOUND) {
      audio.play();
    }
  },
};
