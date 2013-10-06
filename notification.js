var client = require('twilio')('ACa8710937acf29f2aa389d73d9a06d7a8', '422155d2f060a2b5c01329b1877e0743');


exports.notify = function(number,box){
	console.log("sending...");
client.sendSms({
    to:"+"+number, 
    from: '+15146131070', // A number you bought from Twilio and can use for outbound communication
    body: 'Hi, someone have just uploaded a file in your SherBox, You can see your box at: http://SherBox.ca/'+box 

}, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) {
        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."

    }
});




};
