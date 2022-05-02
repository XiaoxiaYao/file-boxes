# file-boxes

## Local development

### Database

The database for local development is hosted on Atlas. Feel free to use your own credential for it in `.env.development` file inside of `server` folder.

### Cloud storage

The clould storage for local development is hosted on Cloudinary. Feel free to use your own credential for it in `.env.development` file inside of `server` folder.

### Backend project

1. cd into server folder

2. Install backend libs

```
npm run install
```

3. Star the backend app
   `npm run start:dev`

4. There is backend API docs available on `http://localhost:4001/docs`. Feel free to explore it.

## Deployment

### Backend projcet

The backend project is deployed to Heroku via Heroku CLI which is a manual way due to some Github issues of Heroku.

You can check the backend docs here:

`https://file-boxes-server.herokuapp.com/docs/`
