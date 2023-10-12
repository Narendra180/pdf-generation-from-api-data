const getImage = async (url) => {
  const response = await fetch(url);
  const res = await response.blob();
  const arrayBuffer = await res.arrayBuffer();
  return arrayBuffer;
}

const createHeader = async (doc) => {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  doc.save();

  doc.fontSize(13).fillColor("black");

  const companyNameString = "RealAssists.AI";
  const companyNameWidth = doc.widthOfString(companyNameString);
  const companyNameHeight = doc.heightOfString(companyNameString);
  doc.text(companyNameString, 70, 15.5); 

  const addressString = "123 Main Street, Dover, NH 03820-4667";
  const addressWidth = doc.widthOfString(addressString);
  doc.font('Helvetica-Bold').text(addressString, (pageWidth - addressWidth) - 55, 15.5);

  const lineGradientColor = doc.linearGradient(0, 40, pageWidth - 100, 40);
  lineGradientColor.stop(0, "#005DFF").stop(0.5, "#00A3FF").stop(1, "#21DDFF");
  doc.rect(50, 38, pageWidth - 100, 2);
  doc.fill(lineGradientColor);

  const logoMarkBuffer = await getImage("/logoMark.png");
  doc.image(logoMarkBuffer, 50, 14, {width: 15, height: 15})

  doc.restore();
}

const createFooter = async (doc, currentPageNo, totalNoOfPages) => {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  doc.fontSize(11).fillColor("#1463FF");

  doc.page.margins.bottom = 0;

  const date = new Date();
  const monthName = date.toLocaleString("default", { month: "long"});
  const dateNumber = date.getDate();
  const year = date.getFullYear();
  const generatedDateString = `Report generated on ${monthName} ${dateNumber}, ${year}`;
  // console.log(pageHeight, pageWidth)
  doc.font('Helvetica-Bold').text(generatedDateString, 50, pageHeight - 23.5)

  const pageNumberString = `RealAssist Property Report|Page ${currentPageNo} of ${totalNoOfPages}`;
  const pageNumberStringWidth = doc.widthOfString(pageNumberString);
  doc.fontSize(11).fillColor("black")                      
                      .text(pageNumberString.slice(0, 33), (pageWidth - 50) - pageNumberStringWidth - 1, pageHeight - 23.5, {  continued: true })
                          .fillColor("#626E99")
                            .text(pageNumberString.slice(33), {lineBreak: false})
                    // text(pageNumberString.slice(0, 33), { continued: true })
                    //   .fillColor("#626E99")
                    //     .text(pageNumberString.slice(33), { continued: true })
                    //       .text(pageNumberString, (pageWidth - 50) - pageNumberStringWidth, pageHeight - 23.5, { lineBreak: false })

  // doc.text(pageNumberString, (pageWidth - 50) - pageNumberStringWidth, pageHeight - 23.5, { lineBreak: false })

  const lineGradientColor = doc.linearGradient(0, 40, pageWidth - 100, 40);
  lineGradientColor.stop(0, "#005DFF").stop(0.5, "#00A3FF").stop(1, "#21DDFF");
  doc.rect(50, (pageHeight - 38), pageWidth - 100, 2);
  doc.fill(lineGradientColor);

  doc.page.margins.bottom = 50;

}

const addHeaderAndFooter = async (doc) => {
  // see the range of buffered pages
  const pages = doc.bufferedPageRange();

  const totalNoOfPages = pages.count;

  for (let currentPageNoIndex = 0; currentPageNoIndex < totalNoOfPages; currentPageNoIndex++) {
    doc.switchToPage(currentPageNoIndex);

    await createHeader(doc);
    await createFooter(doc, currentPageNoIndex + 1, totalNoOfPages);
    doc.flushPages();

  }
}

const createPDF = async (base64Chart) => {
  // create a document the same way as above
  const doc = new PDFDocument({ autoFirstPage: false, bufferPages: true });

  // pipe the document to a blob
  const stream = doc.pipe(blobStream());

  doc.addPage({
    size: "A4",
    margins: {
      top: 50,
      left: 50,
      bottom: 50,
      right: 50
    }
  });

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // add your content to the document here, as usual

  doc.save();
  doc.roundedRect(doc.x, doc.y, pageWidth - 100, 200, 10).clip();
  doc.roundedRect(doc.x, doc.y, pageWidth - 100, 200, 10).fill("#F2F4F5");
  doc.roundedRect(doc.x - 20, doc.y, pageWidth - 50, 30, 10).fill("#E8EEFB");
  doc.restore();
  doc.fontSize(14).fillColor("#1463FF")
  const chartHeading = "Burglary";
  doc.text(chartHeading, doc.x + 15, (doc.y + 30/2), { baseline: "middle"});
  const arrestsLegend = "Arrests";
  doc.save();
  doc.rotate(-90, { origin: [70, 165]});
  doc.fillColor("black").text(arrestsLegend, 70, 80 + (170/2), { baseline: "middle" })
  doc.restore();

  doc.roundedRect(90, 90, pageWidth - 180, 150, 10).fill("white");
  doc.image(base64Chart, 95, 95, {width: pageWidth - 190, height: 140})

  await addHeaderAndFooter(doc);


  // get a blob when you're done
  doc.end();
  stream.on('finish', function () {
    // get a blob you can do whatever you like with
    const blob = stream.toBlob('application/pdf');

    // or get a blob URL for display in the browser
    const iframe = document.getElementsByTagName("iframe")[0];
    const url = stream.toBlobURL('application/pdf');
    iframe.src = url;
  });
}

export { createPDF };