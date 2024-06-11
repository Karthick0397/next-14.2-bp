import { getServerRequestConfig } from "shared/HigherOrderComponent/AuthHoc/utils";
import { DashboardHocProps } from "shared/hoc";
import { defaultServerSideProps } from "utils/getServerSidePropsResponse";

export async function getServerSideProps(context) {
  const { query } = getServerRequestConfig(context);
  const initialPage = parseInt(query.page || "1", 10);
  // const categories = query.categories || [];
  const {
    actions: { GET_FORUM_POST_LIST_API_CALL },
    reducerConstants: { GET_FORUM_POST_LIST_API },
  } = DashboardHocProps();

  const constants = [GET_FORUM_POST_LIST_API];
  const props = {};

  const {
    data: { status = {} },
  } = await GET_FORUM_POST_LIST_API_CALL({
    request: {
      query: {
        paginate: 1,
        items: 10,
        page: initialPage,
        sort_by: "created_at",
        desc: 1,
        // ...(categories?.length && { forum_categories: categories }),
      },
    },
  });
  props.posts = { status };
  return await defaultServerSideProps(context, props, constants);
}

export default getServerSideProps;
