import { formatSingleDigitToDoubleDigit } from "utils";
import {
  ACHIEVEMENTS,
  EDUCATION,
  ENDORSEMENTS,
  EXPERIENCE,
} from "utils/constants";

export const convertFormDataToPayloadFormat = {
  [EXPERIENCE]: (values) => ({
    title: values.title,
    location: values.location || undefined, //optional: max: 255
    role: values.position || undefined, // optional
    from_date: values.start_from_month
      ? `${values.start_from_year}-${formatSingleDigitToDoubleDigit(
          +values.start_from_month + 1
        )}-01`
      : undefined, // optional : format [YYYY-MM-DD]
    to_date: values.end_in_month
      ? `${values.end_in_year}-${formatSingleDigitToDoubleDigit(
          +values.end_in_month + 1
        )}-01`
      : undefined, // optional : format [YYYY-MM-DD]
    additional_details: values.attachment || undefined,
  }),
  [EDUCATION]: (values) => ({
    title: values.title,
    institution: values.institution || undefined, // optional, max: 255
    date: values.date || undefined, // optional, format : [YYYY-MM-DD]
    attachment: values.attachment || undefined, // optional
  }),
  [ACHIEVEMENTS]: (values) => ({
    title: values.title,
    description: values.description || undefined, // optional
    date: values.date || undefined, // optional, format : [YYYY-MM-DD]
    attachment: values.attachment || undefined, // optional
  }),
  [ENDORSEMENTS]: (values) => ({
    title: values.title,
    description: values.description || undefined,
    attachment: values.attachment || undefined, // optional
  }),
};

export const convertPayloadToFormDataFormat = {
  [EXPERIENCE]: (values) => ({
    title: values.title || "",
    location: values.location || "",
    position: values.role || "",
    start_from_month: (values.from_date || "").split("-").length
      ? formatSingleDigitToDoubleDigit(
          +(values.from_date || "").split("-")[1] - 1
        )
      : "",
    start_from_year: (values.from_date || "").split("-").length
      ? (values.from_date || "").split("-")[0]
      : "",
    end_in_month: (values.to_date || "").split("-").length
      ? formatSingleDigitToDoubleDigit(
          +(values.to_date || "").split("-")[1] - 1
        )
      : "",
    end_in_year: (values.to_date || "").split("-").length
      ? (values.to_date || "").split("-")[0]
      : "",
    id: values.id,
    attachment: values.additional_details || "",
  }),
  [EDUCATION]: (values) => ({
    title: values.title,
    institution: values.institution || "",
    date: values.date || "",
    attachment: values.attachment || "",
    id: values.id,
  }),
  [ACHIEVEMENTS]: (values) => ({
    title: values.title,
    description: values.description || "",
    date: values.date || "",
    attachment: values.attachment || "",
    id: values.id,
  }),
  [ENDORSEMENTS]: (values) => ({
    title: values.title,
    description: values.description || "",
    attachment: values.attachment || "",
    id: values.id,
  }),
};
