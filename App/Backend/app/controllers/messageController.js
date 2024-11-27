const db = require('../models');
const Message = db.message;
const axios = require('axios');
const User = db.user;

const argon2 = require('argon2');

const {initializeApp} = require('firebase/app');
const {getFirestore, doc, setDoc, getDoc, getDocs, query, where, collection} = require('firebase/firestore');
const firebaseConfig = require('../config/firebase.config.js');

const app = initializeApp(firebaseConfig);

//initialize the cloud firestore and get a reference to the service
const firebaseDb = getFirestore(app);


//find all message belong to a specific user.
exports.findAllMessage = async (req, res)=> {
    var messageArray = [];
    console.log("findAllMessage started");
   
    const id = req.params.uid;
    if(!id){
        await res.status(400).send({
            message: "user id can not be empty for the messageController.js"
        })
    }
    const messageInfo = []; //in this format: [{from: '', context: ''}, {from: '', context: ''}]

    //finding the query of the healer in firebase
    const q = query(collection(firebaseDb, "messages"), where("to_user", "==", req.params.uid))
    const firebaseDocs = await getDocs(q);
    firebaseDocs.forEach((doc)=> {
        console.log(doc.id+ ": "+doc.data());
        messageArray.push(doc.data());
    })
    
    try{
        messageArray.forEach(message=> {
            console.log(message);
        })
        res.send(messageArray);
    }
    catch(err){
        res.status(500).send(err);
    }
}


//sending a new message with no reply.
exports.sendMessage = async (req,res)=> {   
    console.log("sendMessage");
    var messageCounter = 0;
    //const id = req.body.to_user;
    var id = '';
    console.log(req.body);
    if(req.body.values.to_user == null){
        res.send("Sorry. The name for the recipient can not be empty to send a message");
    }
    else{   
        const names = req.body.values.to_user.split(" ");   //split into array containing first and last name
        try{
            console.log("Names: " + names);
            await User.findAll({
                where: {firstName: names[0], lastName: names[1]}
            })
            .then(data=> {
                console.log(data);
                id = data[0].uid;
            })

            const message = {
                from_user: req.body.values.from_user,
                to_user: id,
                context: req.body.values.message, 
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

            //find the counter of the message
            const docRef = doc(firebaseDb, "messages", "counter");
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
            console.log("Document data:", docSnap.data().counter);
            console.log(typeof(docSnap.data().counter));
            messageCounter = docSnap.data().counter;
            messageCounter ++;
            } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            }

            await setDoc(doc(firebaseDb, "messages", "counter"), {
                counter: messageCounter
            })

            //get the counter document from the firebase/firestore

            
            await setDoc(doc(firebaseDb, "messages", "message_"+ messageCounter),{
                context: message.context,
                from_user: message.from_user.toString(),
                to_user: message.to_user.toString(),
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
                reply: message. reply, 
                mid: messageCounter
            })
        }
        catch{
            throw Error;
        }
    }

   
    
}

//reply to a specify message
exports.replyToMessage = async (req,res)=> {
    console.log("replyToMessage");
    // var idExist = false;
    const id = req.params.mid;
    console.log(req.params.mid);
    console.log(req.body.values);
    // if(id == null){
    //     res.send("Sorry but message ID can not be null");
    // }
    
    // await Message.findAll({
    //     where: {mid: id}
    // })
    // .then(data=> {
    //     idExist = true;
    // })
    // .catch(err=> {
    //     idExist = false;
    //     console.log(err);
    // })

    // if(idExist == false){
    //     res.send("Can not find this message ID")
    // }
    if(req.body.values.reply == null || req.body.values.reply == "" ){
        res.send("Message can not be null");
    }
    // else{
        
    // }
        const message = {
            mid: req.body.values.mid,
            from_user: req.body.values.from_user.toString(),
            to_user: req.body.values.to_user.toString(),
            context: req.body.values.context, 
            reply: req.body.values.reply,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        Message.update(req.body.values, {
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
            console.log("Something wrong happen when updating the new message")
            res.send("Something wrong happen when creating new message" + err);
        })

        //update the reply in firebase. NOt sure yet.
        await setDoc(doc(firebaseDb, "messages", "message_"+ id),{
            context: message.context,
            from_user: message.from_user,
            to_user: message.to_user,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            reply: message. reply, 
            updatedAt: Date.now()
        })
}

const hashingFunction = async (password)=> {
    try{
      const hashedMessage = await argon2.hash(password);
      console.log(`Hashed message: ${hashedMessage}`)
      return hashedPassword;
    }
    catch(err){
      console.log(err);
    }
  }