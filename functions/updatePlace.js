const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({
  secret: import.meta.env.FAUNADB_SECRET
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { id, ...updateData } = JSON.parse(event.body);

  try {
    const result = await client.query(
      q.Update(
        q.Ref(q.Collection('Place'), id),
        { data: updateData }
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }
};