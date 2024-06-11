import dayjs from 'dayjs';
import { newFormArray, newSchema } from '@cartoonmangodev/react-form-handler/utils';

// import { formatSingleDigitToDoubleDigit } from 'utils';
import { useForm } from 'utils/FormValidation';
// import { PRIMITIVE_VALUE } from '@cartoonmangodev/react-form-handler/constants';

// const TIME_FORMAT = 'HH:mm:ss';

const attachment = {
  isRequired: true,
};

const title = {
  isRequired: true,
  message: {
    required: 'Enter your course title',
  },
  inputProps: {
    placeholder: 'Enter course title',
    label: 'Course Title',
    type: 'text',
  },
};
const youtube_link = {
  isRequired: true,
  message: {
    required: 'Enter your course title',
  },
  inputProps: {
    placeholder: 'Enter youtube link',
    label: 'Youtube Link',
    type: 'text',
  },
};

const summary = {
  isRequired: true,
  message: {
    required: 'Enter your course summary',
  },
  inputProps: {
    placeholder: 'Summary of course',
    label: 'Course Summary',
    type: 'text',
    desc: '200 Characters',
    useTextArea: true,
    placeEnd: true,
  },
};

const core_id = {
  isRequired: true,
  message: {
    required: 'Select your Category',
  },
  inputProps: (formRef, config, { onChange }) => ({
    placeholder: 'Select',
    label: 'Category',
    onChange: (_value) => {
      formRef.onChangeValues('', 'specialisation_id');
      onChange(_value);
    },
  }),
};

const specialisation_id = {
  isRequired: true,
  message: {
    required: 'Select an Specialisation',
  },
  inputProps: {
    placeholder: 'Select',
    label: 'Specialisation',
  },
};

const style = {
  isRequired: true,
  message: {
    required: 'Enter your style',
  },
  inputProps: {
    placeholder: 'Enter your style details',
    label: 'Style',
    mode: 'tags',
    desc: 'Please enter your styles and select from dropdown',
  },
};

const description = {
  isRequired: true,
  // maxLength: 800,
  message: {
    required: 'Enter your description',
    maxLength: 'Maximum 800 characters allowed',
  },
  inputProps: {
    placeholder: 'Enter description',
    label: 'About the Course',
    desc: '800 Characters max',
    type: 'text',
    // desc: "Please enter your style. Use comma (,) to separate it",
    placeEnd: false,
    useTextArea: true,
  },
};

const level = {
  isRequired: true,
  message: {
    required: 'Select a Specialisation',
  },
  inputProps: {
    placeholder: 'Select',
    label: 'Course for',
  },
};

const recommended_per_week = {
  isRequired: true,
  message: {
    // required: "",
  },
  inputProps: {
    placeholder: 'Select',
    label: 'Recommended classes',
  },
};

const duration = {
  isRequired: true,

  message: {
    required: 'Select a duration',
  },
  inputProps: {
    placeholder: 'Select',
    label: 'Course Duration',
  },
};
const term = {
  isRequired: true,
  default: 'long',
  message: {
    required: 'Select a term',
  },
  inputProps: (formRef, config, { onChange, value }) => ({
    placeholder: 'Select',
    label: 'Select Term',
    onChange: (val) => {
      formRef.onChangeValues('', 'end_date');
      formRef.onChangeValues('', 'start_date');
      formRef.setRequired({
        start_date: val === 'short',
        end_date: val === 'short',
      });
      onChange(val);
    },
  }),
};

const level_up = {
  isRequired: true,
  message: {
    required: 'Enter your Level up details',
  },
  inputProps: {
    placeholder: 'Enter Level up details.eg 12 - 14 classes',
    label: 'Level Up',
    type: 'text',
  },
};

const minimum_age = {
  isRequired: true,
  message: {
    // required: "select your age",
  },
  inputProps: (formRef, config, { onChange }) => ({
    placeholder: 'from',
    label: 'Age Group',
    onChange: (_value) => {
      formRef.onChangeValues('', 'maximum_age');
      onChange(_value);
    },
  }),
};

const maximum_age = {
  isRequired: true,
  message: {
    // required: "select your age",
  },
  inputProps: (formRef, config, { onChange, value }) => ({
    placeholder: 'to',
    disabled: !formRef.values.minimum_age,
  }),
};

const languages = {
  isRequired: true,
  message: {
    required: 'Enter your languages',
  },
  inputProps: {
    placeholder: 'Enter supporting languages ',
    label: 'Language Supported',
    mode: 'tags',
    desc: 'Please enter your language and select from dropdown',
  },
};
const start_date = {
  isRequired: false,
  message: {
    required: 'Select start date',
  },
  inputProps: (formRef, config, { onChange, value }) => ({
    placeholder: 'Start Date ',
    label: 'Start Date',
    onChange: (_dayjs, date) => {
      formRef.onChangeValues('', 'end_date');
      onChange(_dayjs ? _dayjs.format('YYYY-MM-DD') : '');
    },
    value: value ? dayjs(value, 'YYYY-MM-DD') : '',
  }),
  validateFieldsOnChange: ['end_date'],
};
const end_date = {
  isRequired: false,
  message: {
    required: 'Select end date',
  },
  inputProps: (formRef, config, { onChange, value }) => ({
    placeholder: `End Date ${formRef.values.term === 'long' ? '(Optional)' : ''}`,
    label: 'End Date',
    onChange: (_dayjs, date) => {
      onChange(_dayjs ? _dayjs.format('YYYY-MM-DD') : '');
    },
    minDate: dayjs(formRef.values.start_date, 'YYYY-MM-DD'),
    value: value ? dayjs(value, 'YYYY-MM-DD') : '',
    disabled: !formRef.values.start_date,
  }),
};

