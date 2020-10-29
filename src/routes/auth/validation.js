import * as yup from 'yup';

export const registerValidation = yup.object().shape({
    email: yup.string().email().required().max(255),
    username: yup.string().required().min(6).max(100),
    password: yup.string().required().min(6).max(100)
});

export const loginValidation = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
});