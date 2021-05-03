const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

exports.handler = async (event) => {
    let analyzeText = event.historial_clinico;
    
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: process.env.apikey,
        }),
        serviceUrl: process.env.url,
    });
    
    const analyzeParams = {
      'text': analyzeText,
      'features': {
        'keywords': {
          'sentiment': true,
          'emotion': true,
          'limit': 5
        },
        'entities': {
          'sentiment': true,
          'emotion': true,
          'limit': 5
        }
      }
    };
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
    })
    .catch(err => {
        console.log('error:', err);
    });
    return analyzeParams;
};
