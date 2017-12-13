
export const NOOP = () => {};

/**
 * gets coordinates of the top left from center coordinates
 * @param  {number} top    top coordinate of center
 * @param  {number} left   left coordinate of center
 * @param  {number} width  width of component
 * @param  {number} height height of component
 * @return {object}        top and left coordinates of top left corner
 */

export function getTopLeftCoordinatesFromCenter(top, left, width, height) {
  return {
    top: top - height / 2,
    left: left - width / 2,
  };
};

/**
 * gets coordinates of the center from top left coordinates
 * @param  {number} top    top coordinate of top left corner
 * @param  {number} left   left coordinate of top left corner
 * @param  {number} width  width of component
 * @param  {number} height height of component
 * @return {object}        top and left coordinates of center
 */

export function getCenterCoordinatesFromTopLeft(top, left, width, height) {
  return {
    top: top + height / 2,
    left: left + width / 2,
  };
}

/**
 * Shallow comparison between two objects
 * @param  {object} objectA
 * @param  {object} objectB
 * @return {boolean}
 */

export function shallowEqual(objectA, objectB) {
  if (objectA === objectB) {
    return true;
  }

  if (objectA === null || typeof objectA !== 'object' ||
      objectB === null || typeof objectB !== 'object') {
    return false;
  }

  let keysOfA = Object.keys(objectA);
  let keysOfB = Object.keys(objectB);

  if (keysOfA.length !== keysOfB.length) {
    return false;
  }

  let aHasProp = hasOwnProperty.bind(objectA);
  let bHasProp = hasOwnProperty.bind(objectB);
  for (var i = 0; i < keysOfA.length; i++) {
    if (aHasProp(keysOfA[i])) {
      if (!bHasProp(keysOfA[i]) || objectB[keysOfA[i]] !== objectA[keysOfA[i]]) {
        return false;
      }
    }
  }

  return true;
};
