/* eslint-disable react-hooks/exhaustive-deps */
import { newObject, useAuthenticationHOC, useMutateReducer, useQuery } from 'shared/hoc';
// import { useFormHook } from './form';
import { useEffect, useRef, useState } from 'react';

export const useCategoryListingHook = ({ onSuccess } = {}) => {
  const {
    reducerName,
    // axios,
    actions: { GET_CORE_CATEGORY_LIST_API_CALL, GET_CORE_SKILL_LIST_API_CALL },
    reducerConstants: { GET_CORE_CATEGORY_LIST_API, GET_CORE_SKILL_LIST_API },
  } = useAuthenticationHOC();

  const [category, skills] = useQuery(reducerName, [
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
  ]);

  //   const { formRef, formId } = useFormHook();

  const getSkillsById = (id) => {
    GET_CORE_SKILL_LIST_API_CALL({
      request: {
        paramsSerializer: { arrayFormat: 'bracket' },
        query: {
          __in_list__cores: id,
          paginate: 0,
          //   approved: 1,
        },
      },
    });
  };

  //   useEffect(() => {
  //     if (formRef?.values?.core_id) getSkillsById(formRef?.values?.core_id);
  //   }, [formRef?.values?.core_id]);

  useEffect(() => {
    GET_CORE_CATEGORY_LIST_API_CALL();
  }, []);

  return {
    getSkillsById,
    category,
    skills,
  };
};
