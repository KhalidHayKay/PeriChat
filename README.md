## 🚀 Getting Started with PeriChat

Before choosing a setup method (Docker or manual), here's an overview of the project structure and how to approach it:

### 📁 Project Structure

```
PeriChat/
├── docker/              # Contains Docker setup files (e.g., docker-compose.yaml)
└── src/                 # Main Laravel application source code
```

### 📌 Important Notes

- The **main application code** lives in the `/src` directory.
- The `/docker` directory contains only the configuration for running the project via Docker.

Depending on how you intend to run the project:

- **With Docker**: Clone the **entire project** (`docker` and `src`).
- **Without Docker**: You only need to work with the `src` directory. You can ignore the `docker` folder entirely.

---

## 🛣️ Running PeriChat with Docker

To get started with **PeriChat** using Docker, follow the steps below:

### 📅 1. Clone the Repository

```bash
git clone https://github.com/khalidHayKay/PeriChat
cd PeriChat
```

Make sure you’re at the root of the project directory (where the `README.md` is located).

---

### ⚙️ 2. Set Up Docker Environment

Navigate to the Docker setup directory:

```bash
cd docker
```

Run the containers in detached mode:

```bash
docker compose up -d
```

> This command will pull and build all the necessary images for the application, including:
>
> - PHP
> - Composer
> - Node.js
> - MySQL
> - Nginx

---

### 🛠️ 3. Application Setup Inside the Container

Get a bash terminal inside the running container:

```bash
docker compose exec -it app bash
```

From this shell, you'll be able to run `php`, `npm`, and other commands. Then:

1. Duplicate the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Generate the application key:

   ```bash
   php artisan key:generate
   ```

3. Update your `.env` file with your desired configuration.

4. Migrate and seed the database:

   ```bash
   php artisan migrate:fresh --seed
   ```

5. Start Laravel Reverb (WebSocket server for real-time chat):

   ```bash
   php artisan reverb:start
   ```

---

### 🧱 4. Build Frontend Assets

In a **new terminal**, again run:

```bash
docker compose exec -it app bash
```

Then:

```bash
npm install
npm run dev
```

> This will compile and serve your frontend assets using Vite.

---

### 🌐 5. Access the App

Once everything is running, open your browser and go to:

```
http://localhost:8000
```

Log in using the demo credentials:

| Email                                       | Password |
| ------------------------------------------- | -------- |
| [john@example.com](mailto:john@example.com) | 123456   |
| [jane@example.com](mailto:jane@example.com) | 123456   |

---

## 🖥️ Running Without Docker (XAMPP or Laravel Starter Kit)

If you'd prefer to run the app without Docker:

1. Pull only the `/src` directory from the repository.

2. Ensure your environment includes:

   - **PHP**
   - **Node.js & npm**
   - **Composer**
   - **MySQL**
   - **Apache** (or any other web server)

3. Set up your `.env` file and follow the typical Laravel setup:

   - Install dependencies via `composer install` and `npm install`.
   - Run database migrations and seeders.
   - Run `npm run dev` to compile assets.
   - Serve the project using `php artisan serve` or through your web server.

---
