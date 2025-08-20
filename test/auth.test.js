import request from "supertest";
import app from "../server.js"; // if server exports app; else create a tiny test server

// Adjust: export app in server.js for tests
describe("Auth routes", () => {
  it("rejects register without fields", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.statusCode).toBe(400);
  });
});
