const axios = require('axios');
const {Response} = require('../libs');
const {HttpStatusCode} = require('../utils');
const Axios = axios.create();
const IsRecaptchaVerified = async (req, res, next) => {
  try {
    const {token} = req.body;
    const secrete_key = process.env.RECAPTCHA_SECRET_KEY;

    const {statusText} = await Axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secrete_key}&response=${token}`
    );
    if (statusText !== 'OK') {
      Response.setError(
        HttpStatusCode.STATUS_FORBIDDEN,
        'Error verifying recaptcha.'
      );
      return Response.send(res);
    }

    next();
  } catch (error) {
    Response.setError(
      HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
      'Server error. Please retry.'
    );
    return Response.send(res);
  }
};

module.exports = {
  IsRecaptchaVerified
};
