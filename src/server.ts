import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.routes';
import companyRoutes from './routes/company.routes'; 


const app = express();
const PORT = process.env.PORT || 5000;
const PREFIX = process.env.PREFIX || '/api/v1';

app.use(express.json());
app.use(`${PREFIX}/auth`, authRoutes);
app.use(`${PREFIX}/company`, companyRoutes); 

app.get('/', (req, res) => res.send('E-Learning Platform API'));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
export { server };
