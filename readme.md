## ⚡ Advanced Database Project ⚡

### ⚽ Goal

1. Find a data source that can be updated daily, e.g. exchange rates, stocks, weather etc.

   - data will have to be collected for at least two weeks

2. Prepare a draft of the dashboard, which must include:

   - visualization of the downloaded data, e.g. in the form of a graph, map or other

   - at least 5 data filters.

### 🏃‍ ️Build & Run

Prefer to use yarn instead of npm. Feel free to use both package managers.

- Database:

```bash
cp .env.example .env
docker-compose up -d
docker-compose down # turn off compose 
```

- Scrap data from API:

```bash
node scraper.js
```

- GraphQL server:

```bash
yarn install
yarn dev
```

- FE Client:

```bash
cd client
yarn install
yarn dev
```

- you can use the built-in prisma ORM client to manage your data:

```bash
# root directory
yarn prisma:studio
```

