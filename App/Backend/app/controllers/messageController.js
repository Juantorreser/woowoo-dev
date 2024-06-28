const db = require('../models');
const Message = db.message;
const axios = require('axios');
const User = db.user;
//find all message belong to a specific user.
exports.findAllMessage = async (req, res)=> {

    console.log("findAllMessage started");
    const id = req.params.uid;
    if(!id){
        await res.status(400).send({
            message: "user id can not be empty for the messageController.js"
        })
    }
    const messageInfo = [];     //in this format: [{from: '', context: ''}, {from: '', context: ''}]
    await Message.findAll({
        where: {to_user: id}
    })
    .then(data=> {
        //console.log(data[0]);   //data will return an array of objects.
        data.map(mes=> {
            console.log("mes of data is: "+ mes);
            // axios.get('http://localhost:8080/users/'+ mes.from_user)
            // .then(result=> {
            //     console.log(result.data);
            //     messageInfo.push({mid: mes.mid, from: `${result.data.firstName} ${result.lastName}`, context: mes.context});
            //     console.log("MessageInfo is: "+ messageInfo.length);
            // })
        })
        
        //messageInfo.context = data.context;
        //res.send(messageInfo);
        res.send(data);
    })
    .catch(err=> {
        console.log(err);
        res.status(500).send(err);
    })
}


//sending a new message with no reply.
exports.sendMessage = async (req,res)=> {   
    //const id = req.body.to_user;
    var id = '';
    const names = req.body.to_user.split(" ");   //split into array containing first and last name
    console.log(names);
    await User.findAll({
        where: {firstName: names[0], lastName: names[1]}
    })
    .then(data=> {
        console.log(data);
        id = data[0].uid;
    })

    const message = {
        from_user: req.body.from_user,
        to_user: id,
        context: req.body.context, 
        reply: "",
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    Message.create(message)
    .then(data=> {
        res.status(201).send(data);
    })
    .catch(err=> {
        console.log("Something wrong happen when creating the new message")
        res.send("Something wrong happen when creating new message" + err);
    })
}

//reply to a specify message
exports.replyToMessage = async (req,res)=> {
    console.log("replyToMessage");
    var idExist = false;
    const id = req.params.mid;
    if(id == null){
        res.send("Sorry but message ID can not be null");
    }
    
    await Message.findAll({
        where: {mid: id}
    })
    .then(data=> {
        idExist = true;
    })
    .catch(err=> {
        idExist = false;
        console.log(err);
    })

    if(idExist == false){
        res.send("Can not find this message ID")
    }
    else{
        console.log("message's ID existed");

        const message = {
            from_user: req.body.from_user,
            to_user: req.body.to_user,
            context: req.body.context, 
            reply: req.body.reply,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        Message.update(message, {
            where: {mid: id}
        })
        .then(num=> {
            if(num == 1){
                res.send("Reply successfully sent");
            }
            else{
                res.send("Something wrong with replying to this message")
            }
        })
        .catch(err=> {
            console.log("Something wrong happen when creating the new message")
            res.send("Something wrong happen when creating new message" + err);
        })
    }
    
}