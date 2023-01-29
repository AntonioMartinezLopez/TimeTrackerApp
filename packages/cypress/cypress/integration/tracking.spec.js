import { taskBuilder } from "../builder/Task";

describe("Trackings", () => {
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


  it("can add manually a new tracking", () => {
    cy.findByText("Edit Task").click();
    cy.url().should("contain", "/taskview");
    cy.screenshot();
    cy.findByTestId("add-tracking-button").click();
    cy.screenshot();
    cy.findByTestId("time").clear().type("00:23:23");
    cy.findByTestId("description").clear().type("This is a test description");
    cy.findByText("Save Tracking").click({ force: true });
    cy.findByTestId("tracking-item").should("have.length", 1);
  });

  it("can update an existing tracking", () => {
    cy.findByText("Edit").click();
    cy.findByTestId("time").clear().type("00:23:23");
    cy.findByTestId("description").clear().type("This is a test description");
    cy.findByText("Save Tracking").click({ force: true });
    cy.findByTestId("tracking-item").should("have.length", 1);
  })

  it("can delete an existing tracking", () => {
    cy.findByTestId("tracking-item").should("have.length", 1);
    cy.findByText("Delete").trigger('mouseover').click();
    cy.findByTestId("tracking-item").should("have.length", 0);
  })

  it("can start a new tracking", () => {
    cy.visit("/overview");
    cy.findByTestId("task-item").should("have.length", 1);
    cy.findByText("Start Timer").click();
    cy.wait(3000);
    cy.findByTestId("input-tracking-player").should('exist');    
  })

  it("can enter a new description for the currently running task", () => {
    cy.findByTestId("input-tracking-player").should('exist');
    cy.findByTestId("input-tracking-player").type("This is a new tracking description")    
  })

  it("can pause a currently running task", () => {
    cy.findByTestId("input-tracking-player").should('exist');
    cy.findByTestId("pause-button").should('exist');
    cy.findByTestId("pause-button").click();
  } )

  it("can stop a running task", () => {
    cy.findByTestId("input-tracking-player").should('exist');
    cy.findByTestId("stop-button").should('exist');
    cy.findByTestId("stop-button").click();
  })




})