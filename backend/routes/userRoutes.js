import express from "express"
import { Addproperty, deleteproperty, getsingleproperty, listallproperty, updateproperty } from "../controller/usercontroller.js";
import upload from "../middleware/upload.js";
const propertyRoutes=express.Router();

propertyRoutes.post('/create-property',upload.array('images', 5),Addproperty)
propertyRoutes.get('/listall-properties',listallproperty)
propertyRoutes.get('/getuserbyid/:id',getsingleproperty)
propertyRoutes.delete('/Delteproperty/:id',deleteproperty)
propertyRoutes.put('/updateproperty/:id',updateproperty)
export default propertyRoutes;