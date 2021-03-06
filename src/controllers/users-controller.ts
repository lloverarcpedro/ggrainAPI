/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import bcrypt from 'bcrypt'
import Users from '..//models/mongo/users-model'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { getUsers, createUser } from '../services/user-services'


const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await Users.findOne({ email })
        if (user) {
            const equalP = await bcrypt.compare(password, user.password)
            console.log(equalP)
            if (equalP) {
                const token = jwt.sign(
                    { userId: user._id, role: user.role },
                    process.env.JWT_SECRET!,
                    { expiresIn: 600 } //time in seconds
                )
                res.send({ status: 'OK', data: { token, expiresIn: '10 mins' } })
            } else {
                res.status(403).send({
                    status: 'Error',
                    message: 'Wrong Email or Password',
                })
                return
            }
        } else {
            res.status(403).send({
                status: 'Error',
                message: 'Wrong Email or Password',
            })
            return
        }
    } catch (error) {
        res.status(500).send({
            status: 'Error',
            message: error.message,
        })
        return
    }
}

const createUSer = async (req: Request, res: Response) => {
    try {
        const { username, email, password, data, role } = req.body

        const hash = await bcrypt.hash(password, 15)

        await Users.create({
            username,
            email,
            data,
            password: hash,
            role,
        })
        res.send({
            status: 'OK',
            message: 'User Created',
        })
    } catch (error) {
        console.log(error.code)
        if (error.code && error.code == 11000) {
            res.status(400).send({
                status: 'Duplicate Values',
                message: error.keyValue,
            })
            return
        }
        res.status(500).send({
            status: 'Error',
            message: 'An Error Ocurred, try againg later',
        })
    }
}

const deleteUSer = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body
        if (!userId) {
            throw new Error('missing parameter userId')
        }
        const deletedUser = await Users.findByIdAndDelete(userId)

        res.send({
            status: 'OK',
            data: {
                userDeleted: deletedUser!.username            
            },
        })
    } catch (error) {
        res.status(500).send({
            status: 'Error',
            message: `Error deleting user : ${error.message}`,
        })
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const role = req.sessionData.role
        console.log(`User request role ${role}`)
        let users
        if (role != 'admin') users = await Users.find({ role: 'seller' })
        else users = await Users.find().select({ password: 0, __v: 0, role: 0 })

        res.send({ status: 'OK', data: users })
    } catch (error) {
        res.status(500).send({ status: 'Error', message: error.message })
    }
}

const getTodosUsers = async (req: Request, res: Response) => {
    try {
        // Validate request parameters, queries using express-validator
        const query: string = req.body.username ?? ''
        const users = await getUsers(query)
        res.send({ status: 'OK', data: users })
    } catch (error) {
        res.status(500).send({ status: 'Error', message: error.message })
    }
}

const createTodoUser = async (req: Request, res: Response) => {
    try {
        const userToCreate = req.body
        const userCreated = await createUser(userToCreate)
        if(!userCreated){
            throw new Error('create user error')
        }
        res.send({ status: 'OK', data: userCreated })
    } catch (error) {
        res.status(500).send({ status: 'Error', message: error.message })
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const { username, email, data, userId } = req.body
        const updatedUSer = await Users.findByIdAndUpdate(userId, {
            username,
            email,
            data,
        })
        res.send({
            status: 'OK',
            data: `User updated : ${updatedUSer!.username}`,
        })
    } catch (error) {
        if (error.code && error.code == 11000) {
            res.status(400).send({
                status: 'Duplicate Values',
                message: error.keyValue,
            })
            return
        }
        res.status(500).send({
            status: 'Error',
            message: `Error updating user : ${error.message}`,
        })
    }
}



export default {
    createUSer,
    deleteUSer,
    updateUser,
    getAllUsers,
    getTodosUsers,
    createTodoUser,
    login
}

