const faunadb = require("fauna");
const q = faunadb.query;

const client = new faunadb.Client({
  secret: import.meta.env.VITE_FAUNADB_SECRET,
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
    const result = await client.query(
      q.Create(q.Collection("Place"), { data })
    );

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
