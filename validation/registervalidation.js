//validation of register //
const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(1).max(50).required(),
    lastName: Joi.string().trim().min(1).max(50).required(),
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    nationalId: Joi.string().required()
  });

  return schema.validate(data);
};