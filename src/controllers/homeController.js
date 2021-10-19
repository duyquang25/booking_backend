import db from '../models/index';
import CRUDService from '../services/crudService';

let getHomePage = async (req, res) => {
    

    try{
        let data = await db.User.findAll();

        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        })
    } catch (e){
        console.log(e);
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {

    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('post CRUD ')
}
let displayGetCRUD = async(req, res) => {
     let data = await CRUDService.getAllUser();

     console.log(data)
     return res.render('displayCRUD.ejs', {
         dataTable: data
     })
}

let getEidtCRUD = async (req, res) => {
     let userId = req.query.id;
     if(userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        


        return res.render('eidtCRUD.ejs',{
            user: userData,
        })
     } else {  
        return res.send('User Not Found')
     }
     
}

let putCRUD = async (req, res) => {
    let data  = req.body;
    let allUsers = await CRUDService.updateUserData(data);

    return res.render('displayCRUD.ejs', {
        dataTable: allUsers,
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;

    await CRUDService.deleteUserById(id);

    return res.send('delete success')
}

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEidtCRUD: getEidtCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}