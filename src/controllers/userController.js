import { render } from 'ejs';
import userSercive from '../services/userSercive'

let handleLogin = async(req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs'
        })
    }

    let userData = await userSercive.handleUserLogin(
        email,password
        )


    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user : userData ? userData.user : {}
    })
}


let handleGetAllUsers = async (req, res) => {
    let id = req.query.id // All, id

    if(!id){
        return res.status(200).json({
            errCode: 0,
            errMessage: 'Missing parameters',
            users
        })
    }
    let users = await userSercive.getAllUsers(id)
    console.log(users)

    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}



let handleCreateNewUser = async (req, res) => {
    let message = await userSercive.createNewUser(req.body);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing parameters'
        })
    }
    let message = await userSercive.deleteUser(req.body.id);
    return res.status(200).json(message);
}


let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userSercive.updateUserData(data);
    return res.status(200).json(message);
}

let getAllCode = async (req, res) => {
    try{
        let data = await userSercive.getAllCodeService(req.query.type)
        return res.status(200).json(data)
    } catch(e) {
        console.log('Get all code error', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleDeleteUser: handleDeleteUser,
    handleEditUser: handleEditUser,
    getAllCode: getAllCode,
}