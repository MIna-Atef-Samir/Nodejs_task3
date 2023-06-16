import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    let cur = req.url.split("=").at(-1);
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);

    (async () => {
      try {
        const dataResponse = await fetch(
          "https://api.escuelajs.co/api/v1/products?limit=1"
        );
        const changeResponse = await fetch(
          "https://api.exchangerate.host/latest?base=USD"
        );

        const parsedData = await dataResponse.json();
        const changeCur = await changeResponse.json();
        const CategoriesMap = new Map();
        const keys = Object.keys(changeCur.rates);

        let product;

        parsedData.forEach((obj) => {
          const categoryId = obj.category.id;
          keys.forEach((k) => {
            if (k === cur) {
              product = {
                id: obj.id,
                title: obj.title,
                price: `${(obj.price * changeCur.rates[k]).toFixed(2)} ${k}`,
                description: obj.description,
                category: {
                  id: obj.category.id,
                  name: obj.category.name,
                  image: obj.category.image,
                },
              };
            }
          });

          if (product) {
            if (CategoriesMap.has(categoryId)) {
              const category = CategoriesMap.get(categoryId);
              category.products.push(product);
            } else {
              const category = {
                category: {
                  id: categoryId,
                  name: obj.category.name,
                  image: obj.category.image,
                  creationAt: obj.category.creationAt,
                  updatedAt: obj.category.updatedAt,
                },
                products: [product],
              };
              CategoriesMap.set(categoryId, category);
            }
          }
        });

        const Categories = Array.from(CategoriesMap.values());
        console.log(Categories[0]); // change the number or remove it to see the whole array!
        res.write(JSON.stringify(Categories));
        res.end();
      } catch (error) {
        console.error("Error occurred:", error);
      }
    })();
  }
});

server.listen(8080, () => {
  console.log("SERVER is running on http://localhost:8080");
});
