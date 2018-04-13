const driver = require('bigchaindb-driver')
const Request = require('request');
const Async = require('async')
const mongoose = require('mongoose');
const Trasaction = require('./models/transaction')
const DB_URL = 'mongodb://127.0.0.1/bigchain'
const log =  console.log

mongoose.connection.openUri(DB_URL);
mongoose.connection.on('connected',  ()=> {  
 console.log('success','Mongoose default connection open to ' + DB_URL);
}); 

 let bdb = new driver.Connection('https://test.bigchaindb.com/api/v1/', {
   app_id: '158096df',
   app_key: '22bd99ee2b2ac9dc1df35440e1a4c4ec'
})
function getTransection(tx,callback)
{
    Request({url: 'https://test.bigchaindb.com/api/v1/transactions/'+tx}, function (error, response, body) {
        // console.log("body:::::: ",body)
        return callback(body);
});
}
// getTransection(); 

function step(address)
{
    counter = 0;
getTransection('a89c0eaa7c2587a004733dbadcfb0e6485f89bcc41d105a78babcbb055e26938',function(data)
    {
         console.log("data in stepOne: ",data);
        data = JSON.parse(data)
        var transactionData = new Trasaction(data)
        transactionData.save((err,res)=>{
            if(err)
                log('error==>>',err)
            else
                log('ress===>>>>',res)
        })
        Async.forEachLimit(data.asset.data.step,1,function(phase,next)
        {
            if(phase.user.publicKey == address)
            console.log("you having the permission of: ",phase.user.permisssion)
        else
        {
            counter++;
            if(counter<data.asset.data.step.length)
                next();
            else
                console.log("sorry you are not in the cycle")
        }
        })
        // if(data.asset.data.step1.user.publicKey == 'AuSa7SWd9cLA6CjLnHMXY8da1xhBrEDayHGNy8rezGtu')
        //     console.log("you are elligible to READ this meta data",data.metadata);
        // else
        //     console.log("You are not a valid user")
    });
}
 step('Dh2Tfpyh9ZxVwdtPSb1wapGbkVwzyZq7bjDb7YHKNcyD')
// const alice = new driver.Ed25519Keypair()
//  console.log('alice:   ',alice)


//  var asset = {
//     'step': [{
//         'user':{
//             publicKey: 'AuSa7SWd9cLA6CjLnHMXY8da1xhBrEDayHGNy8rezGtu',
//             privateKey: '4LekhrsYoaWW7TP6kaqNbKzSPUR3pnKjjv4ZzGYykuKJ',
//             permisssion:'read'
//         }
//     },{
//          'user':{
//             publicKey: '5c166qF17XNtEWKTnYc4osq9NYvn3gWVzY24gcR9LpEM',
//               privateKey: '4npDNftWfCbZAj6dDHH5uZzPMMiS5iF4xuPBCaXb8rLu',
//             permisssion:'write'
//         }
//     },{
//          'user':{
//             publicKey: 'Dh2Tfpyh9ZxVwdtPSb1wapGbkVwzyZq7bjDb7YHKNcyD',
//             privateKey: 'DjaNxipCcNk2cyWr1Ev4FATJUKwHxsyoihaYuSLmxAUS',
//             permisssion:'update'
//         }
//     },{
//          'user':{
//             publicKey: 'D7bSmd9sVodHhgrvaTAduNFdjchg4acpCC2eZxzkJ4pQ',
//             privateKey: 'BBfP8fARueM5Xtvfqfndn8QSyv64gVLBgKMee7xVoM6Y',
//             permisssion:'aprrove'
//         }
//     }],
//     datetime: new Date().toString()
//  }
//  var metadata = {
//     'phase1':'admin steps'
//  }
// // Construct a transaction payload
// const tx = driver.Transaction.makeCreateTransaction(
//     // Define the asset to store, in this example it is the current temperature
//     // (in Celsius) for the city of Berlin.
//     asset,
 
//     // Metadata contains information about the transaction itself
//     // (can be `null` if not needed)
//     metadata,
//     // A transaction needs an output
//     [ driver.Transaction.makeOutput(
//             driver.Transaction.makeEd25519Condition(alice.publicKey))
//     ],
//     alice.publicKey
// )
//  // console.log("tx:  ",tx);
// // Sign the transaction with private keys
// const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
//  // console.log("txSigned:  ",txSigned);
// // Send the transaction off to BigchainDB
// // const conn = new driver.Connection(bdb)
 
// bdb.postTransaction(txSigned)
//     // .then(() => bdb.pollStatusAndFetchTransaction(txSigned.id))
//     .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
//     .catch((unsuccess)=>console.log("unsuccess:   ",unsuccess))