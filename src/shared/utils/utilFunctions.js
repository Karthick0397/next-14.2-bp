/* eslint-disable no-param-reassign */

import moment from 'moment';
import { TYPE_BOOLEAN } from 'react-boilerplate-redux-saga-hoc/constants';

export const setCookieWithExpiration = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  date.setTime(date.getTime() + days * 1000); // seconds
  const expires = 'expires=' + date.toUTCString();
  if (typeof document !== 'undefined')
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
};

export const cleanObject = function (object) {
  Object?.entries(object).forEach(([k, v]) => {
    if (v && typeof v === 'object') cleanObject(v);
    if (Array.isArray(v) && v.length === 0) return;
    if (
      (v && typeof v === 'object' && !Object.keys(v).length) ||
      v === null ||
      v === undefined ||
      v.length === 0
    ) {
      if (Array.isArray(object)) object.splice(k, 1);
      else if (!(v instanceof Date)) delete object[k];
    }
  });
  return object;
};

const isValueEmpty = (_value) => !_value && typeof _value !== TYPE_BOOLEAN;

export const removeEmpty = (obj, idArray = []) => {
  Object.keys(obj).forEach((k) => {
    if (Array.isArray(obj[k]))
      obj[k] = obj[k].filter((e) =>
        typeof obj[k] === 'object' ? Object.keys(removeEmpty(e, idArray)).length : !isValueEmpty(e)
      );
    return idArray.includes(k)
      ? delete obj[k]
      : (obj[k] &&
          typeof obj[k] === 'object' &&
          Object.keys(obj[k]).length === 0 &&
          delete obj[k]) ||
          (obj[k] && typeof obj[k] === 'object' && removeEmpty(obj[k])) ||
          (isValueEmpty(obj[k]) && delete obj[k]);
  });
  return obj;
};

export const removeEmptyAndKey = (obj, idArray = []) => {
  Object.keys(obj).forEach((k) => {
    if (Array.isArray(obj[k]))
      obj[k] = obj[k].filter((e) =>
        typeof obj[k] === 'object'
          ? Object.keys(removeEmptyAndKey(e), idArray).length
          : !isValueEmpty(e)
      );
    return idArray.includes(k) && delete obj[k];
  });
  return obj;
};

export function getTimeElapsed(timestamp) {
  if (!(timestamp instanceof Date)) {
    return 'Invalid date';
  }

  const elapsed = Date.now() - timestamp.getTime(); // get the elapsed time in milliseconds
  const MINUTE = 60 * 1000; // milliseconds in a minute
  const HOUR = 60 * MINUTE; // milliseconds in an hour
  const DAY = 24 * HOUR; // milliseconds in a day
  // const WEEK = 7 * DAY; // milliseconds in a week

  if (elapsed < MINUTE) {
    return 'just now';
  } else if (elapsed < HOUR) {
    const minutes = Math.round(elapsed / MINUTE);
    return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`;
  } else if (elapsed < DAY) {
    const hours = Math.round(elapsed / HOUR);
    return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`;
  } else if (elapsed < 3 * DAY) {
    // Check if elapsed time is less than 3 days
    const days = Math.round(elapsed / DAY);
    return `${days} ${days > 1 ? 'days' : 'day'} ago`;
  } else {
    return moment(timestamp).format('DD-MM-YYYY');
  }
}
export const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export function numberWithCommas(x) {
  return (x || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
