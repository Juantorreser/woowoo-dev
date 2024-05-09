//The schema here is defined to help control the signup and account pages
//for validation through yup and formik. 

import * as yup from 'yup';

export const userSchema = yup.object({
    // Schema determines what's allowed in the form and what's not.
    firstName: yup
        .string()
        .trim()
        .min(1, 'Your name must be at least 1 character!')
        .max(20, 'Your name cannot be more than 20 characters.')
        .matches(
            /^[a-zA-Z]+$/,
            'Invalid name. Use Upper or Lowercase letters only.'
        )
        .required('Your first name is required'),
    lastName: yup
        .string()
        .trim()
        .min(1, 'Your name must be at least 1 character!')
        .max(20, 'Your name cannot be more than 20 characters.')
        .matches(
            /^[a-zA-Z]+$/,
            'Invalid name. Use Upper or Lowercase letters only.'
        )
        .required('Your last name is required'),
    email: yup
        .string()
        .email()
        .required('Please enter an email address'),
    password: yup
        .string()
        .min(6, 'Your password must be at least 6 characters')
        .required('A password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    address: yup.string().notRequired(),
    city: yup.string().notRequired(),
	province: yup.string().notRequired(),
    country: yup.string().notRequired(),
    postalCode: yup.string().notRequired(),
	isHealer: yup.bool().required(),
	services: yup //not sure if this works yet
		.array()
		.when('isHealer', {
			is: (val) => val == true,
			then: yup.array().defined("You must select at least one service").required("test")
		}),
	//format: yup.
	description: yup
		.string()
		.when('isHealer', {
			is: (val) => val == true,
			then: yup.string().required('You must write a personal description')
		})
		.matches(
            /^[a-zA-Z.!'":;, @#$%^&*()-_=+`~{}\\|/]+$/
		),
	terms: yup.bool().oneOf([true],'You must agree to the terms and conditions').required()
});