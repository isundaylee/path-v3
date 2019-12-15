FROM nikolaik/python-nodejs:python3.8-nodejs13-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent

COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

ADD . /app

RUN npm run build

ENV PORT 5000

CMD ["python3", "main.py"]
