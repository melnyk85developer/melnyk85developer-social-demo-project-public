import { CourseType, db } from "../db/db"
import { CourseViewModel } from "../models/CourseViewModel"

export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

export const productsRepository = {
    findProducts(title: string | null){
        if(title){
            let filteredProducts = db.courses.filter( c => c.title.indexOf(title) > -1)
            return filteredProducts
        }else{
            return db.courses.map(getCourseViewModel)
        }
    },
    findProductById(id: number){
        let product = db.courses.find(c => c.id === id)
        return product
    },
    createProduct(title: string){
        const createCourse: CourseType = {
            id: +(new Date()),
            title: title,
            studentsCount: 0
            
        }
        db.courses.push(createCourse)
        return createCourse
    },
    updateProduct(id: number, title: string){
        const foundCourse = db.courses.find(c => c.id === id)
        if(foundCourse){
            foundCourse.title = title
            return true
        } else {
            return false
        }        
    },
    deleteProduct(id: number){
        for(let i = 0; i < db.courses.length; i++){
            if(db.courses[i].id === id){
            db.courses.splice(i, 1);
            return true
            }
        }
        return false
    }
}