const benefits = newFormArray({
  // [PRIMITIVE_VALUE]: {
  //   isRequired: true,
  //   message: {},
  // },
});
const prerequisites = newFormArray({});

const setFormData = (method, values, value) => {
  method({
    ...values,
    days: values.days.map((e) => ({
      ...e,
      timings: (e.timings || []).map((e) => ({
        ...e,
        no_of_students: value === '1_on_1' ? 1 : undefined,
      })),
    })),
  });
};
const schedules = (isDemo) =>
  newFormArray({
    learning_mode: {
      default: 'online',
      inputProps: (formRef, config, { onChange }) => ({
        onChange: (e) => {
          const value = e.target.value;
          console.log(value);
          onChange(value);
          formRef.onChangeValues('', 'class_address');
          formRef.onChangeValues('', 'location');
          formRef.setRequired({
            class_address: value === 'direct',
            location: value === 'direct',
          });
        },
      }),
    },
    participant_type: {
      isRequired: true,
      message: {
        required: 'select participiant type',
      },
      default: isDemo ? '1_on_1' : undefined,
      inputProps: (formRef, config, { onChange }) => ({
        label: 'Participants',
        placeholder: 'Select',
        onChange: (value) => {
          onChange(value || '');
          const { setFormValues, setFormErrors } = formRef;
          const values = formRef.getValues();
          const errors = formRef.getErrors();
          setFormData(setFormValues, values, value);
          setFormData(setFormErrors, errors, value);
        },
      }),
    },
    fee: {
      isRequired: true,
      allowValidNumber: true,
      message: {
        required: 'Please enter fee',
      },
      inputProps: (formRef, config, { onChange, value }) => ({
        label: 'Fee per class',
        placeholder: 'Enter fee',
        type: 'text',
        onChange: (e) => {
          const _value = e.target.value;
          if (_value !== '' && !Number.isNaN(+_value)) onChange(+_value);
          else onChange(_value);
        },
        value: `${value}`,
      }),
    },
    is_routine: {
      default: false,
    },
    class_address: {
      isRequired: false,
      inputProps: {
        label: 'Class Address',
        placeholder: 'Enter address',
        type: 'text',
      },
    },
    location: {
      isRequired: false,
      inputProps: {
        label: 'Location',
        placeholder: 'Enter location',
        type: 'text',
      },
    },
    available_area: { isRequired: true },
    days: newFormArray({
      day: {
        isRequired: true,
      },
      is_active: {
        default: false,
      },
      timings: newFormArray({
        start_time: {
          isRequired: false,
          inputProps: (
            formRef,
            config,
            { onChange, value, ...rest },
            { formValues, callback, day, parentFormRef } = {}
          ) => ({
            placeholder: 'Start Time',
            format: 'h:mm A',
            showNow: false,
            onChange: (_dayjs, date) => {
              const start_time = _dayjs ? _dayjs.format('HH:mm') : '';
              const end_time = _dayjs
                ? _dayjs.add(formValues.duration, 'minutes').format('HH:mm')
                : '';
              parentFormRef.onChangeValues(true, 'is_active');
              callback(
                day,
                {
                  start_time: formRef.getValues().start_time,
                  end_time: formRef.getValues().end_time,
                },
                {
                  start_time,
                  end_time,
                }
              );
              formRef.onChangeValues(end_time, 'end_time');
              onChange(start_time);
            },
            value: value ? dayjs(value, 'HH:mm') : undefined,
          }),
        },
        end_time: {
          isRequired: false,
          inputProps: (formRef, config, { onChange, value }) => ({
            placeholder: 'End Time',
            format: 'h:mm A',
            showNow: false,
            onChange: (_dayjs, date) => {
              onChange(_dayjs ? _dayjs.format('HH:mm') : '');
            },
            value: value ? dayjs(value, 'HH:mm') : undefined,
          }),
        },
        no_of_students: {
          default: 1,
          isRequired: false,
          allowValidNumber: true,
          inputProps: (formRef, config, { onChange, value }) => ({
            onChange: (e) => {
              const _value = e.target.value;
              if (_value !== '' && !Number.isNaN(+_value)) onChange(+_value);
              else onChange(_value);
            },
            value: value,
            placeholder: 'Number Of Students',
            type: 'text',
          }),
        },
      }),
    }),
  });

const demo_schedules = {
  ...schedules(true),
};

export const FORM_CONFIG = {
  title,
  youtube_link,
  summary,
  core_id,
  attachment,
  recommended_per_week,
  specialisation_id,
  style,
  description,
  level,
  duration,
  level_up,
  term,
  minimum_age,
  maximum_age,
  languages,
  start_date,
  end_date,
  benefits,
  prerequisites,
  schedules: schedules(false),
  demo_schedules,
};

export const useFormHook = (initialState) =>
  useForm({
    FORM_CONFIG,
    initialState,
    renderForm: true,
  });
