// lambdaHandler.js
const { runPosterBot } = require("./scripts/posterService");

exports.handler = async (event, context) => {
  try {
    console.log("🔔 Lambda invoked");
    await runPosterBot();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "✅ Posters generated and emails sent." }),
    };
  } catch (error) {
    console.error("❌ Lambda execution error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "❌ Poster generation failed", error: error.message }),
    };
  }
};
