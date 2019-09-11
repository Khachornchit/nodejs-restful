const Joi = require('joi');
const express = require('express');
const app = express();
const port = process.env.port || 3001;

app.listen(port, () => {
    console.log(`Listening on ${port}`);
})

const customers = [
    { id: 1, name: 'Lisa' },
    { id: 2, name: 'Joe' },
    { id: 3, name: 'Brad' }
]

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world 123 !');
});

app.get('/api/customers', (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    res.json(customers);
})

app.get('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) res.status(404).json(`Find not found the id`);
    res.json(customer);
})

app.get('/api/posts/:years/:month', (req, res) => {
    res.send(req.params);
})

app.get('/api/posts', (req, res) => {
    res.send(req.query);
})

app.post('/api/customers', (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const customer = {
        id: customers.length + 1,
        name: req.body.name
    };

    customers.push(customer);
    res.json(customer);
})

app.put('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).json(`Find not found the id`);

    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    customer.name = req.body.name;
    res.json(customer);
})

app.delete('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).json(`Find not found the id`);

    const index = customers.indexOf(customer);
    customers.splice(index, 1);

    res.status(204).json();
})

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(customer, schema);
}