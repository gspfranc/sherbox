var client = require('twilio')('', '');

exports.notify = function(number,box){
	if (!(number.charAt(0) == '1')){
	number = "1"+number;
	}
				
	//take out dash and space
	number.replace("-",""); number.replace(" ","");
client.sendSms({
    to:"+"+number, 
    from: '+15146131070', 
    body: 'Hi, someone have just uploaded a file in your SherBox, You can see your box at: http://SherBox.ca/'+box 

}, function(err, responseData) { 

    if (!err) {
		console.log("Message sent successfully");
		console.log("TO: "+responseData.to);
        console.log("FROM: "+responseData.from);
        console.log(responseData.body);
    }
  });

};
