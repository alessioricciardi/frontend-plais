# PLAIS Frontend

A frontend web application built with **Nuxt 3.0** and **Vue.js**, providing the user interface for the website of **the Polish Chapter of the Association for Information Systems.**

# Table of Contents

- **[Getting Started](#getting-started)**
- **[Installing](#installing)**
- **[Project Overview](#project-overview)**
- **[Project Structure](#project-structure)**
- **[Pages](#pages)**
- **[Components](#components)**
- **[Composables](#composables)**
- **[Layouts](#layouts)**

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

# Installing

## 1. Clone the repository:

```bash
git clone https://github.com/alessioricciardi/frontend-plais.git
```

## 2. Install dependencies:

```bash
cd frontend-plais
npm install
```

## 3. Create a .env file in the project root with the API URL:

**Note that the API needs to run over HTTPS protocol**

```env
API_URL='https://localhost:5000'
```

## 4. Install SSL certificates for the Nuxt Dev Server:

Authentication uses HTTP-only cookies, an SSL certificate is required for secure cookie transmission and proper functionality.

To enable the Nuxt development server to run on HTTPS, follow these steps:

### 1. Download and install the **mkcert** tool:

Download `mkcert` from:  
[https://github.com/FiloSottile/mkcert/releases](https://github.com/FiloSottile/mkcert/releases)

### 2. Install the Local Certificate Authority (CA):

```bash
mkcert -install
```

### 3. Generate certificates for _localhost_:

```bash
mkcert localhost
```

This will generate two certificate files which should be placed in your project root directory.

## 5. Run the development server:

```bash
npm run dev
```

## 6. Open the project in browser:

> https://localhost:3000

# Project Overview

This Nuxt 3 frontend project is the official website for [PLAIS – the Polish Chapter of the Association of Information Systems](https://plais.ug.edu.pl). The application provides both a public-facing website for visitors and a secure CMS for administrators to manage content.

### Key Features:

- **Public Pages:** Display organizational information, events, achievements, resources, executive board, and historical overview.

- **CMS (Content Management System):** Available only to authenticated users for editing content on pages

- **Authentication:** Secure login system with HTTP-only cookies ensures that CMS access is restricted to authorized users.

- **Responsive Design:** The site is fully responsive and optimized for both desktop and mobile devices.

- **Admin Panel:** Allows site administrators to manage other admins and control access to CMS content.

### Pages:

- **Index:** Main Page with image carousel, PLAIS description, latest events and bulletin, memorial for Prof. Wrycza - creator of PLAIS and achievements

- **Bulletin:** List of bulletin articles

- **Events:** List of events with links

- **Executive Board:** List of executives

- **Members:** Responsive table of current and founding members

- **Resources:** Categories and external links to articles/websites

- **History:** Historical overview of PLAIS

- **Bylaws:** Legal aspects of the organization

- **Login:** Login panel for administrators to access CMS

- **Admin/Panel:** Admin panel for managing site administrators

### Tech Stack:

- **Framework:** Nuxt 3 (Vue 3)
- **Styling:** Tailwind CSS, DaisyUI
- **Environment Variables:** `.env` file for API URL

# Project Structure

```
frontend-plais/
├─ assets/                  # Contains global styles used across the project
│   ├─ css/
│       └─ main.css
│
├─ components/              # Reusable Vue components organized by feature
│   ├─ Admin/
│   │   ├─ User/
│   │   │   └─ Editor.vue
│   │   └─ Panel.vue
│   ├─ Bulletin/
│   │   ├─ Article.vue
│   │   └─ ArticleEditor.vue
│   ├─ Event/
│   │   ├─ Group/
│   │   │   ├─ Display.vue
│   │   │   └─ Editor.vue
│   │   ├─ AddGroupOrEvent.vue
│   │   ├─ Card.vue
│   │   └─ Editor.vue
│   ├─ ExecutiveBoard/
│   │   ├─ Cadence/
│   │   │   ├─ Editor.vue
│   │   │   └─ Separator.vue
│   │   ├─ Member/
│   │   │   ├─ Editor.vue
│   │   │   └─ Member.vue
│   │   └─ AddCadenceOrMember.vue
│   ├─ Home/
│   │   ├─ Achievement/
│   │   │   ├─ Achievement.vue
│   │   │   ├─ BigImage.vue
│   │   │   ├─ Carousel.vue
│   │   │   └─ Editor.vue
│   │   ├─ Carousel.vue
│   │   ├─ News.vue
│   │   └─ TextEdit.vue
│   ├─ Login/
│   │   └─ Form.vue
│   ├─ Member/
│   │   ├─ Editor.vue
│   │   ├─ Switch.vue
│   │   └─ Table.vue
│   ├─ Modal/
│   │   └─ Confirm.vue
│   ├─ Navbar/
│   │   ├─ BecomeMember.vue
│   │   ├─ Button.vue
│   │   ├─ Navbar.vue
│   │   └─ Slideover.vue
│   ├─ Resources/
│   │   ├─ Group/
│   │   │   ├─ Add.vue
│   │   │   └─ Editor.vue
│   │   ├─ CategoryEditor.vue
│   │   ├─ Link.vue
│   │   └─ Panel.vue
│   ├─ Tiptap/
│   │   ├─ Button.vue
│   │   ├─ Editor.vue
│   │   └─ ImageView.vue
│   └─ SiteFooter.vue
│
├─ composables/              # Reusable logic and utilities
│   ├─ useFetchError.ts      # Displays a global toast when fetch fails
│   └─ useDeleteUnusedPhotos.ts # Sends delete requests for unused images
│
├─ layouts/                  # Defines base layout templates
│   ├─ default.vue           # Main layout with navbar and footer
│   └─ admin.vue             # Minimal layout for admin panel
│
├─ pages/                    # Nuxt pages (file-based routing)
│   ├─ admin/
│   │   └─ panel.vue         # Admin management panel
│   ├─ bulletin/
│   │   ├─ [id].vue          # Single bulletin view
│   │   └─ index.vue         # Bulletin list
│   ├─ bylaws.vue            # Legal aspects of the organization
│   ├─ events.vue            # List of events
│   ├─ executive-board.vue   # Executive board members
│   ├─ history.vue           # PLAIS history
│   ├─ index.vue             # Homepage with news and carousel
│   ├─ login.vue             # Login panel
│   ├─ members.vue           # Founding and current members table
│   └─ resources.vue         # External resource links
│
├─ public/                   # Public assets (images)
│
├─ types/
│   └─ index.ts              # TypeScript definitions used in components
│
├─ nuxt.config.ts            # Main Nuxt configuration
├─ package.json              # Dependencies and scripts
└─ .env                      # Environment variables (API_URL)
```

# Pages

- **index.vue** – Homepage with carousel, news, and achievements.
- **events.vue** – Displays a list of events with links.
- **executive-board.vue** – Lists all executive board members.
- **history.vue** – PLAIS history with editable CMS sections.
- **members.vue** – Table of current and founding members.
- **resources.vue** – Categorized external resource links.
- **login.vue** – Login panel for administrators.
- **bylaws.vue** – Legal aspects of the organization with CMS.
- **bulletin/index.vue** – List of all bulletins.
- **bulletin/[id].vue** – Detailed view of a single bulletin.
- **admin/panel.vue** – Admin panel for managing administrators.

# Components

Reusable Vue components organized by feature:

### **Admin/**
Components related to the admin panel and user management.
- **Panel.vue** – Main view of the admin management dashboard.  
- **User/Editor.vue** – Form for editing user data.

### **Bulletin/**
Components for managing the PLAIS bulletin.
- **Article.vue** – Displays a single bulletin article.  
- **ArticleEditor.vue** – CMS editor for creating or updating bulletin articles.

### **Event/**
Components used to display and manage events and event groups.
- **AddGroupOrEvent.vue** – Form or modal for adding a new event or event group.  
- **Card.vue** – Compact event card displaying title, date, and description.  
- **Editor.vue** – Main event editor for titles, descriptions, and media content.  
- **Group/Display.vue** – Displays the details of an event group.  
- **Group/Editor.vue** – Editor for event group details (name, description, related events).

### **ExecutiveBoard/**
Components for displaying and editing executive board members and cadences.
- **AddCadenceOrMember.vue** – Form for adding a new board cadence or member.  
- **Cadence/Editor.vue** – Editor for cadence details.  
- **Cadence/Separator.vue** – Visual divider between cadences in the layout.  
- **Member/Editor.vue** – Editor for member data.  
- **Member/Member.vue** – Displays an executive board member).

### **Home/**
Components related to the homepage, news, and CMS-managed sections.
- **Achievement/**
  - **Achievement.vue** – Displays a single achievement item.  
  - **BigImage.vue** – Fullscreen image expander for the achievements section.  
  - **Carousel.vue** – Image carousel for single achievement.  
  - **Editor.vue** – CMS editor for achievements.  
- **Carousel.vue** – Main homepage image slider.  
- **News.vue** – News feed displaying recent PLAIS updates.  
- **TextEdit.vue** – CMS text editor for homepage sections (e.g., PLAIS description, memorial for Prof. Stanisław Wrycza).

### **Login/**
Components related to user authentication.
- **Form.vue** – Login form for user authentication.

### **Member/**
Components related to displaying and editing PLAIS members.
- **Editor.vue** – Form for editing member details.  
- **Switch.vue** – Toggle component for switching between views or modes (e.g., current vs. founding members).  
- **Table.vue** – Table listing all members with their details.

### **Modal/**
Modal component used across the app for confirmation for delete actions
- **Confirm.vue** – Confirmation dialog for delete action.

### **Navbar/**
Navigation bar components for desktop and mobile.
- **Navbar.vue** – Main navigation bar with links.  
- **Button.vue** – Reusable button component used in the navbar.  
- **BecomeMember.vue** – Call-to-action component leading to the membership form.  
- **Slideover.vue** – Mobile slide-over navigation menu.

### **Resources/**
Components managing external resources and categories.
- **Panel.vue** – Resource management panel (categories).  
- **Link.vue** – Displays a single resource link.  
- **CategoryEditor.vue** – CMS editor for resource categories.  
- **Group/Add.vue** – Form for adding a new resource group.  
- **Group/Editor.vue** – Editor for resource group details.

### **Tiptap/**
Rich-text editor components integrated with Tiptap.
- **Editor.vue** – Main Tiptap editor instance.  
- **Button.vue** – Toolbar button for formatting actions (bold, italic, etc.).  
- **ImageView.vue** – Image preview and upload component inside the editor.

### **SiteFooter.vue**
Global footer displayed on all pages (contact info, social links, copyright).

# Composables

- **useFetchError.ts** – Shows a global toast when fetch requests fail.
- **useDeleteUnusedPhotos.ts** – Informs backend to delete unused images.

# Layouts

- **default.vue** – Main layout with navbar and footer.
- **admin.vue** – Minimal layout for admin panel pages.
