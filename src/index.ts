import express, {Request, Response} from 'express';

const app = express()
const port = process.env.PORT || 5000
const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  
  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404
}
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
  courses : [
    {id: 1, title: 'front-end'},
    {id: 2, title: 'back-end'},
    {id: 3, title: 'automation qa'},
    {id: 4, title: 'devops'}
]}
app.get('/', (req: Request, res: Response) => {
  res.json("Выбирайте название курсов!!!")
})

app.get('/courses', (req: Request, res: Response) => {
  if(req.query.title){
    let searchString = req.query.title.toString()
    res.json(db.courses.filter( c => c.title.indexOf(searchString) > -1))
  }else{
    res.json(db.courses)
  }
})
app.get('/courses/:coursesTitle', (req: Request, res: Response) => {
  let cours = db.courses.find(c => c.title === req.params.coursesTitle)
  if(!cours){
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.json(cours)
})
app.get('/courses/:id', (req: Request, res: Response) => {
  const foundCourses = db.courses.find(c => c.id === +req.params.id)
  if(!foundCourses){
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.json(foundCourses)
})

app.post('/courses', (req: Request, res: Response) => {
  if(!req.body.title){
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    return;
  }
  const createCourse = {
    id: +(new Date()),
    title: req.body.title
  }
  db.courses.push(createCourse)
  res
    .status(HTTP_STATUSES.CREATED_201)
    .json(createCourse)
})

app.delete('/courses/:id', (req: Request, res: Response) => {
  for(let i = 0; i < db.courses.length; i++){
    if(db.courses[i].id === +req.params.id){
      db.courses.splice(i, 1);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
      return;
    }
  }
  res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
})

app.put('/courses/:id', (req: Request, res: Response) => {
  if(!req.body.title){
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  const foundCourses = db.courses.find(c => c.id === +req.params.id)
  if(foundCourses){
    foundCourses.title = req.body.title
    res
        .status(HTTP_STATUSES.NO_CONTENT_204)
        .json(foundCourses)
  }else{
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

})

app.listen(port, () => {
  console.log(`Start server port ${port}`)
})