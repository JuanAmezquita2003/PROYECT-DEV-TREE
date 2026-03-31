import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from 'slug'
import User from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt'


export const createAccount = async (req: Request, res: Response) => {

    const { email, password } = req.body

    const userExist = await User.findOne({ email })
    if (userExist) {

        const error = new Error('El correo ya esta enlazado a otra cuenta')
        return res.status(409).send({ error: error.message })
    }

    const handle = slug(req.body.handle, '')

    const handleExist = await User.findOne({ handle })
    if (handleExist) {

        const error = new Error('Nombre de usuario no disponible')
        return res.status(409).send({ error: error.message })
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle

    await user.save()

    res.status(201).send('Registro creado correctamente')
}


export const login = async (req: Request, res: Response) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() })

    }

    const { email, password } = req.body

    //COMPROBAR SI EL USUARIO ESTÁ REGISTRADO
    const user = await User.findOne({ email })
    if (!user) {

        const error = new Error('El usuario no existe')
        return res.status(404).send({ error: error.message })
    }

    //COMPROBAR LA CONTRASEÑA
    const isPasswordCorrect = await checkPassword(password, user.password)

    if (!isPasswordCorrect) {

        const error = new Error('Contraseña incorrecta')
        return res.status(401).send({ error: error.message })
    }

    const token = generateJWT({ id: user._id })

    res.send(token)
}

export const getUser = async (req: Request, res: Response) => {
    
}