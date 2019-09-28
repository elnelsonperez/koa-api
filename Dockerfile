FROM node:10

# Env
ENV NODE_ENV production

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package*.json ./

#RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Copy all other source code to work directory
ADD . /usr/src/app

# TypeScript
RUN npm run build

EXPOSE 3000
# Start
CMD [ "npm", "run", "start-dist" ]


