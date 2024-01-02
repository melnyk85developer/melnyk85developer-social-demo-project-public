import express, { Request, Response } from 'express';
import { CourseViewModel } from "../models/CourseViewModel"
import { CreateCourseModel } from "../models/CreateCourseModel"
import { QueryCourseModel } from "../models/QueryCoursesModel"
import { URIParamsCourseIdModel } from "../models/URIParamsCourseIdModel"
import { UpdateCourseModel } from "../models/UpdateCourseModel"
import { RequestWithBody, 
         RequestWithParams, 
         RequestWithParamsAndBody, 
         RequestWithQuery } from "../types/types"
import { CourseType, DBType } from '../db/db';
import { HTTP_STATUSES } from '../utils';
import { productsRepository } from '../repositories/addresses-repository';

export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}
export const getCoursesRouter = (db: DBType) => {

    const router = express.Router()

    // router.get('/', (req: Request, res: Response) => {
    //     res.json("Выбирайте название курсов!!!")
    // })

    router.get('/', (req: RequestWithQuery<QueryCourseModel>, res: Response<CourseViewModel[]>) => {
        const foundProdicts = productsRepository.findProducts(req.query.title)
        res.json(foundProdicts)
    })
    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
        const foundCourse = productsRepository.findProductById(+req.params.id)
        if(!foundCourse){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(getCourseViewModel(foundCourse))
    })
    router.get('/:coursesTitle', (req: RequestWithParams<{coursesTitle: string}>, res: Response<CourseViewModel>) => {
        let cours = db.courses.find(c => c.title === req.params.coursesTitle)
        if(!cours){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(cours)
    })
    router.post('/', (req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {
        if(!req.body.title){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }
        const newProduct = productsRepository.createProduct(req.body.title)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getCourseViewModel(newProduct))
    })
    router.delete('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
        const isDeleted = productsRepository.deleteProduct(+req.params.id)
        if(isDeleted){
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }else{
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    })
    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>, res: Response<CourseViewModel>) => {
        if(!req.body.title){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const isUpdated = productsRepository.updateProduct(+req.params.id, req.body.title)
        if(isUpdated){
            const product = productsRepository.findProductById(+req.params.id)
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204).json(product)
        }else{
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        
    
    })

    return router
}