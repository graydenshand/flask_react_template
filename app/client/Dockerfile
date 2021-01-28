FROM node

RUN mkdir /home/app/
# set working directory
WORKDIR /home/app/

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY app/package.json /home/app/
COPY app/package-lock.json /home/app/
RUN npm install
RUN npm install react-scripts -g

# add app
COPY app/ /home/app/

# start app
CMD ["npm", "start"]