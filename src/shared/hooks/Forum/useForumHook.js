import { useEffect, useMemo, useRef, useState } from 'react';
import { getData, typeOf } from 'react-boilerplate-redux-saga-hoc/utils';
import { useDashboardHOC, useMutateReducer, useQuery } from 'shared/hoc';
import { useAntdMessage } from '../Common';
// import { useRouter } from "next/navigation";
// import { useRouter as useRouting } from "next/router";

const LIMIT = 10;

export const useForumHook = ({ currentPage = 1, isDetail = false } = {}) => {
  const [initialRender, setInitialRender] = useState(true);
  const [filters, setFilters] = useState({
    categories: [],
    time: [],
  });

  const [replyId, setReplyId] = useState(null);
  const [replyInput, setReplyInput] = useState('');
  const { errorMessage, successMessage } = useAntdMessage();
  const {
    reducerName,
    reducerConstants: { GET_FORUM_POST_LIST_API, GET_FORUM_REPLIES_API, POST_FORUM_REPLY_API },
    actions: {
      GET_FORUM_POST_LIST_API_CALL,
      LIKE_FORUM_POST_API_CALL,
      GET_FORUM_POST_LIST_API_CANCEL,
      LIKE_FORUM_POST_API_CANCEL,
      GET_FORUM_REPLIES_API_CALL,
      GET_FORUM_REPLIES_API_CANCEL,
      POST_FORUM_REPLY_API_CALL,
      POST_FORUM_REPLY_API_CANCEL,
      UPDATE_FORUM_REPLY_LIKE_API_CALL,
      UPDATE_FORUM_REPLY_LIKE_API_CANCEL,
    },
  } = useDashboardHOC();
  const mutateReducer = useMutateReducer();

  const getForumData = () => {
    GET_FORUM_POST_LIST_API_CALL({
      request: {
        query: {
          paginate: 1,
          items: LIMIT,
          page: currentPage,
          sort_by: 'created_at',
          desc: 1,
          ...(filters?.categories?.length && {
            forum_categories: Array.isArray(filters?.categories)
              ? filters?.categories?.join(',')
              : filters?.categories,
          }),
          ...(filters?.time?.length && {
            from_time: Array.isArray(filters?.time) ? filters?.time?.join(',') : filters?.time,
          }),
        },
      },
      callback: {
        successCallback({ message, data: { data: successData } }) {
          // let successData = [];
          if (currentPage === 1) {
            let task = {
              response: {
                data: {
                  data: successData.data,
                  pagination: successData.pagination,
                },
              },
            };
            return {
              task,
            };
          } else {
            let task = {
              name: 'Infinite-Handler',
              response: {
                data: {
                  data: [...forumPostList, ...successData.data],
                  pagination: successData.pagination,
                },
              },
            };
            return {
              task,
            };
          }
        },
        errorCallback: ({ message, status }) => {
          if (typeOf(message) === 'object' && status === 'ERROR') {
            errorMessage(
              (message.non_field_errors && message.non_field_errors[0]) || 'Something Went Wrong'
            );
            // setOTPError(message.non_field_errors[0] || 'OTP is incorrect');
          } else errorMessage('Something Went Wrong');
        },
      },
    });
    return () => {
      GET_FORUM_POST_LIST_API_CANCEL();
    };
  };
  const handleLike = (obj) => {
    LIKE_FORUM_POST_API_CALL({
      task: { clearData: true },
      request: {
        payload: {
          forum_id: obj.id,
          is_like: obj.is_liked ? 'UNLIKE' : 'LIKE',
        },
      },
      callback: {
        successCallback({ state = {}, data: { data: successData = {} } }) {
          if (isDetail) {
            let _obj = {
              ...obj,
              is_liked: successData.is_liked === 'LIKE' ? true : false,
              total_likes: successData.total_likes,
            };
            mutateReducer((state) => ({
              [FORUM_POST_DETAIL_API]: {
                ...state[FORUM_POST_DETAIL_API],
                data: {
                  data: _obj,
                },
              },
            }));
          } else {
            mutateReducer((state) => ({
              [GET_FORUM_POST_LIST_API]: {
                ...state[GET_FORUM_POST_LIST_API],
                data: {
                  data: forumPostList.map((item) =>
                    item.id === successData.forum_id
                      ? {
                          ...item,
                          is_liked: successData.is_liked === 'LIKE' ? true : false,
                          total_likes: successData.total_likes,
                        }
                      : item
                  ),
                },
              },
            }));
          }
        },
        errorCallback: ({ message, status }) => {
          if (typeOf(message) === 'object' && status === 'ERROR') {
            errorMessage(
              (message.non_field_errors && message.non_field_errors[0]) || 'Something Went Wrong'
            );
            // setOTPError(message.non_field_errors[0] || 'OTP is incorrect');
          } else errorMessage('Something Went Wrong');
        },
      },
    });
    return () => {
      LIKE_FORUM_POST_API_CANCEL();
    };
  };

  const getForumReplies = () => {
    GET_FORUM_REPLIES_API_CALL({
      request: {
        query: {
          forum_id: replyId,
        },
      },
    });

    return () => {
      GET_FORUM_REPLIES_API_CANCEL();
    };
  };
  const handlePostReply = () => {
    if (replyInput.length) {
      const payload = {
        forum_id: replyId,
        reply: replyInput,
      };
      POST_FORUM_REPLY_API_CALL({
        task: { clearData: true },
        request: {
          payload: payload,
        },
        callback: {
          successCallback: ({ data: { data: successData } }) => {
            setReplyInput(null);
            let _obj = replies;
            _obj.unshift(successData);
            mutateReducer((state) => ({
              [GET_FORUM_POST_LIST_API]: {
                ...state[GET_FORUM_POST_LIST_API],
                data: {
                  data: forumPostList.map((item) =>
                    item.id === successData.forum_id
                      ? {
                          ...item,
                          total_replies: item.total_replies + 1,
                        }
                      : item
                  ),
                },
              },
              [GET_FORUM_REPLIES_API]: {
                ...state[GET_FORUM_REPLIES_API],
                data: _obj,
              },
            }));
          },
          errorCallback: ({ message, status }) => {
            errorMessage('Something Went Wrong');
          },
        },
      });
    } else {
      errorMessage('Please enter some text to reply.');
    }
    return () => {
      POST_FORUM_REPLY_API_CANCEL();
    };
  };
  const handleUpdateReviewReplyLikes = ({ reply_id, isLike }) => {
    const payload = {
      forum_reply_id: reply_id,
      is_like: isLike,
    };
    UPDATE_FORUM_REPLY_LIKE_API_CALL({
      request: {
        payload: payload,
      },
      callback: {
        successCallback: ({ data: { data: successData } }) => {
          console.log(replies, successData);
          mutateReducer((state) => ({
            // [GET_FORUM_POST_LIST_API]: {
            //   ...state[GET_FORUM_POST_LIST_API],
            //   data: {
            //     data: forumPostList.map((item) =>
            //       item.id === successData.forum_id
            //         ? {
            //             ...item,
            //             total_like: item.total_like + 1,
            //           }
            //         : item
            //     ),
            //   },
            // },
            [GET_FORUM_REPLIES_API]: {
              ...state[GET_FORUM_REPLIES_API],
              data: replies.map((item) =>
                item.id === successData.forum_reply_id
                  ? {
                      ...item,
                      is_liked: Number(successData.is_like),
                      total_likes: successData.total_like,
                    }
                  : item
              ),
            },
          }));
        },
      },
    });
    return () => {
      UPDATE_FORUM_REPLY_LIKE_API_CANCEL();
    };
  };
  useEffect(() => {
    if (replyId) {
      getForumReplies();
    }
  }, [replyId]);
  const handleFilterChange = (filterType, values) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: values,
    }));
  };

  useEffect(() => {
    if (!initialRender) {
      getForumData();
    }
    // Set initial render flag to false after the first render
    setInitialRender(false);
  }, [filters]); // Watch for changes in the filters state
  const {
    data: { data: forumPostList, pagination },
    loader,
  } = useQuery(reducerName, {
    key: GET_FORUM_POST_LIST_API,
    default: {},
    initialLoaderState: false,
  });

  const { data: replies, loading: { status: repliesLoader } = {} } = useQuery(reducerName, {
    key: GET_FORUM_REPLIES_API,
    default: [],
    initialLoaderState: false,
  });
  return {
    postList: {
      getData: getForumData,
      data: forumPostList,
      pagination,
      loader,
      filters,
      handleFilterChange,
    },
    like: {
      handleLike,
    },
    replies: {
      handleLike: handleUpdateReviewReplyLikes,
      getData: getForumReplies,
      data: replies,
      loader: repliesLoader,
      handlePostReply,
      setReplyId,
      replyId,
      setReplyInput,
      replyInput,
    },
  };
};
