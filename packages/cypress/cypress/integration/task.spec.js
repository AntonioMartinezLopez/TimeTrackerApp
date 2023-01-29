import { taskBuilder } from "../builder/Task";

describe("OverviewPage", () => {
  it("can create a new task", () => {
    const task = taskBuilder({})();
    cy.visit("/overview");
    cy.screenshot();
    cy.findByTestId(/create-task-button/i).click();
    cy.findByLabelText(/name/i).type(task.name);
    cy.findByLabelText(/description/i).type(task.description);
    cy.findByLabelText(/label/i).type("TestLabel {enter}", { force: true });
    cy.findByText("Add Task").click({ force: true });
    cy.findByTestId("task-item").should("have.length", 1);
    cy.screenshot();
  });

  it("can update an existing task", () => {
    const task = taskBuilder({})();
    cy.visit("/overview");
    cy.findByTestId("task-item").should("have.length", 1);
    cy.findByText("Edit Task").click();
    cy.url().should("contain", "/taskview");
    cy.screenshot();
    cy.findByText("Edit Task").click();
    cy.screenshot();
    cy.findByLabelText(/name/i).clear().type(task.name);
    cy.findByLabelText(/description/i).clear().type(task.description);
    cy.findByLabelText(/label/i).clear().type("TestLabel2 {enter}", { force: true });
    cy.findByText("Update Task").click({ force: true });
    cy.screenshot();
  });

  it("can remove an existing task", () => {
    cy.visit("/overview");
    cy.findByTestId("task-item").should("have.length", 1);
    cy.findByText("Edit Task").click();
    cy.url().should("contain", "/taskview");
    cy.screenshot();
    cy.findByText("Edit Task").click();
    cy.screenshot();
    cy.findByText("Delete Task").click();
    cy.url().should("contain", "/overview");
    cy.findByTestId("task-item").should("have.length", 0);
  });
});
