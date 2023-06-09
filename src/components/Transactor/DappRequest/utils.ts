interface IRequestEndPayload {
  target: string;
  redirectURL: string;
}

const handleRequestEnd = (payload: IRequestEndPayload) => {
  setTimeout(() => {
    if (payload.target === '_self' && !!payload.redirectURL) {
      window.open(payload.redirectURL, '_self');
    } else if (payload.target === '_blank') {
      // close browser
      window.close();
    }
  }, 500);
};

export { handleRequestEnd };
