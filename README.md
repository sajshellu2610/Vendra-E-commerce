# Vendra — React E-commerce (Sprint 1: User Application)

A React + Redux Toolkit frontend using JSON Server as a mock REST API.

## Requirements
- Node.js 20+
- npm

## Run locally

Open the project folder in VS Code, then run:

```bash
npm install
cp .env.example .env
```

Terminal 1 — start the API:

```bash
npm run server
```

Terminal 2 — start React:

```bash
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## API resources
- `GET /products`, `GET /products/:id`
- `GET /users`, `POST /users`
- `GET /orders`, `GET /orders?userId=:id`, `POST /orders`

The frontend uses Axios service modules and `VITE_API_URL`; components do not call JSON Server directly.

## Add your own product images
1. Put image files in `public/images/`.
2. In `db.json`, update each product's `image` field, for example:
   `"image": "/images/nova-x-pro.jpg"`
3. Restart JSON Server if needed (it usually watches `db.json` automatically).

The UI has a product-image frame and a fallback if an image is missing. Use product photos you own or have permission to use.

## Demo authentication note
This is a learning project backed by JSON Server, not production authentication. Passwords are stored in the mock database for demonstration only. Never use this approach for a real store. A production app needs a secure backend, password hashing, HTTPS, authorization and server-side validation.

## Sprint 2
The admin panel is intentionally not included in this Sprint 1 starter. Add it as a separate admin layout with role-protected product/order CRUD after the user flow is complete.
