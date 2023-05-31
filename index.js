const express = require("express");
const uuid = require("uuid");
const app = express();
const port = 3001;
app.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
  const { id } = request.params;

  const index = orders.findIndex( order => order.id === id );

  if (index < 0) {
    return response.status(404).json({ error: "order not found" });
  }

  request.orderIndex = index;
  request.orderId = id;

  next();
};

const checkUrl = (request, response, next) =>{

  const method = request.method
  const url = request.url

  console.log(`Method used: ${method}, and Url used: ${url}`)

  next()
}



app.get("/user-orders", checkUrl, (request, response) => {
  return response.json(orders);
});

app.post("/user-orders", checkUrl, (request, response) => {
  const { order, clientName, price} = request.body;

  const orderWithId = { id: uuid.v4(), order, clientName, price, status:"Em preparação"};

  orders.push(orderWithId);
  return response.status(201).json(orderWithId);
});

app.put('/user-orders/:id', checkOrderId, checkUrl, (request, response) => {
  const { order, clientName, price} = request.body;
  const index = request.orderIndex;
  const id = request.orderId;
  const uptadedOrder = { id, order, clientName, price, status: "em preparação" };

  orders[index] = uptadedOrder

  return response.json(uptadedOrder);
});


app.delete('/user-orders/:id', checkOrderId, checkUrl, (request, response) => {
  const index = request.orderIndex;
  orders.splice(index, 1);

  return response.status(204).json();
})

app.listen(port, () => {
  console.log('server is working')
});


