import { newFormArray } from "@cartoonmangodev/react-form-handler/utils";
import { useForm } from "utils/FormValidation";

const skill_levels = {
  isRequired: true,
};

export const FORM_CONFIG = {
  skill_levels,
};

export const useFormHook = (initialState) =>
  useForm({
    FORM_CONFIG,
    initialState,
  });
