# pull image node 18.14 alpine
FROM node:18.14-alpine

# create working directory
WORKDIR /usr/src/app

# copy all files to working directory
COPY . .

# install dependencies
RUN npm install --silent

# expose port
EXPOSE 3000

# run the app
CMD ["npm", "run", "start"]
