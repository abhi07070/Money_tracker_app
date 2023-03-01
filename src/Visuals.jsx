import { useEffect, useState } from 'react';
import React from 'react'
import { Chart } from 'chart.js/auto';
const Visuals = () => {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // create chart after transactions have been fetched and updated
        const ctx = document.getElementById("chart").getContext("2d");
        const categories = {};
        transactions.forEach((transaction) => {
            if (categories[transaction.category]) {
                categories[transaction.category] += transaction.amount;
            } else {
                categories[transaction.category] = transaction.amount;
            }
        });
        const chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.keys(categories),
                datasets: [
                    {
                        label: "Total Amount Spent",
                        data: Object.values(categories),
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
            },
        });
        return () => {
            chart.destroy();
        };
    }, [transactions]);
    return (
        <div>
            <canvas id="chart" width="400" height="400"></canvas>
        </div>
    )
}

export default Visuals
