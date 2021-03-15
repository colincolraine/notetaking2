const router = require('express').Router()
const NoteModel = require('./model')
const passport = require('../auth')

//get all
router.get('/', 
(req, res, next)=>{
    NoteModel.find()
    .then((results)=>{
        if(!results){
            res
                .status(404)
                .send('No notes found')
        }else{
            res.json(results)
        }
    })
    .catch((err)=>{
        console.log(err)
        res
        .status(500)
        .send('Error 7 happened')
    })
})
//get single
router.get('/:id', (req, res, next)=>{
    NoteModel.findById(req.params.id)
    .then((results)=>{
        if(!results){
            res
                .status(404)
                .send('No note found')
        }else{
            res.json(results)
        }
    })
    .catch((err)=>{
        console.log(err)
        res
        .status(500)
        .send('Error 8 happened')
    })
})

//Create
router.post('/',
passport.authenticate('bearer', { session: false }),
inputValidation,
(req, res, next)=>{
    console.log(req.user)
    const newNote = new NoteModel({
        title: req.body.title,
        body: req.body.body,
        authorId: req.user._id
    })

    newNote
        .save()
        .then((document)=>{
            if(document){
                res.json(document)
            }else{
                res.send('document did not save')
            }
        })
        .catch((err)=>{
            console.log(err)
            res.send('Error 9 happened')
        })
})

//Update
router.put('/:id',
passport.authenticate('bearer', { session: false }),
updateInputValidation,
findNote,
isAuthor,
(req, res, next)=>{
    NoteModel.findOneAndUpdate({ _id: req.params.id},req.updateObj,{
        new:true
    })
    .then((results)=>{
        if(!results){
            res
                .status(404)
                .send('No note found')
        }else{
            res.json(results)
        }
    })
    .catch((err)=>{
        console.log(err)
        res
        .status(500)
        .send('Error 10 happened')
    })
})

//Delete
router.delete('/:id',
passport.authenticate('bearer', { session: false }),
findNote,
isAuthor,
(req, res, next)=>{
    NoteModel.findOneAndRemove({ _id: req.params.id})
    .then((results)=>{
        if(!results){
            res
                .status(404)
                .send('No note found')
        }else{
            res.send('Successfully deleted')
        }
    })
    .catch((err)=>{
        console.log(err)
        res
        .status(500)
        .send('Error 11 happened')
    })
})

function inputValidation(req, res, next){
    const{title,body} = req.body
    const missingFields = []

    if(!title){
        missingFields.push('title')
    }
    if(!body){
        missingFields.push('body')
    }
    if(missingFields.length){
        res
            .status(400)
            .send(`The following fields are missing: ${missingFields.join(' ')}`)
    }else{
        next()
    }
}

function updateInputValidation (req, res, next){
    const {title,body} = req.body
    const updateObj = {}

    if(title){
        updateObj.title = title
    }
    if(body){
        updateObj.body = body
    }
    req.updateObj = updateObj

    next()
}

function findNote(req, res, next) {
    NoteModel.findById(req.params.id)
        .then((noteDocument)=>{
            if(!noteDocument){
                res.status(404).send('No note found')
            }else{
                req.noteDocument = noteDocument
                next()
            }
        })
        .catch((err)=>{
            console.log(err)
            res
                .status(500)
                .send('Error 12 happened')
        })
}
 function isAuthor(req, res,next){
     if(req.user._id.equals(req.noteDocument.authorId)){
         next()
     }else{
         res
            .status(401)
            .send('You are not authorised to take this action')
     }
 }      

module.exports = router