import axios from "axios";

const useSlackError = () => {
  const sendErrorToSlack = async (error, additionalInfo = "") => {
    try {
      const response = await axios.post("http://localhost:5000/send-error-to-slack", {
        error,
        additionalInfo,
      });
      console.log("Error enviado a Slack:", response.data.message);
    } catch (err) {
      console.error("Error al enviar el error al servidor:", err.message);
    }
  };

  return { sendErrorToSlack };
};

export default useSlackError;
