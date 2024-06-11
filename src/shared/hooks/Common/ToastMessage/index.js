import { message } from "antd";

const useAntdMessage = () => {
  const infoMessage = (content) => {
    message.destroy(); // Clear existing messages
    message.info(content);
  };

  const successMessage = (content) => {
    message.destroy();
    message.success(content);
  };

  const errorMessage = (content) => {
    message.destroy();
    message.error(content);
  };

  const warningMessage = (content) => {
    message.destroy();
    message.warning(content);
  };

  return {
    infoMessage,
    successMessage,
    errorMessage,
    warningMessage,
  };
};

export default useAntdMessage;
