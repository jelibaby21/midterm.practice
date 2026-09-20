const express = require('express');
const router = express.Router();

// In-memory mock data
let orders = [
  { id: 1, customer: "Juan Dela Cruz", status: "pending", total: 500 },
  { id: 2, customer: "Maria Santos", status: "completed", total: 1200 }
];
let nextId = 3;

// GET /api/orders  (supports ?status=pending style filtering)
router.get('/', (req, res) => {
  let result = orders;
  const { status } = req.query;

  if (status) {
    result = result.filter(o => o.status === status);
  }

  res.status(200).json({
    success: true,
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
      count: result.length
    }
  });
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === Number(req.params.id));

  if (!order) {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Order not found."
      }
    });
  }

  res.status(200).json({
    success: true,
    data: order,
    meta: {
      timestamp: new Date().toISOString(),
      count: 1
    }
  });
});

// POST /api/orders
router.post('/', (req, res) => {
  const { customer, status, total } = req.body;
  const trimmedCustomer = customer?.trim();

  if (!trimmedCustomer || !status || total === undefined) {
    return res.status(400).json({
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: "customer, status, and total are required."
      }
    });
  }

  const newOrder = { id: nextId++, customer: trimmedCustomer, status, total };
  orders.push(newOrder);

  res.status(201).json({
    success: true,
    data: newOrder,
    meta: {
      timestamp: new Date().toISOString(),
      count: 1
    }
  });
});

// DELETE /api/orders/:id
router.delete('/:id', (req, res) => {
  const index = orders.findIndex(o => o.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Order not found."
      }
    });
  }

  orders.splice(index, 1);
  res.status(204).send();
});

module.exports = router;