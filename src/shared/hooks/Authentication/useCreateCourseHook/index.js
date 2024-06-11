/* eslint-disable react-hooks/exhaustive-deps */
import { newObject, useAuthenticationHOC, useMutateReducer, useQuery } from 'shared/hoc';
import { useAntdMessage } from 'shared/hooks/Common';
import { useFormHook } from './form';
import { useEffect, useRef, useState } from 'react';
import { resetHeaders } from 'shared/hoc/axios';
import { DEFAULT_VALUE } from './value';
import { useRouter } from 'next/dist/client/router';
import {
  cleanObject,
  cleanPayloadObject,
  removeEmpty,
  removeEmptyAndKey,
} from 'shared/utils/utilFunctions';
import { convertPayloadToFormDataFormat, removeUnwantedPayloadData } from './data';
import { ON_UNMOUNT } from 'react-boilerplate-redux-saga-hoc/constants';
import moment from 'moment';

export const useCreateCourseHook = ({ onSuccess } = {}) => {
  const router = useRouter();
  const course_id = router.query.id;
  const isEdit = !!course_id;
  const ref = useRef({ initial: true });
  const { errorMessage, successMessage } = useAntdMessage();
  const [scheduleTimings, setScheduleTimings] = useState();
  const {
    reducerName,
    // axios,
    actions: {
      LIST_MY_COURSE_SCHEDULES_API_CANCEL,
      GET_CORE_CATEGORY_LIST_API_CALL,
      LIST_MY_COURSE_SCHEDULES_API_CALL,
      GET_COURSE_DEMO_SCHEDULE_API_CALL,
      GET_CORE_SKILL_LIST_API_CALL,
      CREATE_COURSES_API_CALL,
      UPDATE_COURSES_API_CALL,
      DELETE_COURSE_SCHEDULE_TIMING_API_CALL,
    },
    reducerConstants: {
      GET_CORE_SKILL_LIST_API,
      GET_CORE_CATEGORY_LIST_API,
      LIST_MY_COURSE_SCHEDULES_API,
      UPDATE_COURSES_API,
      CREATE_COURSES_API,
      GET_COURSE_DEMO_SCHEDULE_API,
      DELETE_COURSE_SCHEDULE_TIMING_API,
    },
  } = useAuthenticationHOC();

  const [
    profile,
    category,
    skills,
    update,
    create,
    course_schedules,
    { data: demo_schedules, loader: demoSchedulesLoader, lastUpdated: demoSchedulesLastUpdated },
    deleteSchedule,
    details,
  ] = useQuery(reducerName, [
    'profile',
    {
      key: GET_CORE_CATEGORY_LIST_API,
      requiredKey: ['loader', 'data'],
      default: [],
    },
    {
      key: GET_CORE_SKILL_LIST_API,
      requiredKey: ['loader', 'data'],
      default: [],
    },
    {
      key: UPDATE_COURSES_API,
      requiredKey: ['loader', 'data'],
      default: [],
    },
    {
      key: CREATE_COURSES_API,
      requiredKey: ['loader', 'data'],
      default: [],
    },
    {
      key: LIST_MY_COURSE_SCHEDULES_API,
      requiredKey: ['loader', 'data', 'lastUpdated'],
      default: [],
    },
    {
      key: GET_COURSE_DEMO_SCHEDULE_API,
      requiredKey: ['loader', 'data', 'lastUpdated'],
      default: {},
    },
    {
      key: DELETE_COURSE_SCHEDULE_TIMING_API,
      requiredKey: ['loader', 'data', 'lastUpdated'],
      default: {},
    },
    'course_edit',
  ]);
  const { formRef, formId } = useFormHook();
  useEffect(() => {
    if (demoSchedulesLastUpdated)
      formRef.setInitialState(
        +router.query.id === details?.course_id
          ? {
              ...convertPayloadToFormDataFormat({
                ...details,
                demo_schedules: demo_schedules?.days
                  ? [demo_schedules]
                  : DEFAULT_VALUE.demo_schedules,
              }),
            }
          : {
              ...DEFAULT_VALUE,
              demo_schedules: demo_schedules?.days
                ? [removeUnwantedPayloadData(demo_schedules)]
                : DEFAULT_VALUE.demo_schedules,
            }
      );
  }, [demoSchedulesLastUpdated]);
  const getSkillsById = (id) => {
    GET_CORE_SKILL_LIST_API_CALL({
      request: {
        paramsSerializer: { arrayFormat: 'bracket' },
        query: {
          __in_list__cores: id,
          paginate: 0,
        },
      },
    });
  };

  useEffect(() => {
    if (formRef?.values?.core_id) getSkillsById(formRef?.values?.core_id);
  }, [formRef?.values?.core_id]);

  useEffect(() => {
    GET_CORE_CATEGORY_LIST_API_CALL();
    GET_COURSE_DEMO_SCHEDULE_API_CALL();
    return () => {
      LIST_MY_COURSE_SCHEDULES_API_CANCEL(ON_UNMOUNT);
    };
  }, []);

  useEffect(() => {
    if (course_schedules?.lastUpdated) {
      const _scheduleTimings = (course_schedules?.data || []).reduce((acc, curr) => {
        // if (curr.course_id === router.query.id) return acc;
        curr.days.forEach(({ timings, day }) => {
          acc[day] = acc[day] || [];
          acc[day] = acc[day].concat((timings || []).filter((e) => e.start_time && e.end_time));
        });
        return acc;
      }, {});
      setScheduleTimings(_scheduleTimings);
    }
  }, [course_schedules?.lastUpdated]);

  const getMyCourseSchedules = () => {
    // if (ref.current.initial) {
    //   ref.current.initial = false;
    LIST_MY_COURSE_SCHEDULES_API_CALL({
      request: {
        query: {
          start_date: formRef.values.start_date
            ? moment(formRef.values.start_date).format('DD-MM-YY')
            : undefined,
          endDate: formRef.values.end_date
            ? moment(formRef.values.end_date).format('DD-MM-YY')
            : undefined,
        },
      },
    });
    // }
  };

  const onSubmit = () => {
    const { values, isError, errors } = formRef.validateForm();
    let payload = removeEmpty(formRef.getFormValues(), ['no_of_students_joined']);
    delete payload.is_published;
    // resetHeaders();
    // console.log(isError, errors);
    if (!isError)
      (isEdit ? UPDATE_COURSES_API_CALL : CREATE_COURSES_API_CALL)({
        request: {
          payload,
          params: {
            id: course_id,
          },
        },
        callback: {
          successCallback: ({ state = {}, data = {} }) => {
            router.back();
            // onSuccess();
            successMessage(isEdit ? 'Courses updated successfully' : 'Courses added successfully');
          },
          errorCallback: ({ errorData = {}, isNetworkError }) => {
            console.log(errorData);
            if (isNetworkError) errorMessage('Please check your internet connection');
            else if (errorData.message) errorMessage(errorData.message);
            else errorMessage('Sorry unable to save data');
          },
        },
      });
    else {
      errorMessage('There is an error in the form.Please check all the fields');
    }
  };
  const onDeleteScheduleTiming = (course_timing_id, callback) => {
    DELETE_COURSE_SCHEDULE_TIMING_API_CALL({
      request: {
        params: {
          timing_id: course_timing_id,
        },
      },
      callback: {
        successCallback: () => {
          if (callback) callback();
          successMessage('Schedule Deleted successfully');
        },
        errorCallback: ({ errorData = {}, isNetworkError }) => {
          console.log(errorData);
          if (isNetworkError) errorMessage('Please check your internet connection');
          else if (errorData.message) errorMessage(errorData.message);
          else errorMessage('Sorry unable to save data');
        },
      },
    });
  };
  return {
    onSubmit,
    profile,
    formRef,
    rootFormId: formId,
    getSkillsById,
    category,
    skills,
    update,
    create,
    errorMessage,
    details,
    course_schedules,
    getMyCourseSchedules,
    scheduleTimings,
    setScheduleTimings,
    demoSchedulesLoader,
    demo_schedules,
    onDeleteSchedule: onDeleteScheduleTiming,
    deleteSchedule,
  };
};
