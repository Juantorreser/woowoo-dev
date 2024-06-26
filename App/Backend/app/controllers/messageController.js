const db = require('../models');
const Message = db.message;
const axios = require('axios');

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