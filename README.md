# Hilton Package application
## Project list
1. Apollo server (graphql)
2. remix (react)
3. cucumber (test)
## Start to develop
1. Add `.env` files to each package, like `.env.example` inside
2. Run `remix:dev` to develop the remix package
3. Run `apollo:dev` to develop the apollo package
4. Run `cucumber:test` to test

## Start to deploy
1. On the server, pull the file from github
2. Run `npm run remix:docker:build`
3. Run `npm run apollo:docker:build`
4. Run `npm run remix:docker:run`
5. Run `npm run apollo:docker:run`
6. Visit your domain
