const app = require('./app');
const PORT = 9090;

app.listen(9090, err => {
  if (err) throw err;
  console.log(`listening on port ${PORT}`);
});
