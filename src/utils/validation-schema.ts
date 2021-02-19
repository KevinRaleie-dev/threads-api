import * as yup from 'yup';

export const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    username: yup.string().min(2).required(),
    password: yup.string().min(6).max(100).required(),
});
