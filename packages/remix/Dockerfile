FROM node:18.13.0
LABEL authors="nana"

COPY ./ /app
WORKDIR /app
RUN npm install
RUN npm run build
EXPOSE 3004

CMD npm run serve
