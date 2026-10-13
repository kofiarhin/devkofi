FROM node:20-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY server/ ./server/

USER node
EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "const http=require('http');http.get({hostname:'127.0.0.1',port:process.env.PORT||4001,path:'/health',timeout:4000},r=>{let b='';r.on('data',c=>b+=c);r.on('end',()=>{try{const j=JSON.parse(b);process.exit(r.statusCode===200&&j.message==='ok'?0:1)}catch{process.exit(1)}})}).on('error',()=>process.exit(1))"

CMD ["node", "server/docker-start.js"]
