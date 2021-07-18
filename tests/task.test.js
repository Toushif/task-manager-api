const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    _id,
    _id2,
    testUser,
    testUser2,
    taskOne,
    taskTwo,
    taskThree,
    setUpTestDatabase
} = require('./fixtures/db')


beforeEach(setUpTestDatabase)

test('Should create new task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            description: "From my test"
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch user task', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not delete other user\'s tasks', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${testUser2.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

/* 
    Extra tests ideas

    Task Test Ideas

    Should not create task with invalid description/completed
    Should not update task with invalid description/completed
    Should delete user task
    Should not delete task if unauthenticated
    Should not update other users task
    Should fetch user task by id
    Should not fetch user task by id if unauthenticated
    Should not fetch other users task by id
    Should fetch only completed tasks
    Should fetch only incomplete tasks
    Should sort tasks by description/completed/createdAt/updatedAt
    Should fetch page of tasks

    https://gist.github.com/m-lod/4d8530672e692639f8c07c0addce7c6d
 */