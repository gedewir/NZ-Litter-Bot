const express = require('express');
const app = express();
const axios = require('axios');
const Twit = require('twit');
require('dotenv').config();

app.listen(3000);

const getSurvey = 'https://api.litterintelligence.com/api/GetSurveys'
const getSurveyID = 'https://api.litterintelligence.com/api/GetSurvey'

const twitter = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_KEY_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60*1000,
    strictSSL: true
})

axios.get(getSurvey)
    .then(result=>{
        var surveyDate = new Date(result.data.surveys[0].date).toLocaleDateString();
        const surveyID = result.data.surveys[0].id;
        console.log(surveyDate);
        // var formattedDate = surveyDate.toLocaleDateString()
        // console.log(formattedDate)
        const currentDate = new Date().toLocaleDateString();
        console.log(currentDate);
        if(currentDate==surveyDate){
            const requestSurvey = getSurveyID + `?id=${surveyID}`;
            axios.get(requestSurvey)
                .then(result=>{
                    var groupName = result.data.monitoringGroup;
                    var area = result.data.area.name;
                    var text = 'Thank you ' + groupName + ' for doing a litter survey at ' + area;
                    twitter.post('statuses/update', {status: text}, (error,data, response)=>{
                        console.log(data)
                    });
                })
        }
    });