const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Transaction = require('./models/Transaction');
const mongoose = require('mongoose');
const app = express();

dotenv.config();

const mongoURI = process.env.MONGO_URL;
const PORT = process.env.PORT || 4000;

mongoose.set('strictQuery', false);
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json('test ok')
}) 


app.post('/api/transaction', async (req, res) => {
    try {
        const { name, price, description, datetime } = req.body;

        if (!name || !price || !description || !datetime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const transaction = await Transaction.create({
            name,
            price,
            description,
            datetime
        })

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Could not create transaction' });
    }
})

app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Could not fetch transactions' });
    }
})

app.delete('/api/transaction/:id', async (req, res) => {
    try {
      const transactionId = req.params.id;
      const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
      if (!deletedTransaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json(deletedTransaction);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: 'Could not delete transaction' });
    }
  })

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
