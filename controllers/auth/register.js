const { User } = require("../../models");
const { ctrlWrapper, HttpError } = require("../../helpers");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../../helpers");
const gravatar = require("gravatar");

const { BASE_URL } = process.env;


const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(400, {
      status: "error",
      code: 400,
      message: "Email already exist",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationCode,
     avatarURL,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a targer="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click for verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      email: newUser.email,
      name: newUser.name,
    },
  });
};

module.exports = { register: ctrlWrapper(register) };
