import useErrorHandler from "../../hooks/useErrorHandler";
//import useSlackError from "../../hooks/useSlackError";

export const MyComponent = () => {
  const { createError, throwError } = useErrorHandler();
  //(const { sendErrorToSlack } = useSlackError();

  const handleClick = () => {
    const error = createError(
      'Failed to load user data',
      'UserProfile',
      { userId: 123 },
      'USER_LOAD_ERROR'
    );
    throwError(error);
    //sendErrorToSlack(error, "Detalles adicionales sobre el contexto");
  };

  const handleError = () => {
    throwError(new Error('This is a test error'));
  };

  return (
    <div>
      <h1>Mi Componente</h1>
      <button onClick={handleClick}>Lanzar Error</button>
      <button onClick={handleError}>Launch Error</button>
    </div>
  );
}