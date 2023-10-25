const { User } = require("../../models");

const { ctrlWrapper, HttpError } = require("../../helpers");

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;

  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw HttpError(404, {
      status: "error",
      code: 404,
      message: "User not found",
    });
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      message: "Verification successful",
    },
  });
};

module.exports = { verifyEmail: ctrlWrapper(verifyEmail) };
