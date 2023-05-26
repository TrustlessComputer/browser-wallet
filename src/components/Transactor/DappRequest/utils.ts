interface IRequestEndPayload {
  target: string;
  redirectURL: string;
}

const handleRequestEnd = (payload: IRequestEndPayload) => {
  console.log('SANG TEST: ', payload);
  setTimeout(() => {
    if (payload.target === '_self' && !!payload.redirectURL) {
      window.open(payload.redirectURL, '_self');
    } else if (payload.target === '_blank') {
      // close browser
      window.close();
    }
  }, 1500);
};

export { handleRequestEnd };
