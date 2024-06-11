import nextCookie from 'next-cookies';
import { COOKIE_KEY, TEST_TOKEN } from './authConfig';

export const getServerRequestConfig = (_context = {}) => {
  const context = _context.ctx || _context;
  const { res, req, store, pathname, query, asPath, isServer, ...rest } = context;
  const isMobile = ((req ? req.headers['user-agent'] : navigator.userAgent) || '').match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  const token = nextCookie(context)[COOKIE_KEY] || TEST_TOKEN;
  const host = req && req.headers && req.headers.host;

  const isSubDomain =
    host &&
    (((host.split('.') && host.split('.')) || []).length === 3 &&
    !['www.example.com'].includes(host)
      ? host.split('.') && host.split('.')[0]
      : false);

  const props = {
    res,
    req,
    store: store,
    pathname,
    query,
    host,
    asPath,
    isServer,
    isMobile: Boolean(isMobile),
    token,
    isSubDomain,
  };
  global.__REQUEST_CONFIG__ = props;
  return props;
};
