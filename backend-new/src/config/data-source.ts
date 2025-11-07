import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: 3306,
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: '807web',
    extra: {
        connectionLimit: 10,
    },
    entities: [__dirname + '/../entities/**/*.{ts,js}'],
    synchronize: false,
    logging: process.env.ENVIRONMENT !== 'production',
});
