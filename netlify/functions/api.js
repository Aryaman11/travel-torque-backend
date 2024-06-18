const express = require('express');
const app = express();
const home_url = require('../../home');
const detail = require('../../detail');
const checkout = require('../../checkout');
const listing = require('../../listing');

const cors = require('cors'); 
const ServerlessHttp = require('serverless');
app.use(cors());
// app.use(express.static(path.join(__dirname, "dist")));



app.get('/home', home_url);
app.get('/detail', detail);
app.get('/checkout', checkout);
app.get('/listing', listing);



app.get('/', function(req, res) {
  res.send('Hello from root route.')
});

/* hehe ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
export const handler = Serverless(app);