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
import { ProductType, DBType } from '../db/db';
import { HTTP_STATUSES } from '../utils';
import { productsService } from '../domian/products-service';
import { body, validationResult } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware';

// export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
//     return {
//         id: dbCourse.id,
//         title: dbCourse.title
//     }
// }

export const getCoursesRouter = (db: DBType) => {

    const router = express.Router()
    const titleValidation = body('title').trim().isLength({ min: 3, max: 10 }).withMessage('Ты прислал либо пустую строку, либо много символов! Минимум 3, максимум 10 символов!')

    // router.get('/', (req: Request, res: Response) => {
    //     res.json("Выбирайте название курсов!!!")
    // })

    router.get('/', async (req: RequestWithQuery<QueryCourseModel>, res: Response<CourseViewModel[]>) => {
        const foundProdicts: ProductType[] = await productsService.findProducts(req.query.title)
        res.json(foundProdicts)
    })
    router.get('/:id', async (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
        const foundCourse = await productsService.findProductById(+req.params.id)
        if(!foundCourse){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(foundCourse)
    })
    router.get('/:coursesTitle', (req: RequestWithParams<{coursesTitle: string}>, res: Response<CourseViewModel>) => {
        let cours = db.courses.find(c => c.title === req.params.coursesTitle)
        if(!cours){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(cours)
    })
    router.post('/', titleValidation, inputValidationMiddleware, async (req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {

        const newProduct: ProductType = await productsService.createProduct(req.body.title)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(newProduct)
    })
    router.delete('/:id', async (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
        const isDeleted = await productsService.deleteProduct(+req.params.id)
        if(isDeleted){
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }else{
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    })
    router.put('/:id', titleValidation, inputValidationMiddleware, async (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>, res: Response<ProductType | null>) => {

        const isUpdated = await productsService.updateProduct(+req.params.id, req.body.title)
        if(isUpdated){
            const product = await productsService.findProductById(+req.params.id)
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204).json(product)
        }else{
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
    
    })

    return router
}