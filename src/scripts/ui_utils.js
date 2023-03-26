const { SPACE, SPACE_FIX } = APP_SETTINGS;

export function updateBoxCssTranslate(element, location) {
  element.style.translate = `${location.column * SPACE + SPACE_FIX}rem ${location.row * SPACE + SPACE_FIX}rem`;
}

export function addAnimateCssClass(element, ...classNames) {
  element.classList.add.call(element.classList, ...classNames);
  return promiseOnAnimationEnd(element);
}

export function onAnimationEnd(element, callback) {
  element.addEventListener("animationend", callback, { once: true });
}
export function promiseOnAnimationEnd(element) {
  return new Promise((resolve) => {
    onAnimationEnd(element, resolve);
  });
}
