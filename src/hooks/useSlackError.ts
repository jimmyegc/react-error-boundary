
const useSlackError = () => {
  const sendErrorToSlack = async (error:any, additionalInfo = "") => {
    try {      
      const response = await fetch('https://nodejs-postgresql-api-render.onrender.com/report-error', {
      //const response = await fetch('http://localhost:3000/report-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error, additionalInfo }),
      });
  
      if (!response.ok) {
        console.error('Error al reportar al servidor:', response.statusText);
      } else {
        console.log('Error reportado con éxito.');
      }
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
    }
  };

  return { sendErrorToSlack };
};

export default useSlackError;
