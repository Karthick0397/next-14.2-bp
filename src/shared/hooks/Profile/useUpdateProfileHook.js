import { useAuthenticationHOC, useQuery } from 'shared/hoc';
import { useAntdMessage } from '../Common';
import { useProfileDetailHook } from '.';
import { STUDENT } from 'utils/Routes/constants';

export const useUpdateProfileHook = ({ onSuccess } = {}) => {
  const { USER_TYPE } = useProfileDetailHook();

  const {
    reducerName,
    actions: { UPDATE_PROFILE_API_CALL },
    reducerConstants: { UPDATE_PROFILE_API },
  } = useAuthenticationHOC(false);
  // const mutateReducer = useMutateReducer(reducerName);
  const { errorMessage, successMessage } = useAntdMessage();
  const handleSubmit = (values, isGallery, isUpdate) => {
    {
      console.log(values, isGallery, isUpdate, 'values');
    }
    let _payload = isUpdate
      ? {
          ...values,
          years_of_experience: undefined,
          // artist_details: values.years_of_experience
          //   ? {
          //       years_of_experience: values.years_of_experience,
          //     }
          //   : undefined,
          artist_details: values.years_of_experience
            ? {
                years_of_experience: values.years_of_experience,
              }
            : undefined,
        }
      : isGallery
        ? {
            artist_details: {
              gallery: values,
            },
          }
        : {
            ...values,
            years_of_experience: undefined,
            artist_details:
              values.years_of_experience || values.artist_details.youtube_link
                ? {
                    ...(values.years_of_experience && {
                      years_of_experience: values.years_of_experience,
                    }),
                    ...(values.artist_details.youtube_link && {
                      youtube_link: values.artist_details.youtube_link,
                    }),
                  }
                : undefined,
            about_me: values.about_me,
            profile_picture: values.profile_picture || undefined,
            skills: values.skills.map((i, index) => {
              return {
                skill_id: i,
                level: values.skill_levels[index]?.level || undefined,
              };
            }),
            skill_levels: undefined,
            equipments: undefined,
            weekly_commitment: undefined,
            ...(USER_TYPE === STUDENT
              ? {
                  student_details: {
                    equipments: values.equipments,
                    weekly_commitment: values.weekly_commitment,
                  },
                }
              : null),
          };
    UPDATE_PROFILE_API_CALL({
      request: {
        payload: _payload,
      },
      callback: {
        updateStateCallback: ({ state, data }) => ({
          ...state,
          isLoggedIn: true,
          profile: data.data || data,
        }),
        successCallback: () => {
          successMessage('Profile Updated Successfully');
          if (onSuccess) onSuccess();
          //   router.reload();
        },
        errorCallback: ({ errorData = {}, isNetworkError }) => {
          const message = errorData.message;
          if (isNetworkError) errorMessage('Please check your internet connection');
          else if (message) errorMessage(message);
        },
      },
    });
  };
  // useEffect(() => {
  //   axios.defaults.withCredentials = false;
  //   delete axios.defaults.headers.common.Authorization;
  //   return () => {
  //     UPDATE_PROFILE_API_CANCEL();
  //   };
  // }, []);
  const [{ loader: submitLoader }] = useQuery(reducerName, [
    {
      key: UPDATE_PROFILE_API,
      requiredkey: ['loader'],
    },
  ]);
  return {
    handleSubmit,
    submitLoader,
  };
};
