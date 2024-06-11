import { getServerRequestConfig } from 'shared/HigherOrderComponent/AuthHoc/utils';
import { DashboardHocProps } from 'shared/hoc';
import { defaultServerSideProps } from 'utils/getServerSidePropsResponse';

export async function getServerSideProps(context) {
  const { query } = getServerRequestConfig(context);
  const {
    actions: {
      GET_ALL_PRODUCTS_API_CALL,
      GET_PRODUCT_DETAIL_API_CALL,
      GET_PRODUCT_REVIEWS_API_CALL,
    },
    reducerConstants: { GET_ALL_PRODUCTS_API, GET_PRODUCT_DETAIL_API, GET_PRODUCT_REVIEWS_API },
  } = DashboardHocProps();
  const constants = [GET_ALL_PRODUCTS_API, GET_PRODUCT_DETAIL_API, GET_PRODUCT_REVIEWS_API];
  const props = {};
  await GET_PRODUCT_DETAIL_API_CALL({
    request: {
      params: {
        id: query.id,
      },
    },
  });
  const { status } = await GET_PRODUCT_REVIEWS_API_CALL({
    request: {
      params: {
        id: query.id,
      },
    },
  });
  await GET_ALL_PRODUCTS_API_CALL({
    request: {
      query: {
        paginate: 1,
        items: 10,
        page: 1,
        sort_by: 'created_at',
        desc: 1,
        // ...(categories?.length && { forum_categories: categories }),
      },
    },
  });
  props.product_id = { id: query.id };
  return await defaultServerSideProps(context, props, constants);
}

export default getServerSideProps;
