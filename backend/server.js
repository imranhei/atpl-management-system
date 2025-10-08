const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cors());
dotenv.config();

app.get('/health', (req, res) => {
  res.type('text').send('ok!');
});
// if you serve a SPA with a catch-all, keep it LAST:
app.get('/', (req, res) => res.json({ ups: true }));
app.get('/api/alive', (req, res) => {
  res.json({ message: "Server is alive" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});