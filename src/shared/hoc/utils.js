export class CustomError extends Error {
  constructor(response, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    // this.name =
    // Custom debugging information
    this.response = response;
  }
}
export const getCookieToken = (name, value) => {
  const cookie = `${name}=${value}; Path=/;`;
  return cookie;
};

export const setCookie = (name, value) => {
  if (typeof document !== "undefined")
    document.cookie = getCookieToken(name, value);
};

export const deleteCookie = (name) => {
  if (typeof document !== "undefined")
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const getCookie = (cname) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export function removeEmptyObjects(array) {
  const newArray = array.filter((element) => {
    if (Object.keys(element).length !== 0) {
      return true;
    }

    return false;
  });

  return newArray;
}
