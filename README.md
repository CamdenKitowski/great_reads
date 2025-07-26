# Great Reads <img width="16" height="16" alt="favicon" src="https://github.com/user-attachments/assets/88f14502-ae81-49aa-8f75-1dad1da0cd13" />

**Website:** https://great-reads-bookshelf.vercel.app/

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Usage](#usage)
- [Why did I build this](#Why-did-I-build-this)

## Project Overview

Great Reads is a web application designed for book enthusiasts to organize and track their reading journey. Users can create an account, search for books using the Open Library API, and manage personalized bookshelves for books they _want to read_, are _currently reading_, or have _completed_. Each book has a dedicated notes page for summaries or general notes, making it a consolidated location for tracking books and their respective notes.

The project showcases a modern full-stack architecture with a React frontend and a Node.js backend, deployed seamlessly on Vercel. It emphasizes secure user authentication, efficient API integration, and a responsive UI.

## Features

- **User Authentication**:
  - Sign up and log in with email and password using Supabase.
  - Password reset via email using Supabase
- **Book Search**:
  - Search for books using the Open Library API via the top navigation bar.
  - Display book details, including title, author, and cover image. If cover image is not displayed, exhibit Great Reads cover image.
- **Bookshelf Management**:
  - Organize books into three categories: Wishlist, Reading, Done.
  - View books in a grid layout with clickable cards for each bookshelf.
  - Add or remove books from bookshelves.
- **Book Notes**:
  - Create and edit notes for each book using a rich text editor (Tiptap).
  - Persist notes in the backend for user-specific access.
- **Responsive Design**:
  - Mobile-friendly UI with Material-UI components for navigation and menus.
  - Seamless navigation with React Router.
- **Secure API**:
  - Backend API endpoints to request resources per specific user requests. Create, read, update, delete user books, status, notes, etc.
  - All Supabase keys are hidden due to separate of frontend and backend via vercel.

## Architecture

Great Reads is a full-stack web application with a clear separation of concerns:

- **Frontend** (`frontend/`):
  - Built with **React.js** and **Vite** for fast development and optimized builds.
  - Uses **React Router** for client-side routing and **Material-UI** for UI components.
  - Manages state with React Context (e.g., `AuthContext`, `BookContext`).
  - Communicates with the backend via relative API URLs (e.g., `/api/auth/signout`).

- **Backend** (`backend/`):
  - Built with **Node.js** and **Express.js**, deployed as Vercel serverless functions.
  - Integrates with **Supabase** for authentication and database management.

## Usage

1. **Sign Up/Log In**:
   - Navigate to `https://great-reads-bookshelf.vercel.app` and create an account or log in.

2. **Search Books**:
   - Use the top search bar to find books via the Open Library API.
   - Click `Move to Bookshelf` on a book’s details page, then select a bookshelf (Wishlist, Reading, or Done) to add the book to that category.

3. **Manage Bookshelves**:
   - Access bookshelves via the `Bookshelf` menu in the navigation bar.
   - View books in `Wishlist`, `Reading`, or `Done` categories.
   - Add or delete books from each shelf.

4. **Take Notes**:
   - Click a book on a bookshelf, and click on a notes button for a book to access its notes page.
   - Write and save notes using the rich text editor.

5. **Log Out**:
   - Click the profile initial in the top-right navigation bar.
   - Select “Log out” to clear your session and redirect to the homepage.


<img width="1674" height="779" alt="Screenshot 2025-07-26 at 3 36 18 PM" src="https://github.com/user-attachments/assets/0713719b-5310-4b21-90b7-6c81bc3cce4e" />

Each bookshelf displays the books for that category, and each book has a dedicated notes page.

<img width="1655" height="790" alt="Screenshot 2025-07-26 at 3 35 28 PM" src="https://github.com/user-attachments/assets/5f96d076-b63c-4037-a550-1f76fede833e" />

## Why did I build this?
As an avid reader, I wanted a consolidated, visually appealing solution to manage my reading lists and book notes. Previously, I tracked books that I want to read and have finished in an Excel spreadsheet, which became cluttered and unappealing. I also maintained notes and reflections for each book in a Google Document, but it grew long and disorganized. I needed a single, consolidated platform to organize my books and their corresponding notes privately. Inspired by Goodreads but frustrated by its lack of a dedicated, private notes section—offering only public comments or posts—I built Great Reads, a web application tailored to my needs as a passionate reader, providing a clean, intuitive interface to manage my reading journey and personal notes in one place.
