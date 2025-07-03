# MERN Blog App with GraphQL and Apollo Client

This is a full-stack blog application built with:

- **MongoDB** for the database  
- **Express.js** as backend framework  
- **React** (Vite + TypeScript) as the frontend  
- **Node.js** server with **GraphQL**  
- **Apollo Client** for state and data management  

---

## 🚀 Features

- User authentication with JWT  
- Create, edit and delete blog posts  
- Profile pages with user-specific posts  
- Image uploads for avatars and posts  
- Theme switch (light/dark mode)  
- Responsive design with hamburger menu for mobile  
- Toast notifications using `react-hot-toast`  
- Apollo cache update using `refetchQueries` after post creation  

---

## 🔧 Tech Stack

| Tech             | Used For                        |
|------------------|---------------------------------|
| React + Vite     | Frontend UI                     |
| Apollo Client    | GraphQL queries & cache handling|
| Express.js       | Backend server                  |
| GraphQL + Apollo Server | API and resolvers         |
| MongoDB + Mongoose | Database                      |
| Tailwind CSS + DaisyUI     | Styling                         |
| React Router     | Routing                         |
| react-hot-toast  | Toast notifications             |

---

## 📦 Setup Instructions

### Backend

1. Navigate to the backend folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   MONGODB_URI=your-mongodb-url
   JWT_SECRET=your-secret-key
   ORIGIN=http://localhost:5173( for cors )
   IMAGEKIT_DATA=...
   ```

4. Start the backend server:
   ```bash
   npm run start
   ```

---

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

---

## 🔄 Apollo Cache Handling

After creating a post, we ensure the frontend shows the updated post list immediately using:

```ts
refetchQueries: [{ query: GET_POSTS }, { query: GET_USER_POSTS }]
```

This makes Apollo re-fetch the latest data from the server and update the cache accordingly.

Alternatively, the cache could be manually updated using `cache.modify()` — but `refetchQueries` is simpler and ideal for many use cases.

---

## ✅ Optional Improvements

- Add pagination or infinite scrolling  
- Post editing and deletion  
- Comment system  
- Image compression before upload  
- Better accessibility (a11y)  

---

## 📸 Demo

[GQL MERN Blog](https://gql-blog.vercel.app/)
---

## 📄 License

MIT

---

## 👨‍💻 Author

Built with ❤️ by [FullstackCommander]
