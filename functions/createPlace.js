const { Client, fql } = require("fauna");

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const data = JSON.parse(event.body);

  try {
    const result = await client.query(fql`Place.create(${{ ...data }})`);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
