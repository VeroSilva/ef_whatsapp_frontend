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

export function CampaingMessagesChart({ data }: { data: Array<any> }) {

    const options = {
        indexAxis: 'x' as const,
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
                text: 'Mensajes Recibidos por Campañas',
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
                borderColor: 'rgb(162, 4, 45)',
                backgroundColor: 'rgba(162, 4, 45, 0.75)',
            },
        ],
    };

    return <Bar options={options} data={formattedData} />;
}
