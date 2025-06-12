export const apiResponse = (
    data: any,
    status = 200,
    success = true,
    message = 'OK'
  ) => {
    return Response.json({ success, message, data }, { status });
  };