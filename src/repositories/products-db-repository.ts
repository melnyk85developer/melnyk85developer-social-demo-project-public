import { ProductType, productsCollection } from "../db/db"
import { CourseViewModel } from "../models/CourseViewModel"

export const getCourseViewModel = (dbCourse: ProductType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

export const productsRepository = {
    async findProducts(title: string | undefined): Promise<ProductType[]> {
        const filter: any = {}

        if(title){
            filter.title = {$regex: title}
        }
        return productsCollection.find(filter).toArray();
    },
    async findProductById(id: number): Promise<ProductType | null>{
        let product: ProductType | null = await productsCollection.findOne({id})
        return product
    },
    async createProduct(newProduct: ProductType): Promise<ProductType> {
        const result = await productsCollection.insertOne(newProduct)

        return newProduct
    },
    async updateProduct(id: number, title: string): Promise<boolean> {
        const result = await productsCollection.updateOne({id: id},{ $set: {title: title}})

        return result.matchedCount === 1      
    },
    async deleteProduct(id: number): Promise<boolean> {
        const result = await productsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}