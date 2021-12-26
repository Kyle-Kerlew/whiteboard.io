import path from 'path';
import express from 'express';

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (request, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(process.env.NODE_ENV === 'production' ?
  8_080 :
  3_000);
