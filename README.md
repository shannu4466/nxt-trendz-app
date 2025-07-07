# 🛍️ Nxt Trendz App

A full-stack e-commerce-style application built with **React** on the frontend and **Node.js/Express** on the backend. This project includes a responsive UI, routing, secure API handling, and modern development tools.

---

## 📦 Installation

To get started, clone the repository and install dependencies for the entire project.

```bash
npm install
```

> This will install any root-level dependencies. Make sure to also install dependencies inside both the `frontend` and `backend` folders separately if they have their own `package.json`.

---

## 🚀 Running the Application

The frontend and backend run independently in two different terminals.

### 🖥️ Start the Frontend

```bash
cd frontend
npm install        # Only needed the first time
npm start
```

This will start the React app at [http://localhost:3000](http://localhost:3000)

---

### 🛠️ Start the Backend

```bash
cd backend
npm install        # Only needed the first time
nodemon app.js
```

This will start the backend server at [http://localhost:5000](http://localhost:5000) or whichever port is configured.

> Make sure `nodemon` is installed globally:
```bash
npm install -g nodemon
```

---

## 🧾 Project Structure

```
nxt-trendz-app/
│
├── frontend/            # React frontend application
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/             # Node.js/Express backend API
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── app.js
│
├── package.json         # Root config (if used)
└── README.md
```

---

## 📋 Prerequisites

Before running the app, ensure you have:

- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) (v6 or above)
- MongoDB (if your backend uses a database)
- Internet connection for package installation

---

## 🔧 Environment Variables

If your backend requires environment variables (e.g., DB URI, API keys), create a `.env` file inside the `backend` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

> Add `.env` to `.gitignore` to prevent sensitive info from being pushed.

---

## 🧪 Testing

To run tests (if configured):

```bash
npm test
```

Or individually inside `frontend`/`backend`.

---

## 🙌 Contributing

Contributions are welcome!  
Feel free to open issues, submit PRs, or suggest improvements.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
