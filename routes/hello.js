let express = require("express");
let router = express.Router();
let sqlite3 = require("sqlite3");

const db = new sqlite3.Database("mydb.sqlite3");

router.get('/',(req, res, next)=>{
    db.serialize(()=>{
        let rows=""
        db.each("select * from mydata",(err,row)=>{
            if (!err){
                rows+="<tr><th>"+row.id+"</th><td>"+row.name+"</td></tr><br>"
            }
        },(err,count)=>{
            res.render("hello/index",{
                title:"こんにちわ",
                content:rows,
            })
        })
    })

    /*
    let msg = "何か書いて"
    if (req.session.message!==undefined){
        msg = "Last Message:"+req.session.message;
    }
    res.render("hello",{
        title:"こんにちは",
        content:msg,
    })
    */
})

router.post('/post',(req, res, next)=>{
    let msg = req.body["message"];
    req.session.message = msg;
    res.render("hello",{
        title:"こんにちは",
        content:"Last Message:"+msg,
    })
})

const { check, validationResult } = require("express-validator");
router.get("/add",(req,res,next)=>{
    res.render("hello/add",{
        title:"Hello/add",
        content:[],
        form:{namae:"",meru:"",toshi:""},
    })
})
router.post("/add",[
    check("namae","NAMEは必ず入力してください。").notEmpty().escape(),
    check("meru","MAILはメールアドレスを入力してください。").isEmail().escape(),
    check("toshi","AGEは年齢(整数)を入力してください。").isInt(),
    check("toshi","AGEはゼロ以上一万以下で入力してください。").custom((value)=>{
        return value>=0 && value<=10000;
    })
],(req,res,next)=>{
    const errors = validationResult(req);
    const name = req.body.namae;
    const mail = req.body.meru;
    const age = req.body.toshi;

    if (!errors.isEmpty()){
        let result = "<ul>"
        let result_array = errors.array();
        for (let i of result_array){
            result+="<li>"+i.msg+"</li>"
        }
        result+="</ul>"
        
        res.render("hello/add",{
            title:"Hello/add",
            content:result,
            form:req.body,
        })
    }
    else{
        db.serialize(()=>{
            db.run("insert into mydata (name,mail,age) values(?,?,?)",name,mail,age);
        })
        res.redirect("/hello");
    }
})

router.get("/show",(req,res,next)=>{
    db.get("select * from mydata where id=?",[req.query.id],(err,row)=>{
        if (!err){
            res.render("../views/hello/show",{
                title:"Hello/show",
                content:"id:"+req.query.id+"のレコード",
                mydata:row,
            })
        }
    })
})

router.get("/edit",(req,res,next)=>{
    if (!req.query.id){
        db.serialize(()=>{
            db.get("select * from mydata where id=?",[req.query.id],(err,row)=>{
                if (!err){
                    res.render("hello/edit",{
                        title:"Hello/edit",
                        mydata:row,
                   /*     id:row.id,
                        name:row.name,
                        mail:row.mail,
                        age:row.age, */
                    })
                }
            })
        })
    }
   else{
       res.redirect("/");
   }
})
router.post("/edit",(req,res,next)=>{
    if (req.body.edit1==="ee"){
    db.serialize(()=>{
        const id = req.body.id
        const name = req.body.namae;
        const mail = req.body.meru;
        const age = req.body.toshi;
        db.run("update mydata set name=?, mail=?, age=? where id=?",name,mail,age,id)
    })
    res.redirect("/hello");
    }
    else{
        db.serialize(()=>{
            db.get("select * from mydata where id=?",[req.body.id],(err,row)=>{
                if (!err){
                    console.log(err)
                    console.log(row)
                    res.render("hello/edit",{
                        title:"Hello/edit",
                        mydata:row,
                   /*     id:row.id,
                        name:row.name,
                        mail:row.mail,
                        age:row.age, */
                    })
                }
            })
        })
    }
})

router.get("/delete",(req,res,next)=>{
    if (!req.query.id){
        db.serialize(()=>{
            db.get("select * from mydata where id=?",[req.query.id],(err,row)=>{
                if (!err){
                    res.render("hello/delete",{
                        title:"Hello/delete",
                        mydata:row,
                   /*     id:row.id,
                        name:row.name,
                        mail:row.mail,
                        age:row.age, */
                    })
                }
            })
        })
    }
    else{
        res.redirect("/");
    }
})
router.post("/delete",(req,res,next)=>{
    if (req.body.delete1==="ee"){
        db.serialize(()=>{
            db.run("delete from mydata where id=?",req.body.id)
        })
        res.redirect("/hello");
    }
    else{
        db.serialize(()=>{
            db.get("select * from mydata where id=?",[req.body.id],(err,row)=>{
                if (!err){
                    res.render("hello/delete",{
                        title:"Hello/delete",
                        mydata:row,
                   /*     id:row.id,
                        name:row.name,
                        mail:row.mail,
                        age:row.age, */
                    })
                }
            })
        })
    }
})

router.get("/find",(req,res,next)=>{
    db.serialize(()=>{
        db.all("select * from mydata",(err,rows)=>{
            if (!err){
                res.render("hello/find",{
                    title:"Hello/find",
                    condition:"",
                    mydata:rows,
                })
            }
        })
    })
})
router.post("/find",(req,res,next)=>{
    db.serialize(()=>{
        db.all("select * from mydata where "+req.body.jouken,(err,rows)=>{
            if (!err){
                res.render("hello/find",{
                    title:"Hello/find",
                    condition:req.body.jouken,
                    mydata:rows,
                })
            }
        })
    })
})

module.exports = router;