# hilton-cucumber


## Init the project
### Set up the .env
```sh
vi .env
```
It should include keys like below:
```
WEB_URL=http://host:port
```
### Install node_modules
```sh
npm install
```

### Run tests
```sh
npm run test
```

### Read the report
When the test finished, it will upload the report to the cucumber.io server, and shows a link on the terminal like 'https://reports.cucumber.io/reports/e9562868-e4c6-4d24-bb6e-91c83f9c5619'  
Just visit the lik, a report will show.
