import { MongoClient } from 'mongodb'

export type ProductType = {
    id: number
    title: string
    studentsCount: number
}

const mongoUrl = process.env.mongoURL || "mongodb://0.0.0.0:27017"
const client = new MongoClient(mongoUrl);
const DB = client.db("shop");
export const productsCollection = DB.collection<ProductType>("products")

export const connectDB = async () => {
    try {
        // Подключение клиента к серверу
        await client.connect();
        // Установите и проверьте соединение
        await client.db("shop").command({ ping: 1 });
        console.log("Успешное подключение к серверу mongo")
    } catch {
        // Обеспечивает закрытие клиента после завершения работы/ошибки
        console.log("Не могу подключится к Базе Данных!")
        await client.close();
    }
} 

export const db: DBType = {
    courses : [
        {id: 1, title: 'front-end', studentsCount: 10},
        {id: 2, title: 'back-end', studentsCount: 10},
        {id: 3, title: 'automation qa', studentsCount: 10},
        {id: 4, title: 'devops', studentsCount: 10}
    ]
}
export type DBType = {courses: ProductType[]}