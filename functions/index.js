const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const jQuery = require("jquery");
const express = require('express');
const bodyParser = require("body-parser");

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

app.post('/value_activity_game', (request, response) => {
    var oCareerValues = initializeCareerValue();
    var oPayload = request.body;
    var oMemory = oPayload.conversation && oPayload.conversation.memory;

    var oResponsePayload = {
        "replies" : [],
        "conversation" : {}
    };
    var aReplies = getButtonList(oCareerValues);
    oResponsePayload.replies = aReplies;
    oResponsePayload.conversation = oPayload.conversation;
    response.send(oResponsePayload);
});

app.post('/save_daily_check_in', (request, response) => {
    var oPayload = request.body;
    var uid = oPayload.conversation.id;
    var sGreatString = oPayload.nlp.source;
    setUserRef(uid);
    var oDataPayload = {
        "feeling_great" : sGreatString
    };
    userRef.child('daily_check_in').set(oDataPayload).then(() => {
        var oResponsePayload = {
            "replies" : [],
            "conversation" : {}
        };
        oResponsePayload.conversation = oPayload.conversation;
        if(oResponsePayload.conversation && oResponsePayload.conversation.memory){
            oResponsePayload.conversation.memory.feeling_great = {
                "raw": sGreatString
            }
        }
        response.send(oResponsePayload);
    }, () => {

    });
});

app.post('/get_daily_check_in', (request, response) => {
    var oPayload = request.body;
    var uid = oPayload.conversation && oPayload.conversation.id;
    setUserRef(uid);
    userRef.child('daily_check_in').child('feeling_great').once('value').then(snapshot => {
        var sGreatString = snapshot.val();
        var oResponsePayload = {
            "replies" : [],
            "conversation" : {}
        };
        oResponsePayload.conversation = oPayload.conversation;
        if(oResponsePayload.conversation && oResponsePayload.conversation.memory){
            oResponsePayload.conversation.memory.feeling_great = {
                "raw": sGreatString
            }
        }
        response.send(oResponsePayload);
    }, () => {

    });
});

app.post('/save_explicit_career_values', (request, response) => {
    var oPayload = request.body;
    var uid = oPayload.conversation.id;
    var sExplicitCareerValues = oPayload.nlp.source;
    setUserRef(uid);
    userRef.child('career_value').child('explicit_career_values').set(sExplicitCareerValues).then(() => {
        var oResponsePayload = {
            "replies" : [],
            "conversation" : {}
        };
        oResponsePayload.conversation = oPayload.conversation;
        if(oResponsePayload.conversation && oResponsePayload.conversation.memory){
            oResponsePayload.conversation.memory.explicit_career_values = {
                "raw": sExplicitCareerValues
            }
        }
        response.send(oResponsePayload);
    }, () => {

    });
});

app.post('/get_explicit_career_values', (request, response) => {
    var oPayload = request.body;
    var uid = oPayload.conversation && oPayload.conversation.id;
    setUserRef(uid);
    userRef.child('career_value').child('explicit_career_values').once('value').then(snapshot => {
        var sExplicitCareerValues = snapshot.val();
        var oResponsePayload = {
            "replies" : [],
            "conversation" : {}
        };
        oResponsePayload.conversation = oPayload.conversation;
        if(oResponsePayload.conversation && oResponsePayload.conversation.memory){
            oResponsePayload.conversation.memory.explicit_career_values = {
                "raw": sExplicitCareerValues
            }
        }
        response.send(oResponsePayload);
    }, () => {

    });
});

app.post('/save_value_activity', (request, response) => {
    var oPayload = request.body;
    var oMemory = oPayload.conversation && oPayload.conversation.memory;
    var uid = oPayload.conversation && oPayload.conversation.id;
    setUserRef(uid);
    var oDataPayload = {
        "value1" : {
            "value" : oMemory.value1.raw,
            "priority" : oMemory.value_prio1.raw
        },
        "value2" : {
            "value" : oMemory.value2.raw,
            "priority" : oMemory.value_prio2.raw
        },
        "value3" : {
            "value" : oMemory.value3.raw,
            "priority" : oMemory.value_prio3.raw
        },
        "value4" : {
            "value" : oMemory.value4.raw,
            "priority" : oMemory.value_prio4.raw
        },
        "value5" : {
            "value" : oMemory.value5.raw,
            "priority" : oMemory.value_prio5.raw
        } 
    }
    userRef.child('career_value').child('career_value_game').set(oDataPayload).then(() => {
        var oResponsePayload = {
            "replies" : [],
            "conversation" : {}
        };
        oResponsePayload.conversation = oPayload.conversation;
        response.send(oResponsePayload);
    }, () => {

    });
});

