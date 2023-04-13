import request from 'supertest';
import app from '../index.js'
import { db } from '../db.js';

beforeAll(done => {
    done()
})
  
afterAll(done => {
    done()
})

export const conn = request(app)
let post_id = 1

describe("GET /content/posts", () => {
    it("Should return all posts", async () => {
        const res = await conn.get("/content/posts")
        expect(res.statusCode).toBe(200)
        expect(res.body.result).toBeDefined()
    })
})

describe("POST /content/posts", () => {
    it("Should post a post", async () => {
        const res = await conn.post("/content/posts").send({
            username: "TEST",
            title: "TEST",
            tags: "TEST",
            image: "TEST",
            description: "TEST"
        })
        expect(res.statusCode).toBe(201)
        expect(res.body).toBeDefined()
    })
})

describe("PUT /content/posts", () => {
    it("Should update a post", async () => {
        const q = db.prepare(`SELECT (id) FROM posts WHERE username=? AND title=? AND image=?`)
        const { id } = q.get("TEST", "TEST", "TEST")
        post_id = id
        const res = await conn.put("/content/posts").send({
            post_id: post_id,
            title: "TEST",
            tags: "TEST",
            image: "TEST",
            description: "CHANGED"
        })
        expect(res.statusCode).toBe(204)
        expect(res.body).toBeDefined()
    })

    it("Post description attribute should be updated to CHANGED", async () => {
        const q = db.prepare(`SELECT description FROM posts WHERE username=? AND title=? AND image=?`)
        const { description } = q.get("TEST", "TEST", "TEST")
        expect(description).toBe("CHANGED")     
    })
})

describe("GET /content/posts/:post_id", () => {
    it("Fetch a post by id", async () => {
        const res = await conn.get(`/content/posts/${post_id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.result.id).toBe(post_id)
        expect(res.body.result.description).toBe("CHANGED")
    })
})

describe("DELETE /content/posts/:post_id", () => {
    it("DELETE a post by id", async () => {
        const res = await conn.delete(`/content/posts/${post_id}`)
        expect(res.statusCode).toBe(204)
    })
})

describe("GET /content/posts/:post_id", () => {
    it("Get a deleted post", async () => {
        const res = await conn.get(`/content/posts/${post_id}`)
        expect(res.statusCode).toBe(404)
    })
})