import http from "http";
import * as yup from "yup";

const schema = yup.object({
  title: yup.string('Title is required and should be a string'),
  price: yup.number('Price is required and should be a number'),
  description: yup.string('Description is required and should be a string'),
  categoryId: yup.number('Category ID is required and should be a number'),
  images: yup.string('Images is required and should be an array of strings')
});
const body ={
    "title": "5555",
    "price": 10,
    "description": "A description",
    "categoryId": 1,
    "images": ["https://placeimg.com/640/480/any"]
  }
  const response ={
    "title": "New Product",
    "price": 10,
    "description": "A description",
    "images": ["https://placeimg.com/640/480/any"],
    "category": {
      "id": 1,
      "name": "Clothes",
      "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=4278",
      "creationAt": "2023-01-03T15:58:58.000Z",
      "updatedAt": "2023-01-03T15:58:58.000Z"
    },
    "id": 210,
    "creationAt": "2023-01-03T16:51:33.000Z",
    "updatedAt": "2023-01-03T16:51:33.000Z"
  }
const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    
    const validationResult = schema.validateSync(body,{strict: true} );

    if (validationResult) {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(201);
      res.end(JSON.stringify(response));
    }
  } else {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
