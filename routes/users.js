var express = require('express');
const db = require('../models/index');
var router = express.Router();
const {Op, where} = require("sequelize");
const { body } = require('express-validator');


/* GET users listing. */
router.get('/', function(req, res, next) {
  db.User.findAll(/*{where:{[Op.or]:[{name:{[Op.like]:"%"+req.query.id+"%"}},{age:{[Op.ne]:req.query.age}}]}}*/).then((rows)=>{
    res.render("users/index",{
      title:"Hello/Index",
      content:rows,
    })
  })
});

router.get("/add",(req,res,next)=>{
  res.render("users/add",{
    title:"Users/add",
    form:new db.User(),
    err:null,
  })
})
router.post("/add",(req,res,next)=>{
  db.sequelize.sync().then(()=>{
    db.User.create({
      name:req.body.name,
      pass:req.body.pass,
      mail:req.body.mail,
      age:req.body.age,
    })
    .then((usr)=>{
      res.redirect("/users");
    })
    .catch((err)=>{
      res.render("users/add",{
        title:"Users/add",
        form:req.body,
        err:err,
      })
    })
  })
})

router.get("/edit",(req,res,next)=>{
  db.User.findByPk(req.query.id).then((usr)=>{
    res.render("users/edit",{
      title:"Users/edit",
      mydata:usr,
      id:req.query.id,
    })
  })
})
router.post("/edit",(req,res,next)=>{
/*  db.sequelize.sync().then(()=>{
    db.User.update({
      name:req.body.name,
      pass:req.body.pass,
      mail:req.body.mail,
      age:req.body.age,
    },{where:{id:req.body.id}}).then((usr)=>{
      res.redirect("/users");
    })
  })*/
  db.User.findByPk(req.body.id).then((usr)=>{
    usr.name = req.body.name,
    usr.pass = req.body.pass,
    usr.mail = req.body.mail,
    usr.age = req.body.age,
    usr.save().then(()=>{
      res.redirect("/users");
    })
  })
})

router.get("/delete",(req,res,next)=>{
  db.User.findByPk(req.query.id).then((usr)=>{
    res.render("users/delete",{
      title:"users/delete",
      mydata:usr,
      id:req.query.id,
    })
  })
})
router.post("/delete",(req,res,next)=>{
  db.sequelize.sync().then(()=>{
    db.User.destroy({where:{id:req.body.id}}).then(()=>{
      res.redirect("/users");
    })
  })
/*  db.User.findByPk(req.body.id).then((usr)=>{
    usr.destroy().then(()=>{
      res.redirect("/users");
    })
  })*/
})

module.exports = router;
