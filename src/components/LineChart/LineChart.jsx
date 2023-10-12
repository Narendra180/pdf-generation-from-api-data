import React, { forwardRef } from 'react';
import './LineChart.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.register({
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || 'white';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
})

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    }
  },
  scales: {
    x: {
      border: {
        color: "#bdbdbd"
      },
      ticks: {
        // display: false
        padding: 10
      },
      offset: true,
      grid: {
        display: false,
        drawTicks: false,
        color: "#c2c2c2"
      }
    },
    y: {
      border: {
        color: "#bdbdbd"
      },
      ticks: {
        // display: false
        padding: 10
      },
      offset: true,
      grid: {
        drawTicks: false,
        color: "#c2c2c2"
        // display: false,
      }
    }
  }

};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      borderColor: '#1463FF',
      backgroundColor: '#1463FF',
    }
  ],
};

const LineChart = forwardRef(({ labels, datasets }, ref) => {

  const data = {
    labels,
    datasets
  }

  console.log(data)


  return (
    <div className="chart-container">
      <Line options={options} data={data} ref={ref} />
    </div>
  )
})

export default LineChart;