import "reflect-metadata";
// tslint:disable-next-line:no-var-requires
require("dotenv-safe").config();
import "jest";
import request from "supertest";

import { Helper } from "./helper";
import { Label } from "../../src/entity/label.entity";
//import { Task } from "../../src/entity/label.entity";

describe("Label", () => {
  const helper = new Helper();

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it("should show all labels", async (done) => {
    await helper.resetDatabase();
    await helper.loadFixtures();

    request(helper.app)
      .get("/api/label")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].name).toBe("This is a test Label");
        done();
      });
  });

  it("should save a new label", async (done) => {
    request(helper.app)
      .post("/api/label")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        name: "newLabel",
      })
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe("newLabel");
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
        expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
        done();
      });
  });

  it("should NOT save a new label without name", async (done) => {
    request(helper.app)
      .post("/api/label")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        name: "",
      })
      .expect(400)
      .end((err) => {
        if (err) throw err;
        done();
      });
  });

  it("should select a label by its id", async (done) => {
    await helper.resetDatabase();
    const newLabel = new Label();
    newLabel.name = "newLabel";

    const savedLabel = await helper.getRepo(Label).save(newLabel);

    request(helper.app)
      .get(`/api/label/${savedLabel.id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe("newLabel");
        done();
      });
  });

  it("should update a label", async (done) => {
    await helper.resetDatabase();
    const newLabel = new Label();
    newLabel.name = "newLabel";

    const savedLabel = await helper.getRepo(Label).save(newLabel);

    request(helper.app)
      .patch(`/api/label/${savedLabel.id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        name: "edited newLabel",
      })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe("edited newLabel");
        done();
      });
  });

  it("should delete a label", async (done) => {
    await helper.resetDatabase();
    const newLabel = new Label();
    newLabel.name = "newLabel";

    const savedLabel = await helper.getRepo(Label).save(newLabel);

    request(helper.app)
      .delete(`/api/label/${savedLabel.id}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end(async (err) => {
        if (err) throw err;
        const [, labelCount] = await helper.getRepo(Label).findAndCount();
        expect(labelCount).toBe(0);
        done();
      });
  });

  it("should select all corresponding tasks", async (done) => {
    await helper.resetDatabase();
    await helper.loadFixtures();

    const savedLabel: Label | any = await helper
      .getRepo(Label)
      .findOne({ where: { name: "This is a test Label" } });

    request(helper.app)
      .get(`/api/label/${savedLabel.id}/tasks`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].tasks[0].name).toBe("Task1");
        expect(res.body.data[0].tasks[0].description).toBe(
          "This is a test Task"
        );
        done();
      });
  });
});
