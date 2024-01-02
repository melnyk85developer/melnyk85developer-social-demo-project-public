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
    
        if(req.query.title){
            res.json(db.courses.filter( c => c.title.indexOf(req.query.title) > -1))
        }else{
            res.json(db.courses.map(getCourseViewModel))
        }
    
    })
    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id)
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
        const createCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
            
        }
        db.courses.push(createCourse)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getCourseViewModel(createCourse))
    })
    router.delete('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
        for(let i = 0; i < db.courses.length; i++){
            if(db.courses[i].id === +req.params.id){
            db.courses.splice(i, 1);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return;
            }
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    })
    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>, res: Response<CourseViewModel>) => {
        if(!req.body.title){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
    
        const foundCourse = db.courses.find(c => c.id === +req.params.id)
    
        if(!foundCourse){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
    
        foundCourse.title = req.body.title
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    
    })

    return router
}