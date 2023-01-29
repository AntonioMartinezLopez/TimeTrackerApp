# FWE-WS20-21-760212-HA2


This web application offers time tracking of your tasks via an intuitive user interface.

The Time Tracker App offers following functionalities:

- Adding and managing tasks
- Label you tasks so you can easily search for certain classes
- Start and manage trackings for a corresponding task

<br>

***Overview page (main page)***

Gives an overview over all existing Tasks. From here you can start, pause and stop new trackings.
Clicking "Edit Task" redirects to the corresponding Task page that shows all trackings of a given task.


![Alt text](./Screenshot1.png?raw=true "Optional Title")

<br>

***Taskview page***

Gives an overview of all trackings that were recorded for a certain task. On this page new trackings can be added und be edited manually. Additionally, functionalities are offered in order to change the name or the description of the task itself.

![Alt text](./Screenshot2.png?raw=true "Optional Title")

![Alt text](./Screenshot3.png?raw=true "Optional Title")


## **Setup web application**
---
<br>

1. Create the environment file:

    `cp ./packages/backend/.env.example ./packages/backend/.env`

2. Install required npm packages

    `docker-compose run backend npm install`

    `docker-compose run frontend npm install`

3. Start containers

    `docker-compose up` / `docker-compose up -d`

4. Synchronize database schemata

    `docker-compose exec backend npm run typeorm schema:sync`<br>

<br>


## **Unit- and Integration-Testing**
---
<br>

*(Disclaimer: Due to lack of time not all functionalities have been tested)*

### Initiate unit and integration testing (Jest) while containers are running:

`docker-compose exec frontend npm run test`

<br>



## **E2E test units with cypress**
---

<br>

   
1. Restart Database

    Drop current schema:

   `docker-compose exec backend npm run typeorm schema:drop`

    Resync:

   `docker-compose exec backend npm run typeorm schema:sync`

<br>

2. Install Cypress


    Change to cypress directory

    `cd ./packages/cypress`

    Install required packages

    `npm install`

    Start application

    `npm run cypress`


   




<br>




