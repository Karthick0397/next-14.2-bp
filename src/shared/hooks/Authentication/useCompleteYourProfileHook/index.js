import { useAuthenticationHOC, useQuery } from 'shared/hoc';
import { useAntdMessage } from 'shared/hooks/Common';
import { useFormHook } from './form';

import { ACHIEVEMENTS, EDUCATION, ENDORSEMENTS, EXPERIENCE } from 'utils/constants';
import { convertFormDataToPayloadFormat, convertPayloadToFormDataFormat } from './data';
import { getIn } from 'react-boilerplate-redux-saga-hoc/utils';
import { useEffect, useState } from 'react';
import { resetHeaders } from 'shared/hoc/axios';

export const useCompleteYourProfileHook = ({ onSuccess, step, edit, formArryRef }) => {
  const { errorMessage, successMessage } = useAntdMessage();
  const [isEdit, setIsEdit] = useState([]);
  const {
    reducerName,
    axios,
    actions: {
      ADD_ARTIST_EXPERIENCES_API_CALL,
      ADD_ARTIST_EXPERIENCES_API_CANCEL,
      ADD_ARTIST_ACHIEVEMENTS_API_CALL,
      ADD_ARTIST_ACHIEVEMENTS_API_CANCEL,
      ADD_ARTIST_EDUCATION_API_CALL,
      ADD_ARTIST_EDUCATION_API_CANCEL,
      ADD_ARTIST_ENDORSEMENTS_API_CALL,
      ADD_ARTIST_ENDORSEMENTS_API_CANCEL,

      UPDATE_ARTIST_EXPERIENCES_API_CALL,
      UPDATE_ARTIST_EXPERIENCES_API_CANCEL,
      UPDATE_ARTIST_ACHIEVEMENTS_API_CALL,
      UPDATE_ARTIST_ACHIEVEMENTS_API_CANCEL,
      UPDATE_ARTIST_EDUCATION_API_CALL,
      UPDATE_ARTIST_EDUCATION_API_CANCEL,
      UPDATE_ARTIST_ENDORSEMENTS_API_CALL,
      UPDATE_ARTIST_ENDORSEMENTS_API_CANCEL,
    },
    reducerConstants: {
      ADD_ARTIST_EXPERIENCES_API,
      ADD_ARTIST_EDUCATION_API,
      ADD_ARTIST_ACHIEVEMENTS_API,
      ADD_ARTIST_ENDORSEMENTS_API,

      UPDATE_ARTIST_EXPERIENCES_API,
      UPDATE_ARTIST_EDUCATION_API,
      UPDATE_ARTIST_ACHIEVEMENTS_API,
      UPDATE_ARTIST_ENDORSEMENTS_API,
    },
  } = useAuthenticationHOC();

  const ADD_API = {
    [EXPERIENCE]: ADD_ARTIST_EXPERIENCES_API_CALL,
    [EDUCATION]: ADD_ARTIST_EDUCATION_API_CALL,
    [ACHIEVEMENTS]: ADD_ARTIST_ACHIEVEMENTS_API_CALL,
    [ENDORSEMENTS]: ADD_ARTIST_ENDORSEMENTS_API_CALL,
  };
  const UPDATE_API = {
    [EXPERIENCE]: UPDATE_ARTIST_EXPERIENCES_API_CALL,
    [EDUCATION]: UPDATE_ARTIST_EDUCATION_API_CALL,
    [ACHIEVEMENTS]: UPDATE_ARTIST_ACHIEVEMENTS_API_CALL,
    [ENDORSEMENTS]: UPDATE_ARTIST_ENDORSEMENTS_API_CALL,
  };

  const GET_ADD_DATA = {
    [EXPERIENCE]: ADD_ARTIST_EXPERIENCES_API,
    [EDUCATION]: ADD_ARTIST_EDUCATION_API,
    [ACHIEVEMENTS]: ADD_ARTIST_ACHIEVEMENTS_API,
    [ENDORSEMENTS]: ADD_ARTIST_ENDORSEMENTS_API,
  };

  const GET_UPDATE_DATA = {
    [EXPERIENCE]: UPDATE_ARTIST_EXPERIENCES_API,
    [EDUCATION]: UPDATE_ARTIST_EDUCATION_API,
    [ACHIEVEMENTS]: UPDATE_ARTIST_ACHIEVEMENTS_API,
    [ENDORSEMENTS]: UPDATE_ARTIST_ENDORSEMENTS_API,
  };

  const [{ loader: submitLoader }, { loader: updateLoader }, profile] = useQuery(reducerName, [
    {
      key: GET_ADD_DATA[step],
      requiredkey: ['loader'],
    },
    {
      key: GET_UPDATE_DATA[step],
      requiredkey: ['loader'],
    },
    'profile',
  ]);

  const dataList = getIn(profile, ['artist_details', step]) || [];

  const { formRef, formId } = useFormHook(
    edit
      ? {
          [step]: dataList.map((_data) => convertPayloadToFormDataFormat[step](_data)),
        }
      : {}
  );
  const onSubmit = ({ formRef: _formRef, index }) => {
    const { values, isError } = _formRef.validateForm();
    const payload = convertFormDataToPayloadFormat[step](values);

    // if (payload.title)
    //   if (
    //     payload.title?.trim() ===
    //     _formRef._initialConfig.initialValues.title?.trim()
    //   )
    //     delete payload.title;

    // resetHeaders();
    if (!isError)
      (values.id ? UPDATE_API : ADD_API)[step]({
        request: {
          payload,
          params: {
            id: values.id,
          },
        },
        callback: {
          successCallback: ({ state = {}, data = {} }) => {
            if (values.id) {
              onClickEdit(values.id);
              _formRef.setInitialFormData(data?.data);
            } else {
              _formRef.setInitialFormData(data?.data);
            }
            onSuccess();
            successMessage(values.id ? 'data updated successfully' : 'data added successfully');
          },
          errorCallback: ({ errorData = {}, isNetworkError }) => {
            if (isNetworkError) errorMessage('Please check your internet connection');
            else if (errorData.errors && typeof errorData.errors === 'string')
              errorMessage(errorData.errors);
            else if (errorData.message) errorMessage(errorData.message);
            else errorMessage('Sorry unable to save data');
          },
        },
      });
  };

  const onClickEdit = (id) => {
    const _isEdit = { ...isEdit };
    _isEdit[id] = !_isEdit[id];
    setIsEdit(_isEdit);
  };

  useEffect(() => {
    setIsEdit(dataList.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {}));
  }, []);

  return {
    updateLoader,
    onSubmit,
    submitLoader,
    profile,
    formRef,
    dataList,
    isEdit,
    onClickEdit,
    rootFormId: formId,
  };
};
