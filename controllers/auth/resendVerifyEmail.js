const { User } = require("../../models");

const { ctrlWrapper, HttpError } = require("../../helpers");

const { sendEmail } = require("../../helpers");

const { BASE_URL } = process.env;

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(400, {
      status: "error",
      code: 400,
      message: "Email not found",
    });
  }

  if (user.verify) {
    throw HttpError(400, {
      status: "error",
      code: 400,
      message: "Verification has already been passed",
    });
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a targer="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click for verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      message: "Verification email sent",
    },
  });
};

module.exports = { resendVerifyEmail: ctrlWrapper(resendVerifyEmail) };
