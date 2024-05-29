import { Client, fql, FaunaError } from "fauna";

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_TOKEN,
});

try {
  const query = fql`
    Product.sortedByPriceLowToHigh() {
      name,
      description,
      price
    }`;

    debugger
  const response = await client.query(query);
  console.log(response.data);
} catch (error) {
  if (error instanceof FaunaError) {
    console.log(error);
  }
} finally {
  client.close();
}
