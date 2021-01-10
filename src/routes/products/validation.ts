import * as yup from 'yup';

const productValidation = yup.object().shape({
  name: yup.string().required().max(255),
  description: yup.string().required().max(140),
  price: yup.number().required(),
  stock: yup.number().required().min(0),
  image: yup.string().required(),
});

export default productValidation;
