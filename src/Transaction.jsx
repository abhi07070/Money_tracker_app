import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const Transaction = () => {

    const [name, setName] = useState('');
    const [datetime, setDatetime] = useState('');
    const [description, setDescription] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('');


    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;

        axios.get(`${apiUrl}/transactions`)
            .then(response => {
                setTransactions(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    }, []);


    function addNewTransaction(ev) {
        ev.preventDefault();
        const apiUrl = process.env.REACT_APP_API_URL;

        const price = Number(name.split(' ')[0]); // convert price to number
        // create a new transaction object
        const newTransaction = {
            price: price,
            name: name.substring(price.toString().length + 1),
            datetime: datetime,
            description: description
        };

        // send the new transaction to the API
        axios.post(`${apiUrl}/transaction`, newTransaction)
            .then(response => {
                setTransactions([...transactions, response.data]);
                setName('');
                setDatetime('');
                setDescription('');
            })
            .catch(error => {
                console.error(error);
            });
    }

    function deleteTransaction(id) {
        const apiUrl = process.env.REACT_APP_API_URL;

        axios.delete(`${apiUrl}/transaction/${id}`)
            .then(response => {
                console.log(response);
                // update the transactions state to remove the deleted transaction
                setTransactions(transactions.filter(transaction => transaction._id !== id));
            })
            .catch(error => {
                console.error(error);
            });
    }

    function filterTransactions() {
        if (!filter) {
            return transactions;
        }

        const filteredTransactions = transactions.filter((transaction) => {
            const nameMatch = transaction.name.toLowerCase().includes(filter.toLowerCase());
            const amountMatch = transaction.price.toString().includes(filter);
            return nameMatch || amountMatch;
        });

        return filteredTransactions;
    }

    function formatDateTime(datetime) {
        const dateObj = new Date(datetime);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const timeOfDay = hours >= 12 ? "pm" : "am";
        const formattedTime = `${hours % 12}:${minutes.toString().padStart(2, '0')} ${timeOfDay}`;
        const formattedDate = `${year}-${month}-${day}`;
        return `${formattedDate} ${formattedTime}`;
    }

    let balance = 0;
    for (const transaction of transactions) {
        balance += Number(transaction.price);
    }
    balance = balance.toFixed(2);
    const fraction = balance.split('.')[1]
    balance = balance.split('.')[0]

    const filteredTransactions = filterTransactions();

    return (
        <>
            <main>
                <div className='filter'>
                    <h1>${balance}<span>{fraction}</span></h1>
                    <input
                        type='text'
                        value={filter}
                        onChange={ev => setFilter(ev.target.value)}
                        placeholder='Filter by name or amount...'
                    />
                </div>
                <form onSubmit={addNewTransaction}>
                    <div className='basic'>
                        <input
                            type='text'
                            value={name}
                            onChange={ev => setName(ev.target.value)}
                            placeholder={'+200 new samsung tv'}
                        />
                        <input
                            type='datetime-local'
                            value={datetime}
                            onChange={ev => setDatetime(ev.target.value)}
                        />
                    </div>
                    <div className='description'>
                        <input
                            type='text'
                            value={description}
                            onChange={ev => setDescription(ev.target.value)}
                            placeholder={'description'}
                        />
                    </div>
                    <button type='submit'>Add new transaction</button>
                </form>
                <div className='transactions'>
                    {filteredTransactions.length > 0 && filteredTransactions.map(transaction => (
                        <div className='transaction' key={transaction._id}>
                            <div className='left'>
                                <div className='name'>{transaction.name}</div>
                                <div className='description'>
                                    {transaction.description}
                                </div>
                            </div>
                            <div className='right'>
                                <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>{transaction.price}</div>
                                <div className='datetime'>{formatDateTime(transaction.datetime)}</div>
                                <button className='btn' onClick={() => deleteTransaction(transaction._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

        </>
    )
}

export default Transaction
