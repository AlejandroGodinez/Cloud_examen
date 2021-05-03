const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

exports.handler = async (event) => {
    let analyzeText = event.historial_clinico;
    
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: process.env.apikey,
        }),
        serviceUrl: process.env.url,
    });
    
    //se quiere analizar un string en base a sus keywords y entidades
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
    
    let res = await naturalLanguageUnderstanding.analyze(analyzeParams);

    // //obtener las palabras clave
    let keywords = []
    let keywordJson = {};
    res.result.keywords.forEach(element => {
      //se ingresa la palabra clave al arreglo
      keywords.push(element.text);

      let emotionInt = 0;
      let emotion;

      //obtener la llave que tenga la emocion mas representativa
      for (const key in element.emotion) {
        if(element.emotion[key] > emotionInt){
          emotion = key
          emotionInt = element.emotion[key]
        } 
      }
    
      keywordJson[element.text] = {
        "sentimiento": element.sentiment.label,
        "relevancia": element.relevance,
        "repeticiones": element.count,
        emotion
      }
      

    });

    // //obtener las entidades
    let entities = []
    let entitiesJson = {}
    res.result.entities.forEach(element => {
      //se ingresa al arreglo de entidades
      entities.push(element.text);

      let emotionInt = 0;
      let emotion;

      //obtener la llave que tenga la emocion mas representativa
      for (const key in element.emotion) {
        if(element.emotion[key] > emotionInt){
          emotion = key
          emotionInt = element.emotion[key]
        } 
      }

      entitiesJson[element.text] = {
        "tipo": element.type,
        "sentimiento": element.sentiment.label,
        "relevancia": element.confidence,
        "emocion": emotion,
        "repeticiones": element.count,
        "porcentaje_confianza": element.confidence
      }
    })

    // json a retornar
    let json_return = {
      "lenguaje_texto": res.result.language,
      "palabras_clave": keywords,
      "entidades": entities,
      "palabras_clave_desc": keywordJson,
      "entidades_desc": entitiesJson
    }

    return json_return;
};
