import { removeEmptyAndKey } from 'shared/utils/utilFunctions';
const removeIdArray = [
  'artist_id',
  'course_id',
  // 'course_schedule_id',
  // 'course_schedule_day_id',
  'artist_details',
  'is_demo',
  // 'no_of_students_joined',
];
export const convertPayloadToFormDataFormat = (data) =>
  removeEmptyAndKey(
    {
      ...data,
      languages: data.languages.map((e) => e.language),
      style: data.style.map((e) => e.title),
      demo_schedules: data.demo_schedules,
      schedules: data.schedules,
    },
    removeIdArray
  );

export const removeUnwantedPayloadData = (data) => removeEmptyAndKey(data, removeIdArray);
