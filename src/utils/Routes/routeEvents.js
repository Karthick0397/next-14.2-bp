import NProgress from "nprogress";
import routerEvents from "next-router-events";

export const RouterEvents = (action = () => {}) => {
  routerEvents.on("routeChangeStart", (url) => {
    action(true);
    NProgress.start();
  });
  routerEvents.on("routeChangeComplete", (url) => {
    action(false);
    NProgress.done();
  });
  routerEvents.on("routeChangeError", (url) => {
    action(false);
    NProgress.done();
  });
};
