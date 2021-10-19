import db from '../models/index';
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try{
            let hashPassword = await bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        }catch(err){
            reject(err);
        }
    })
}

let handleUserLogin =  (email, password) => {
    return new Promise(async(resolve, reject) => {
        try{
            let userData = {}

            let isExist = await checkUserEmail(email)

            if(isExist) {
                //Compare password
                let user = await db.User.findOne({
                    where: { email: email},
                    raw: true,
                });
                if(user) {
                    let check = await bcrypt.compareSync(password, user.password);

                    if(check){
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = user;
                        resolve(userData)
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Error";
                        resolve(userData)
                    }

                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's not found"
                    resolve(userData)
                }
            } else {
                // return error
                userData.errCode = 1;
                userData.errMessage = "Your's Email isnot in your system"
                resolve(userData)
            }
        } catch(e){
            reject(e);
        }
    })
}


let checkUserEmail = (email) => {
    return new Promise(async(resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: {email: email},
            })
            if(user){
                resolve(true)
            } else {
                resolve(false)
            }

        } catch(err){
            reject(err);
        }
    })
}


let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try{
            let users = ''
            if(userId === 'All'){
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password',],
                    }
                })
            } 
            if(userId && userId !== 'All') {
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password'],
                    }
                })
            }
            resolve(users)
        }catch(err) {
            reject(err);
        }
    })
}

let createNewUser = (data) => {
    return new Promise( async(resolve, reject) => {
        try{
            let check = await checkUserEmail(data.email);
            if(check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is already is used"
                })
            } else{
                let hashPasswordFromBcryt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcryt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address : data.address,
                    phoneNumber : data.phoneNumber,
                    gender: data.gender === '1' ? true: false,
                    roleId: data.roleId,
                })
                
                resolve({
                    errCode: 0,
                    message: "OK"
            })
            }

            
        } catch(err) {
            reject(err)
        }
    })
}


let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: {id: userId}
        })
        if(!foundUser){
            resolve({
                errCode: 2,
                errMessage: "The user isn's exist"
            })
        }

        await db.User.destroy({
            where: { id : userId },
        })

        resolve({
            errCode: 0,
            errMessage: "The user is deleted"
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try{
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing require parameters"
                })
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })

            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address  = data.address;

                await user.save();

                resolve({
                    errCode: 0,
                    errMessage: "Update the user success"
                })

            } else{
                resolve({
                    errCode: 1,
                    errMessage: "User's not found!"
                })
            }
        } catch (err){
            reject(err)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise( async(resolve, reject) =>{
        try{
            if(!typeInput){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })

            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                where: { type: typeInput}
            });
            res.errCode = 0;
            res.data = allcode
            resolve(res)
            }
            
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
}