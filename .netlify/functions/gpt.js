
const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  const frage = body.frage || "";
  const entscheidung = body.entscheidung || "";
  const werte = body.werte || "";

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du bist eine ethisch reflektierte Entscheidungs-KI. Antworte kurz, sachlich und mit nachvollziehbaren Empfehlungen."
        },
        {
          role: "user",
          content: `Hier ist eine Entscheidungssituation:
Frage: ${frage}
Entscheidung: ${entscheidung}
Werte: ${werte}
Bitte gib eine kurze Bewertung und Empfehlung.`
        }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ antwort: completion.data.choices[0].message.content })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
