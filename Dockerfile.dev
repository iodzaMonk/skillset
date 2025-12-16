FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm rebuild lightningcss --silent || true
COPY prisma ./prisma
RUN npx prisma generate

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]