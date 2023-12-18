import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function ReceivedMessagesChart({ data }: { data: Array<any> }) {

    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Mensajes Totales Recibidos',
            },
        },
    };

    const labels = data.map((d) => d.alias);
    const formattedData = {
        labels,
        datasets: [
            {
                label: 'Cantidad',
                data: data.map((d) => d.total),
                borderColor: 'rgb(0, 46, 109)',
                backgroundColor: 'rgba(0, 46, 109, 0.75)',
            },
        ],
    };

    return <Bar options={options} data={formattedData} />;
}
