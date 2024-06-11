import dayjs from 'dayjs';
import { newFormArray, newSchema } from '@cartoonmangodev/react-form-handler/utils';
import { formatSingleDigitToDoubleDigit } from 'utils';
import { useForm } from 'utils/FormValidation';
import { ACHIEVEMENTS, EDUCATION, ENDORSEMENTS, EXPERIENCE } from 'utils/constants';

const id = {};

const title = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  inputProps: {
    placeholder: 'Enter Education Title',
    label: 'Title',
  },
};

const achievement_title = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  inputProps: {
    placeholder: 'Enter Achievement Title',
    label: 'Title',
  },
};

const endorsement_title = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  inputProps: {
    placeholder: 'Enter Endorsement Title',
    label: 'Title',
  },
};

const description = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  inputProps: {
    placeholder: 'Enter description',
    label: 'Description',
  },
};

const organisation = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  inputProps: {
    placeholder: 'Enter organisation name',
    // label: "Company/Organisation",
    label: 'Title',
  },
};

const location = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  inputProps: {
    placeholder: 'Enter Location',
    label: 'Location',
  },
};

const institution = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  inputProps: {
    placeholder: 'Institution name',
    label: 'Institution',
  },
};

const position = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  inputProps: {
    placeholder: 'Enter your role',
    label: 'Position',
  },
};

const date = {
  isRequired: false,
  message: {
    required: 'This field is required',
  },
  inputProps: (formRef, config, { onChange, value }) => ({
    placeholder: 'Select Year',
    label: 'Date',
    onChange: (_dayjs, date) => {
      onChange(_dayjs.format('YYYY-MM-DD'));
    },
    value: value ? dayjs(value, 'YYYY-MM-DD') : '',
  }),
};

const month_inputProps = (formRef, config, { onChange, value }) => ({
  onChange: (_dayjs) => {
    onChange(formatSingleDigitToDoubleDigit(_dayjs.month()));
  },
  value: value ? dayjs().month(value) : '',
});

const year = {
  inputProps: (formRef, config, { onChange, value }) => ({
    onChange: (_dayjs, year) => {
      onChange(year);
    },
  }),
};

const start_from_month = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  inputProps: month_inputProps,
};

const start_from_year = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  ...year,
};

const end_in_month = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  inputProps: month_inputProps,
};

const end_in_year = {
  isRequired: true,
  message: {
    required: 'This field is required',
  },
  ...year,
};
const attachment = {
  isRequired: false,
};
export const FORM_CONFIG = {
  [EDUCATION]: newFormArray({
    title,
    institution,
    date,
    id,
    attachment,
  }),
  [ACHIEVEMENTS]: newFormArray({
    title: achievement_title,
    description,
    date,
    id,
    attachment,
  }),
  [EXPERIENCE]: newFormArray({
    attachment,
    title: organisation,
    location,
    position,
    // start_from_month,
    // start_from_year,
    // end_in_month,
    // end_in_year,
    id,
  }),
  [ENDORSEMENTS]: newFormArray({
    title: endorsement_title,
    description,
    id,
    attachment,
  }),
};

export const useFormHook = (initialState) =>
  useForm({
    FORM_CONFIG,
    initialState,
  });
