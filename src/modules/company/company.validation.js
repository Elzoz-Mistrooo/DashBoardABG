import joi from 'joi';

export const create = {
  body: joi
    .object({
      name: joi
        .string()
        .min(3)
        .max(50)
        .required()
        .messages({
          'string.base': 'Name must be a string',
          'string.empty': 'Name is required',
          'string.min': 'Name must be at least 3 characters',
          'any.required': 'Name is required',
        }),
      link: joi
        .string()
        .uri()
        .required()
        .messages({
          'string.base': 'Link must be a string',
          'string.empty': 'Link is required',
          'string.uri': 'Link must be a valid URL',
          'any.required': 'Link is required',
        }),
        photo: joi.any().optional(),
        logo: joi.any().optional(),
      apilink: joi
        .string()
        .uri()
        .required()
        .messages({
          'string.base': 'API Link must be a string',
          'string.empty': 'API Link is required',
          'string.uri': 'API Link must be a valid URL',
          'any.required': 'API Link is required',
        }),
    })
    .required(),
};
