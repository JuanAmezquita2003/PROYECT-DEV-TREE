import { Router } from 'express'
import {body} from 'express-validator'
import { createAccount, getUser, login } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'

const router = Router()

//AUTENTICACIÓN Y REGISTRO

router.post('/auth/register', 
    
    body('handle')
    .notEmpty()
    .withMessage('El handle no puede ir vacio'),
    body('name')
    .notEmpty()
    .withMessage('El nombre no puede ir vacio'),
    body('email')
    .isEmail()
    .withMessage('Email no valido'),
    body('password')
    .isLength({min: 8})
    .withMessage('La contraseña es muy corta minimo 8 caracteres'),
    handleInputErrors,
    createAccount
)
    
router.post('/auth/login',

    body('email')
        .isEmail()
        .withMessage('Email no valido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    login
)

router.get('/user', authenticate, getUser)

export default router