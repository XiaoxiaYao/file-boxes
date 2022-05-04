# file-boxes

## Local development

### Database

The database for local development is hosted on Atlas. Feel free to use your own credential for it in `.env.development` file inside of `server` folder.

### Cloud storage

The clould storage for local development is hosted on Cloudinary. Feel free to use your own credential for it in `.env.development` file inside of `server` folder.

### Backend project

1. cd into `server` folder

2. Install backend libs

```
npm run install
```

3. Star the backend app
   `npm run start:dev`

4. There is backend API docs available on [local api docs](http://localhost:4001/docs). Feel free to explore it.

### Frontend projcet

1. cd into `client` folder

2. Install libs

```
npm run install
```

3. Star the frontend app
   `npm run start`

## Deployment

### Projcet

The backend project is deployed to Heroku via Heroku CLI which is a manual way due to some Github issues of Heroku.

Here is the [project address](https://file-boxes-server.herokuapp.com)

You can check [the backend docs](https://file-boxes-server.herokuapp.com/docs/) here:

The React app is served as a static resource of Nestjs.

### How to dploy

1. cd into server folder

2. Build static frontend

```
npm run build-client
```

3. The Heroku app has been created and the production environment variables have been configured.

4. Use Heroku CLI to deploy to cloud. [Heroku CLI](https://devcenter.heroku.com/articles/git)

## Unit tests

### Backend project

1. cd into server folder

2. Run the tests

```
npm run test
```

3. Need to write more unit tests and make sure the test coverage is above 95%.
