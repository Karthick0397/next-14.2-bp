import { cleanObject } from 'shared/utils/utilFunctions';
import { store } from 'shared/utils/store';
import { generateUniqueId } from '@cartoonmangodev/react-form-handler/utils';

const getReducerData = (constants) =>
  (Array.isArray(constants) ? constants : []).reduce(
    (acc, key) => {
      const reducerName = key.split('/')[2];
      acc[reducerName] = acc[reducerName] || {};
      acc[reducerName][key] = store.getState()[reducerName][key];
      return acc;
    },
    { lastUpdated: generateUniqueId() }
  );

export const sendResponse = async ({ getState, context }, props, constants) => {
  return {
    props: cleanObject({
      // props: {
      ...props,
      __REDUCER_DATA__: constants?.length > 0 && getReducerData(constants),
    }),
  };
};

export async function defaultServerSideProps(context, props = {}, constants = []) {
  /* Please don't send key 'res' or api response in return object it will create a circular dependency */
  return sendResponse({ context }, props, constants);
}
