# **📝 Note-Taking Web App**

A full-stack **Note-Taking Web Application** built using **Next.js**, **Express.js**, and **MongoDB**. Users can **register, log in, create, edit, delete, and search notes** securely with authentication handled via JWT.

---

## **🚀 Features**

* 🔐 **Authentication**: User signup, login, and logout (JWT-based)  
* 📝 **Note Management**: Create, edit, delete, and search notes  
* ⭐ **Favorite Notes**: Mark notes as favorites  
* 📤 **Upload text file**: Attach file to notes   
* 🌐 **Full-Stack**: Next.js frontend \+ Express.js backend \+ MongoDB database

---

## **🛠️ Tech Stack**

* **Frontend**: Next.js, Tailwind CSS  
* **Backend**: Express.js, Node.js, MongoDB  
* **Authentication**: JWT (JSON Web Tokens)  
* **Database**: MongoDB (Mongoose ODM)

---

## **📦 Installation & Setup**

### **1️⃣ Clone the Repository**

git clone https://github.com/shubhamprasad318/note-app.git  
cd note-app

### **2️⃣ Backend Setup**

#### **Install Dependencies**

cd backend  
npm install

#### **Create a `.env` File**

Create a `.env` file in the `backend` directory and add:

PORT=5000  
MONGO\_URI=your\_mongodb\_connection\_string  
JWT\_SECRET=your\_secret\_key  
CLIENT\_URL=http://localhost:3000  
NODE\_ENV=development

#### **Start the Backend Server**

node server.js

### **3️⃣ Frontend Setup**

#### **Install Dependencies**

npm install

#### **Create a `.env.local` File**

Create a `.env.local` file in the `root` directory and add:

NEXT\_PUBLIC\_API\_URL=http://localhost:5000

#### **Start the Frontend**

npm run dev  
---

## **📌 API Routes**

| Method | Endpoint | Description | Protected |
| ----- | ----- | ----- | ----- |
| POST | /register | Register a new user | ❌ No |
| POST | /login | User login | ❌ No |
| POST | /logout | User logout | ✅ Yes |
| GET | /notes | Get all notes | ✅ Yes |
| POST | /notes | Create a new note | ✅ Yes |
| PUT | /notes/:id | Update a note | ✅ Yes |
| DELETE | /notes/:id | Delete a note | ✅ Yes |

---

## **🛠️ Future Enhancements**

* 📸 **Image Upload Support**  
* 📌 **Drag & Drop Notes**  
* 📱 **Mobile Responsiveness**

---

## **🤝 Contributing**

1. Fork the repo  
2. Create a new branch (`feature/new-feature`)  
3. Commit your changes  
4. Push to your fork  
5. Submit a pull request\!

---

## **📬 Contact**

* GitHub: [@yourusername](https://github.com/yourusername)  
* Email: your.email@example.com

