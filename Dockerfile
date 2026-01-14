FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN if [ -f .devcontainer/postCreate.sh ]; then chmod +x .devcontainer/postCreate.sh; fi && \
	if [ -f init-test-db.sh ]; then chmod +x init-test-db.sh; fi

EXPOSE 3000

CMD ["npm", "run", "dev"]
