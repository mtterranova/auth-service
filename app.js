const express = require("express");
const cors = require("cors");
const routes = require("./routes/auth.routes")
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
