const express=require('express')
const app=express();
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Blood_Inventory', (err, database) => {
    if(err) return console.log(err)
    db =database.db('Blood_Inventory')
    app.listen(3333, ()=>{
        console.log('Server is listening at port number 3333...')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('Public'))

app.get('/',(req,res)=>{
    db.collection('bloodbank').find().toArray((err,result)=>{
         if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})
app.get('/create',(req,res)=>
{
    res.render('add.ejs')
})
app.get('/update',(req,res)=>{
    res.render('update.ejs')
})
app.get('/delete',(req,res)=>{
    res.render('delete.ejs')
})

app.post('/AddData',(req,res)=>{
    db.collection('bloodbank').save(req.body,(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})

app.post('/updateitem',(req,res)=>{

    db.collection('bloodbank').find().toArray((err,result)=>{
        if(err) 
            return console.log(err)
        for(var i=0;i<result.length;i++)
        {
            if(result[i].id==req.body.id)
            {
                s=result[i].quantity
                break
            }
        }
        db.collection('bloodbank').findOneAndUpdate({id: req.body.id},{
            $set:{quantity:parseInt(s)+parseInt(req.body.quantity)}},{sort:{_id:-1}},
            
            
            (err,result)=> {
                        if(err)
                             return res.send(err)
                        console.log(req.body.id+' quantity updated')
                        res.redirect('/')
                })
        })
    })

app.post('/deleteitem',(req,res)=>{
        db.collection('bloodbank').findOneAndDelete({id:req.body.id}, (err,result)=>{
            if(err) return console.log(err)
            res.redirect('/')
        })

    })





