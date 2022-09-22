const pdf = require("html-pdf"),
  path = require("path");
Promise = require("bluebird");

const createPDFAsync = Promise.promisifyAll(pdf);

const baseUrl = "localhost:2020";

const createPDf = async (html, documentName) => {
  const fileName = documentName + ".pdf";
  const options = {
    base: baseUrl,
    format: "letter",
    height: "11.69in",
    width: "8.35in",
    filename: path.join(
      __dirname,
      "../public/files/",
      "bookingReceipts/" + fileName
    ),
  };

  const asyncPdf = await createPDFAsync.createAsync(html, options);
  console.log(asyncPdf);

  const pdfName = {
    pdf: asyncPdf,
    docName: fileName,
  };
  return pdfName;
};

module.exports = createPDf;
