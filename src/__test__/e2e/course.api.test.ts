import request from 'supertest';
import { CreateCourseModel }from '../../models/CreateCourseModel';
import { UpdateCourseModel } from '../../models/UpdateCourseModel';
import { HTTP_STATUSES } from '../../utils';
import { app } from '../../app';

const getRequest = () => {
        return request(app)
}
describe('/courses', () => {
    beforeAll( async () => {
        await getRequest().delete('/__test__/data')
    })
    it('should return 200 and empy array', async () => {
        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it('should return 404 for not existing course', async () => {
        await getRequest()
            .get('/courses/99999')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`should'nt create course with incorrect input data`, async () => {
        const data: CreateCourseModel = { title: ''}
        
        await getRequest()
                .post('/courses')
                .send(data)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
        
    })
    let createdCourse1: any = null
    it(`should create course with correct input data`, async () => {
        const data: CreateCourseModel = { title: 'it-incubator course'}
        const createResponse = await getRequest()
                .post('/courses')
                .send(data)
                .expect(HTTP_STATUSES.CREATED_201)

        createdCourse1 = createResponse.body;
                
        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: 'it-incubator course'
        })

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
        
    })
    let createdCourse2: any = null
    it(`create one more course`, async () => {
        const data: CreateCourseModel = { title: 'it-incubator course 2'}
        const createResponse = await getRequest()
                .post('/courses')
                .send(data)
                .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createResponse.body;
                
        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
        
    })
    it(`should'nt update course with incorrect input data`, async () => {
        const data: CreateCourseModel = { title: ''}

        await getRequest()
                .put(`/courses/` + createdCourse1.id)
                .send(data)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
                .get('/courses/' + createdCourse1.id)
                .expect(HTTP_STATUSES.OK_200, createdCourse1)
            
    })
    it(`should'nt update course that not exist`, async () => {
        await getRequest()
                .put(`/courses/` + -100)
                .send({ title: 'good title'})
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        
    })
    it(`should update course with correct input data`, async () => {
        const data: UpdateCourseModel = { title: 'good new title'}

        await getRequest()
                .put(`/courses/` + createdCourse1.id)
                .send(data)
                .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
                .get(`/courses/` + createdCourse1.id)
                .expect(HTTP_STATUSES.OK_200, {
                    ...createdCourse1,
                    title: data.title
        })

        await getRequest()
                .get(`/courses/` + createdCourse2.id)
                .expect(HTTP_STATUSES.OK_200, createdCourse2)
        
    })
    it(`should delete both courses`, async () => {
        await getRequest()
                .delete(`/courses/` + createdCourse1.id)
                .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
                .get(`/courses/` + createdCourse1.id)
                .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
                .delete(`/courses/` + createdCourse2.id)
                .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
                .get(`/courses/` + createdCourse2.id)
                .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
                .get(`/courses`)
                .expect(HTTP_STATUSES.OK_200, [])  
    })

})