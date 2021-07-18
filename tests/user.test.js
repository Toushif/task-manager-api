const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { _id, testUser, setUpTestDatabase } = require('./fixtures/db')


beforeEach(setUpTestDatabase) //calls each and everytime every database is run

test("Should sign up a new user", async () => {
    const response = await request(app).post('/users').send({
        "name": "Toushif UL Haque",
        "email": "toushif.haq@gmail.com",
        "password": "toushif77##",
        "age": 28
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user: {
            name: "Toushif UL Haque",
            email: "toushif.haq@gmail.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("toushif77##")
})

test("Should login existing user", async () => {
    const response = await request(app).post('/users/login').send({
        email: testUser.email,
        password: testUser.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should not login non-existing user", async () => {
    await request(app).post('/users/login').send({
        email: testUser.email,
        password: 'thisisnotmypassword'
    }).expect(400)
})

test("Should get user profile", async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should not get user profile for unauthenticated user", async () => {
    await request(app)
        .get('/users/login')
        .send()
        .expect(401)
})

test("Should delete account for user", async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(_id)
    expect(user).toBeNull()
})

test("Should not delete profile for unauthenticated user", async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test("Should upload avatar image", async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(_id)
    expect(user.avatar).toEqual(expect.any(Buffer)) //here we are using toEqul instead of toBe, coz tobe return false when we compare {} or any object. It is safe and always preferable to use toEqual. Here we are just checking user.avatar binary buffer array stored in the database. We just check whether it is buffer data stored or not, although if could also check the exact binary data.
})

test("Should update valid user fields", async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            name: 'Clark'
        }).expect(200)

    const user = await User.findById(_id)
    expect(user.name).toEqual('Clark')
})

test("Should not update invalid user fields", async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            location: 'Kolkata'
        }).expect(400)
})


/* 
    Extra tests ideas

    User Test Ideas

    Should not signup user with invalid name/email/password
    Should not update user if unauthenticated
    Should not update user with invalid name/email/password
    Should not delete user if unauthenticated

    https://gist.github.com/m-lod/4d8530672e692639f8c07c0addce7c6d
 */