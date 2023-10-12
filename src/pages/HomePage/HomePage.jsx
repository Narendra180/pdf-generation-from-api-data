import "./HomePage.css";
import LineChart from "../../components/LineChart/LineChart";
import { useState, useEffect, useCallback, useRef } from "react";
import Modal from "../../components/Modal/Modal";
import { createPDF } from "../../utils/utils";
import { Button } from "react-bootstrap";

function HomePage() {
  const [apiData, setApidata] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeSrc, setIframesrc] = useState("");

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
    fetchApiData();
  }, []);

  const getChartImage = () => {
    const chartInstance = chartRef.current;
    if(chartInstance) {
      // console.log(chartInstance.toBase64Image())
      return chartInstance.toBase64Image();
    } else {
      return null;
    }
  }

  const handleModalBtnClick = async () => {
    const base64Image = getChartImage();
    console.log(base64Image)
    if(base64Image) {
      const stream = await createPDF(base64Image);
      stream.on('finish', () => {
        const url = stream.toBlobURL('application/pdf');
        setIframesrc(url);
        setIsModalOpen(true);
      })
    } else {
      setIframesrc("");
      throw new Error("Unable to generate pdf beacuse of unavailability of chart.");
    }
  }

  const handleDownloadBtnClick = async () => {
    const base64Image = getChartImage();
    if(base64Image) {
      const stream = await createPDF(base64Image);
      stream.on('finish', () => {
        const blob = stream.toBlob('application/pdf');
        // console.log(blob)

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";

        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = "report";
        a.click();
        window.URL.revokeObjectURL(url);
      })
    } else {
      throw new Error("Unable to generate pdf beacuse of unavailability of chart.");
    }
  }

  return (
    <div className="homepage-root-div">

        <Button 
          variant="primary"
          onClick={handleDownloadBtnClick}
        >
          Download PDF
        </Button>

        <Button 
          variant="info"
          onClick={handleModalBtnClick}
        >
          Open PDF in Iframe Modal
        </Button>

        <Modal
          show={isModalOpen}
          onHide={() => {
            setIsModalOpen(!isModalOpen);
            setIframesrc("");
          }}
          src={iframeSrc}
        />

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