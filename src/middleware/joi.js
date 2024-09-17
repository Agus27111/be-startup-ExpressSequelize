const Joi = require('joi');

const signinValidation = Joi.object({
        email: Joi.string().email().required().messages({
            'string.base': 'Email harus berupa string',
            'string.empty': 'Email tidak boleh kosong',
            'string.email': 'Email tidak valid',
            'any.required': 'Email harus diisi'
        }),
        password: Joi.string().min(3).max(15).required().messages({
            'string.base': 'Password harus berupa string',
            'string.empty': 'Password tidak boleh kosong',
            'string.min': 'Password minimal 3 karakter',
            'string.max': 'Password maksimal 15 karakter',
            'any.required': 'Password harus diisi'
        })
    });

const signupValidation =  Joi.object({
        email: Joi.string().trim().email().required().messages({
            'string.base': 'Email harus berupa string',
            'string.empty': 'Email tidak boleh kosong',
            'string.email': 'Email tidak valid',
            'any.required': 'Email harus diisi'
        }),
        name: Joi.string().trim().required().messages({
            'string.base': 'Nama harus berupa string',
            'string.empty': 'Nama tidak boleh kosong',
            'any.required': 'Nama harus diisi'
        }),
        password: Joi.string().min(3).max(15).required().messages({
            'string.base': 'Password harus berupa string',
            'string.empty': 'Password tidak boleh kosong',
            'string.min': 'Password minimal 3 karakter',
            'string.max': 'Password maksimal 15 karakter',
            'any.required': 'Password harus diisi'
        }),
        role: Joi.string().trim().valid('admin', 'kasir').required().messages({
            'any.only': 'Role harus admin atau kasir',
            'any.required': 'Role harus diisi'
        })
    });


module.exports = { signinValidation, signupValidation };


