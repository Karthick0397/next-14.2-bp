import { getServerRequestConfig } from 'shared/HigherOrderComponent/AuthHoc/utils';
import { DashboardHocProps } from 'shared/hoc';
import { defaultServerSideProps } from 'utils/getServerSidePropsResponse';

export async function getServerSideProps(context) {
  const { query } = getServerRequestConfig(context);
  // const categories = query.categories || [];
  const {
    actions: { GET_ALL_PRODUCT_GROUPS_API_CALL, GET_ALL_BLOGS_CALL },
    reducerConstants: { GET_ALL_PRODUCT_GROUPS_API, GET_ALL_BLOGS },
  } = DashboardHocProps();

  const constants = [GET_ALL_PRODUCT_GROUPS_API, GET_ALL_BLOGS];
  const props = {};

  await GET_ALL_PRODUCT_GROUPS_API_CALL({});
  await GET_ALL_BLOGS_CALL({});
  return await defaultServerSideProps(context, props, constants);
}

export default getServerSideProps;
