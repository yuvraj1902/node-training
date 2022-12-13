const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const {validateRequest} = require('../helper/commonFunctions.helper')

const complexityOptions = {
    min: 4,
    max: 16,
    // lowerCase: 1,
    // upperCase: 1,
    // numeric: 1,
    // symbol: 1,
};

module.exports = {

    loginSchema: async (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().email().lowercase().required(),
            password:passwordComplexity(complexityOptions).required()
        });
        validateRequest(req, res, next, schema, 'body');
    },

    createUserSchema: async (req, res, next) => {
        const schema = Joi.object({
            first_name: Joi.string().min(1).required(),
            last_name: Joi.string().min(1).required(),
            email: Joi.string().email().lowercase().required(),
            password: passwordComplexity(complexityOptions).required(),
            organization: Joi.string().min(1).required(),
            google_id: Joi.string().min(1).required(),
            source: Joi.string().min(1).required(),
            role_key: Joi.string().min(1).required(),
            designation_code: Joi.number().min(1).required(),
        });
        validateRequest(req, res, next, schema, 'body');
    },

    registrationSchema: async (req, res, next) => {
        const schema = Joi.object({
            first_name: Joi.string().min(1).required(),
            last_name: Joi.string().min(1).required(),
            email: Joi.string().email().lowercase().required(),
            password: passwordComplexity(complexityOptions).required(),
            organization: Joi.string().min(1).required(),
            google_id: Joi.string().min(1).required(),
            source: Joi.string().min(1).required()
        });
        validateRequest(req, res, next, schema, 'body');
    },

    refreshTokenSchema: async (req, res, next) => {
        const schema = Joi.object({
            refreshToken: Joi.string().min(3).max(200).required()
        });
        validateRequest(req, res, next, schema, 'body');
    },

    resetPasswordSchema: async (req, res, next) => {
        const schema = Joi.object({
            password: passwordComplexity(complexityOptions).required(),
        })
        validateRequest(req, res, next, schema, 'body');
    },

    resetPasswordSchemaToken:  async (req, res, next) => {
        const schema = Joi.object({
            token: Joi.string().alphanum().min(5).required()
        })
        validateRequest(req, res, next, schema, 'params');
    },

    adminResetPasswordSchema: async (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().email().lowercase().required(),
            password: passwordComplexity(complexityOptions).required(),
        });
        validateRequest(req, res, next, schema, 'body');
    },

    forgetPassword: async (req, res, next) => {
       const schema = Joi.object({
            email: Joi.string().email().lowercase().required(),
        });
        validateRequest(req, res, next, schema, 'body');
    },

    enableUserSchema: async (req, res, next) => {
        const schema = Joi.object({
            userId: Joi.string().guid().required()
        });
        validateRequest(req, res, next, schema, 'body');   
    },

    deactivateUserSchema: async (req, res, next) => {
        const schema = Joi.object({
            userId: Joi.string().guid().required()
        });
        validateRequest(req, res, next, schema, 'body');
    },

    userDetailsSchema: async (req, res, next) => {
        const schema = Joi.object({
            userId: Joi.string().guid().required()
        });
        validateRequest(req, res, next, schema, 'params');
    },
};
