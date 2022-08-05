// Creating Token and saving in cookie
const sendToken = (user, statusCode, message, res) => {
  const jwtToken = user.getJWTToKen();

  //   Options for cookie

  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };

  res.cookie("token", jwtToken, options);

  res
    .status(statusCode)
    .json({ success: true, message: message, user, jwtToken });
};

module.exports = sendToken;
