import { ProductType, db } from "../db/db"
import { CourseViewModel } from "../models/CourseViewModel"

export const getCourseViewModel = (dbCourse: ProductType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

export const productsRepository = {
    async findProducts(title: string | null | undefined): Promise<ProductType[]> {
        if(title){
            let filteredProducts = db.courses.filter( c => c.title.indexOf(title) > -1)
            return filteredProducts
        }else{
            return db.courses.map(getCourseViewModel) as ProductType[]
        }
    },
    async findProductById(id: number): Promise<ProductType | undefined>{
        let product = db.courses.find(c => c.id === id)
        return product
    },
    async createProduct(title: string): Promise<ProductType> {
        const createCourse = {
            id: +(new Date()),
            title: title,
            studentsCount: 0
            
        }
        db.courses.push(await createCourse)
        return createCourse
    },
    async updateProduct(id: number, title: string): Promise<boolean> {
        const foundCourse = db.courses.find(c => c.id === id)
        if(foundCourse){
            foundCourse.title = title
            return true
        } else {
            return false
        }        
    },
    async deleteProduct(id: number): Promise<boolean> {
        for(let i = 0; i < db.courses.length; i++){
            if(db.courses[i].id === id){
            db.courses.splice(i, 1);
            return true
            }
        }
        return false
    }
}