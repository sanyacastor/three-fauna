const { Client, fql } = require("fauna");

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
});

const placesQuery = fql`Place.all()`;

exports.handler = async (event, context) => {
  try {
    const queryResult = await client.query(placesQuery);
    const documents = queryResult.data.data;

    return {
      statusCode: 200,
      body: JSON.stringify(documents),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
