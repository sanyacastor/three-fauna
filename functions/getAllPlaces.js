const faunadb = require("faunadb");
const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.VITE_FAUNADB_SECRET,
});

exports.handler = async (event, context) => {
  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("Places"))),
        q.Lambda((x) => q.Get(x))
      )
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
