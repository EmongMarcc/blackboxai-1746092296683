const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let reports = [];
let reportIdCounter = 1;

// Agent submits a report
app.post('/reports', (req, res) => {
  const { agentName, serviceType, description } = req.body;
  if (!agentName || !serviceType || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newReport = {
    id: reportIdCounter++,
    agentName,
    serviceType,
    description,
    status: 'submitted',
    payment: null,
    invoicePrice: null,
  };
  reports.push(newReport);
  res.status(201).json(newReport);
});

// Accounts get list of reports
app.get('/reports', (req, res) => {
  res.json(reports);
});

// Accounts approve a report and record payment and invoice price
app.put('/reports/:id/approve', (req, res) => {
  const reportId = parseInt(req.params.id);
  const { payment, invoicePrice } = req.body;
  const report = reports.find(r => r.id === reportId);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  if (report.status === 'approved') {
    return res.status(400).json({ error: 'Report already approved' });
  }
  report.status = 'approved';
  report.payment = payment;
  report.invoicePrice = invoicePrice;
  res.json(report);
});

app.listen(port, () => {
  console.log(`Travel reporting system backend listening at http://localhost:${port}`);
});
