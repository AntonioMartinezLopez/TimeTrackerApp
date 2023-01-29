import "reflect-metadata";
// tslint:disable-next-line:no-var-requires
require("dotenv-safe").config();
import "jest";
import request from "supertest";

//import { Tag } from "../../src/entity/task.entity";
import { Helper } from "./helper";
import { Task } from "../../src/entity/task.entity";

describe("Tasks", () => {
  const helper = new Helper();

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it("should show all tasks", async (done) => {
    await helper.resetDatabase();
    await helper.loadFixtures();

    request(helper.app)
      .get("/api/task")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].name).toBe("Task1");
        expect(res.body.data[0].description).toBe("This is a test Task");
        done();
      });
  });

  it("should show all tasks including corresponding labels and trackings", async (done) => {
    request(helper.app)
      .get("/api/task")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].name).toBe("Task1");
        expect(res.body.data[0].description).toBe("This is a test Task");
        expect(res.body.data[0].labels.length).toBe(1);
        expect(res.body.data[0].labels[0].name).toBe("This is a test Label");
        expect(res.body.data[0].trackings.length).toBe(1);
        expect(res.body.data[0].trackings[0].description).toBe(
          "This is a test Tracking"
        );
        done();
      });
  });

  it("should add a new task without labels", async (done) => {
    request(helper.app)
      .post("/api/task")
      .send({
        name: "Task2",
        description: "This is a second test Task",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe("Task2");
        expect(res.body.data.description).toBe("This is a second test Task");
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
        expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
        expect(res.body.data.labels.length).toBe(0);
        done();
      });
  });

  it("should add a new task with existing labels", async (done) => {
    request(helper.app)
      .post("/api/task")
      .send({
        name: "Task2",
        description: "This is a second test Task",
        labels: [{ name: "This is a test Label" }],
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe("Task2");
        expect(res.body.data.description).toBe("This is a second test Task");
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
        expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
        expect(res.body.data.labels.length).toBe(1);
        expect(res.body.data.labels[0].name).toBe("This is a test Label");
        done();
      });
  });

  it("should add a new task with new labels", async (done) => {
    await helper.resetDatabase();
    request(helper.app)
      .post("/api/task")
      .send({
        name: "Task2",
        description: "This is a second test Task",
        labels: [{ name: "This is a complete new Testlabel" }],
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe("Task2");
        expect(res.body.data.description).toBe("This is a second test Task");
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
        expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
        expect(res.body.data.labels.length).toBe(1);
        expect(res.body.data.labels[0].name).toBe(
          "This is a complete new Testlabel"
        );
        done();
      });
  });

  it("should NOT add a new task without name", async (done) => {
    request(helper.app)
      .post("/api/task")
      .send({
        description: "This is a new test Task",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .end((err) => {
        if (err) throw err;
        done();
      });
  });

  it("should select one specific task by its id", async (done) => {
    const newTask = new Task();
    newTask.name = "Task3";
    newTask.description = "This is a new test Task";

    const savedTask = await helper.getRepo(Task).save(newTask);

    request(helper.app)
      .get(`/api/task/${savedTask.id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe("Task3");
        expect(res.body.data.description).toBe("This is a new test Task");
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
        expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
        expect(res.body.data.labels.length).toBe(0);
        expect(res.body.data.trackings.length).toBe(0);
        done();
      });
  });

  it("should delete one specific task by its id", async (done) => {
    await helper.resetDatabase();
    const newTask = new Task();
    newTask.name = "Task3";
    newTask.description = "This is a new test Task";

    const savedTask = await helper.getRepo(Task).save(newTask);

    request(helper.app)
      .delete(`/api/task/${savedTask.id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end(async (err) => {
        if (err) throw err;
        const [, taskCount] = await helper.getRepo(Task).findAndCount();
        expect(taskCount).toBe(0);
        done();
      });
  });


  it("should update a task", async (done) => {
    const newTask = new Task();
    newTask.name = "Task3";
    newTask.description = "This is a new test Task";

    const savedTask = await helper.getRepo(Task).save(newTask);

    request(helper.app)
      .patch(`/api/task/${savedTask.id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
          name: "edited Task3",
          description: "This is a edited test Task"
      })
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe("edited Task3");
        expect(res.body.data.description).toBe("This is a edited test Task");
        done();
      });
  });

  it("should add multiple labels to a specific task", async (done) => {
    await helper.resetDatabase();
    await helper.loadFixtures();

    const newTask = new Task();
    newTask.name = "Task3";
    newTask.description = "This is a new test Task";

    const savedTask = await helper.getRepo(Task).save(newTask);

    request(helper.app)
      .patch(`/api/task/${savedTask.id}/label`)
      .send({
        labels: [{ name: "This is a test Label" }, {name: "This is a second Label"}, {name: "this is a third Label"}],
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe("Task3");
        expect(res.body.data.description).toBe("This is a new test Task");
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
        expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
        expect(res.body.data.labels.length).toBe(3);
        expect(res.body.data.labels[0].name).toBe("This is a test Label");
        expect(res.body.data.labels[1].name).toBe("This is a second Label");
        expect(res.body.data.labels[2].name).toBe("this is a third Label");
        done();
      });
  });

  it("should remove multiple labels from a specific task", async (done) => {
    
    const savedTask: Task | any = await helper.getRepo(Task).findOne({where: { name: 'Task3' }});

    request(helper.app)
      .delete(`/api/task/${savedTask.id}/label`)
      .send({
        labels: [{ id: savedTask.labels[0].id }, {id: savedTask.labels[1].id}]
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe("Task3");
        expect(res.body.data.description).toBe("This is a new test Task");
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
        expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
        expect(res.body.data.labels.length).toBe(1);
        done();
      });
  });

  it("should show the mean time of each task", async (done) => {
    await helper.resetDatabase();
    await helper.loadFixtures();
    
    const savedTask: Task = await helper.getRepo(Task).findOneOrFail({where: { name: 'Task1' }});

    request(helper.app)
      .get("/api/stats")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].name).toBe(savedTask.name);
        expect(res.body.data[0].id).toBe(savedTask.id);
        expect(res.body.data[0].hours).toBe(0);
        expect(res.body.data[0].min).toBe(6);
        expect(res.body.data[0].sec).toBe(20);
        expect(res.body.data[0].milisec).toBe(20);
        done();
      });

  })

});