app.post('/get_value_activity', (request, response) => {
    var oPayload = request.body;
    var uid = oPayload.conversation && oPayload.conversation.id;
    setUserRef(uid);
    userRef.child('career_value').child('career_value_game').once('value').then(snapshot => {
        var oResponsePayload = {
            "replies" : [],
            "conversation" : {}
        };
        var oDataPayload = snapshot.val();
        oResponsePayload.conversation = oPayload.conversation;
        if(oResponsePayload.conversation && oResponsePayload.conversation.memory){
            oResponsePayload.conversation.memory.value1 = {
                "raw": oDataPayload.value1.value
            }
            oResponsePayload.conversation.memory.value2 = {
                "raw": oDataPayload.value2.value
            }
            oResponsePayload.conversation.memory.value3 = {
                "raw": oDataPayload.value3.value
            }
            oResponsePayload.conversation.memory.value4 = {
                "raw": oDataPayload.value4.value
            }
            oResponsePayload.conversation.memory.value5 = {
                "raw": oDataPayload.value5.value
            }
            oResponsePayload.conversation.memory.value_prio1 = {
                "raw": oDataPayload.value1.priority
            }
            oResponsePayload.conversation.memory.value_prio2 = {
                "raw": oDataPayload.value2.priority
            }
            oResponsePayload.conversation.memory.value_prio3 = {
                "raw": oDataPayload.value3.priority
            }
            oResponsePayload.conversation.memory.value_prio4 = {
                "raw": oDataPayload.value4.priority
            }
            oResponsePayload.conversation.memory.value_prio5 = {
                "raw": oDataPayload.value5.priority
            }
        }
        response.send(oResponsePayload);
    }, () => {

    });
});

var userRef = null;
setUserRef = (uid) => {
    userRef = firebaseApp.database().ref(uid);
};

getButtonList = function(oCareerValues){
    var aButtons = [];
    for(var index in oCareerValues){
        if(oCareerValues[index].value == "0"){
            var oButton =   {
                "type": "buttons",
                "content": {
                  "title": "",
                  "buttons": []
                }
            }
            oButton.content.title = oCareerValues[index].longText;
            var oVeryImportantButton = {
                "title": "Very Important",
                "type": "postback",
                "value": ""
            }
            var oSomewhatImportantButton = {
                "title": "Somewhat Important",
                "type": "postback",
                "value": ""
            };
            oVeryImportantButton.value = `You Selected ${oCareerValues[index].shortText} as Very important`;
            oSomewhatImportantButton.value = `You Selected ${oCareerValues[index].shortText} as Somewhat important`;
            oButton.content.buttons.push(oVeryImportantButton);
            oButton.content.buttons.push(oSomewhatImportantButton);
            aButtons.push(oButton);
        }
    }
    return aButtons;
}

initializeCareerValue = function () {
    return {
        "Builder": {
            "shortText": "Builder",
            "longText": "Create things",
            "value": "1"
        },
        "Problem_Solving": {
            "shortText": "Problem Solving",
            "longText": "Problem-solving",
            "value": "1"
        },
        "Work_Life_Balance": {
            "shortText": "Work Life Balance",
            "longText": "Opportunity for work/life balance",
            "value": "1"
        },
        "Flexible": {
            "shortText": "Flexible",
            "longText": "Flexibility in work structure",
            "value": "1"
        },
        "Intellectual": {
            "shortText": "Intellectual",
            "longText": "Opportunity to become “expert” in a given field",
            "value": "0"
        },
        "Order": {
            "shortText": "Order",
            "longText": "Order and structure",
            "value": "0"
        },
        "Competition": {
            "shortText": "Competition",
            "longText": "High degree of competition",
            "value": "0"
        },
        "Integrity": {
            "shortText": "Integrity",
            "longText": "Integrity and truth",
            "value": "0"
        },
        "Loyal": {
            "shortText": "Loyal",
            "longText": "Rewarding loyalty and dependability",
            "value": "0"
        },
        "Respect": {
            "shortText": "Respect",
            "longText": "Having self-respect and pride in work",
            "value": "0"
        },
        "Security": {
            "shortText": "Security",
            "longText": "Stability and security",
            "value": "0"
        },
        "Financial": {
            "shortText": "Financial",
            "longText": "Strong financial rewards",
            "value": "0"
        },
        "Recognition": {
            "shortText": "Recognition",
            "longText": "Be recognized for quality of work in a visible way",
            "value": "0"
        },
        "Social_Responsibility": {
            "shortText": "Social Responsibility",
            "longText": "Have a positive impact on others & society",
            "value": "0"
        },
        "Creative": {
            "shortText": "Creative",
            "longText": "Being innovative",
            "value": "0"
        },
        "Change": {
            "shortText": "Change",
            "longText": "Variety and a changing work pace",
            "value": "0"
        },
        "Cooperative": {
            "shortText": "Cooperative",
            "longText": "Teamwork and work groups",
            "value": "0"
        },
        "Predictable_work": {
            "shortText": "Predictable work",
            "longText": "Routine predictable work projects",
            "value": "0"
        },
        "Pressure": {
            "shortText": "Pressure",
            "longText": "Time demand challenges",
            "value": "0"
        },
        "Opportunity": {
            "shortText": "Opportunity",
            "longText": "Opportunities for advancement",
            "value": "0"
        },
        "Customer_Contact": {
            "shortText": "Customer Contact",
            "longText": "Frequent customer contact",
            "value": "0"
        },
        "Innovation": {
            "shortText": "Innovation",
            "longText": "Using cutting edge technologies",
            "value": "0"
        },
        "Leadership": {
            "shortText": "Leadership",
            "longText": "Opportunities for supervision or leadership",
            "value": "0"
        },
        "Authority": {
            "shortText": "Authority",
            "longText": "Having power to make decisions",
            "value": "0"
        },
    };
}

exports.leave_request = functions.https.onRequest((request, response) => {
    var oPayload = request.body;
    var oMemory = oPayload.conversation && oPayload.conversation.memory;

    var oResponsePayload = {
        "replies" : [],
        "conversation" : {}
    };
    oResponsePayload.replies.push({
        "type": "text",
        "content": "Your leave request is created.",
      });
    oResponsePayload.conversation = oPayload.conversation;
    response.send(oResponsePayload);
});
exports.app = functions.https.onRequest(app);
