//validation of login //
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(5).trim().max(100).email().required(),
    password: Joi.string().min(6).required(),
    nationalid : Joi.string().required(),
  });

  return schema.validate(data);
};
