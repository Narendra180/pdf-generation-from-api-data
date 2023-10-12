import "./HomePage.css";
import LineChart from "../../components/LineChart/LineChart";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPDF } from "../../utils/utils";

function HomePage() {
  const [apiData, setApidata] = useState(null);

  const chartRef = useRef(null);

  let labels = [];
  let datasets = [];

  const allYearsDataOfAllOffences = {};

  if(apiData) {
    const offencesNamesList = apiData["keys"];
    const offencesData = apiData["data"];
    offencesData.forEach(yearData => {
      labels.push(yearData["data_year"].toString());

      offencesNamesList.forEach((offence) => {
        if(!allYearsDataOfAllOffences[offence]) allYearsDataOfAllOffences[offence] = [];
        allYearsDataOfAllOffences[offence].push(yearData[offence]);
      });
    })

    const allYearsBurglaryData = allYearsDataOfAllOffences["Burglary"];
    datasets.push(
      {
        label: 'Burglary',
        data: allYearsBurglaryData,
        borderColor: '#1463FF',
        backgroundColor: '#1463FF',
      }
    )
  }

  const fetchApiData = useCallback(async () => {
    try {
      const url = "https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv";
      const response = await fetch(url);
      const data = await response.json();
      setApidata(data);
    } catch(err) {
      console.log(err);
    }
  })

  useEffect(() => {
    // fetchApiData();
  }, []);

  const getChartImage = () => {
    const chartInstance = chartRef.current;
    if(chartInstance) {
      console.log(chartInstance.toBase64Image())
    }
  }

  // getChartImage();

  const handlePrintBtnClick = () => {
    createPDF();
  }

  return (
    <div className="homepage-root-div">
        <button 
          className="print-btn"
          onClick={handlePrintBtnClick}
        >
          Print
        </button>

        <div className="chart-root-div">
          { 
            apiData 
              && (
                    <LineChart 
                      ref={chartRef}
                      labels={labels}
                      datasets={datasets}                
                    /> 
                  ) 
          }
        </div>
    </div>
  )
}

export default HomePage;