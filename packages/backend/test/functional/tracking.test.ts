import "reflect-metadata";
// tslint:disable-next-line:no-var-requires
require("dotenv-safe").config();
import "jest";
import request from "supertest";

import { Helper } from "./helper";
//import { Label } from "../../src/entity/tracking.entity";
import { Task } from "../../src/entity/task.entity";
import { Tracking } from "../../src/entity/tracking.entity";
import { getRepository } from "typeorm";
//import { Task } from "../../src/entity/label.entity";

describe("Tracking", () => {
  const helper = new Helper();

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it("should show all trackings", async (done) => {
    await helper.resetDatabase();
    await helper.loadFixtures();

    request(helper.app)
      .get("/api/tracking")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].description).toBe("This is a test Tracking");
        expect(res.body.data[0].startTime).toBe("2020-11-13T08:03:12.050Z");
        expect(res.body.data[0].endTime).toBe("2020-11-13T08:09:32.070Z");
        done();
      });
  });

  it("should save a new tracking", async (done) => {
    const newTask = new Task();
    newTask.name = "Task2";
    newTask.description = "This is a new test Task";

    const savedTask = await helper.getRepo(Task).save(newTask);

    request(helper.app)
      .post("/api/tracking")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        description: "This is a new test Tracking",
        taskId: savedTask.id,
        startTime: "2020-11-13T08:03:12.050Z",
        endTime: "2020-11-13T08:09:32.070Z",
      })
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.description).toBe("This is a new test Tracking");
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
        expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
        expect(res.body.data.task).toBe(savedTask.id);
        expect(res.body.data.startTime).toBe("2020-11-13T08:03:12.050Z");
        expect(res.body.data.endTime).toBe("2020-11-13T08:09:32.070Z");
        done();
      });
  });

  it("should NOT save a new tracking without task ID", async (done) => {
    request(helper.app)
      .post("/api/tracking")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        description: "This is a new test Tracking",
        startTime: "2020-11-13T08:03:12.050Z",
        endTime: "2020-11-13T08:09:32.070Z",
      })
      .expect(400)
      .end((err) => {
        if (err) throw err;
        done();
      });
  });

  it("should NOT save a new tracking with a unknown task ID", async (done) => {
    request(helper.app)
      .post("/api/tracking")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        taskId: "1234567",
        description: "This is a new test Tracking",
        startTime: "2020-11-13T08:03:12.050Z",
        endTime: "2020-11-13T08:09:32.070Z",
      })
      .expect(404)
      .end((err) => {
        if (err) throw err;
        done();
      });
  });

  it("should get a specific tracking", async (done) => {
    await helper.resetDatabase();
    const newTask = new Task();
    newTask.name = "newTestTask"
    newTask.description = "This is a new test Task";
    
    const savedTask = await getRepository(Task).save(newTask);

    const newTracking = new Tracking();
    newTracking.description = "newTracking"
    newTracking.task = savedTask;

    const savedTracking = await getRepository(Tracking).save(newTracking);


    request(helper.app)
      .get(`/api/tracking/${savedTracking.id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.description).toBe("newTracking");
        expect(res.body.data.startTime).toBeNull();
        expect(res.body.data.endTime).toBeNull();
        done();
      });
  });


  it("should delete a specific tracking", async (done) => {
    await helper.resetDatabase();
    const newTask = new Task();
    newTask.name = "newTestTask"
    newTask.description = "This is a new test Task";
    
    const savedTask = await getRepository(Task).save(newTask);

    const newTracking = new Tracking();
    newTracking.description = "This is a new test Tracking"
    newTracking.task = savedTask;

    const savedTracking = await getRepository(Tracking).save(newTracking);


    request(helper.app)
      .delete(`/api/tracking/${savedTracking.id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end(async (err) => {
        if (err) throw err;
        const [, trackingCount ] = await helper.getRepo(Tracking).findAndCount();
        expect(trackingCount).toBe(0);
        done();
      });
  });

  it("should update a specific tracking", async (done) => {
    await helper.resetDatabase();
    const newTask = new Task();
    newTask.name = "testTask"
    newTask.description = "new test Tag";
    
    const savedTask = await getRepository(Task).save(newTask);

    const newTracking = new Tracking();
    newTracking.description = "This is a new test Tracking"
    newTracking.task = savedTask;

    const savedTracking = await getRepository(Tracking).save(newTracking);


    request(helper.app)
      .patch(`/api/tracking/${savedTracking.id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
          description: "This is a edited test Tracking",
          startTime: "2020-11-13T08:03:12.050Z",
          endTime: "2020-11-13T09:03:12.050Z",
          task: savedTask.id
      })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.description).toBe("This is a edited test Tracking");
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
        expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
        expect(res.body.data.startTime).toBe("2020-11-13T08:03:12.050Z");
        expect(res.body.data.endTime).toBe("2020-11-13T09:03:12.050Z");        
        done();
      });
  });

});
