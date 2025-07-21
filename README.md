# 🎨 Color Palette Extractor | استخراج پالت رنگ از تصویر

A web application to extract dominant colors from uploaded images using KMeans clustering. Built with **FastAPI**, **TailwindCSS**, **Docker**, and **Nginx**.

یک اپلیکیشن تحت وب برای استخراج رنگ‌های غالب تصویر با استفاده از الگوریتم خوشه‌بندی KMeans. ساخته‌شده با **FastAPI**، **TailwindCSS**، **Docker** و **Nginx**.

---

## 🌐 Features | ویژگی‌ها

- Upload image and extract dominant colors  
  آپلود تصویر و استخراج پالت رنگی
- Fast and optimized color clustering using `scikit-learn`  
  خوشه‌بندی سریع رنگ‌ها با `scikit-learn`
- Beautiful and responsive UI with TailwindCSS  
  رابط کاربری زیبا و واکنش‌گرا با TailwindCSS
- Dockerized for easy deployment  
  داکری‌شده برای اجرای ساده در هر سروری
- Nginx reverse proxy for routing frontend and API  
  پراکسی معکوس با Nginx برای اتصال UI و بک‌اند

---

## 📁 Project Structure | ساختار پروژه

```bash
color-palette-extractor/
├── backend/              # FastAPI server (image processing)
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
├── frontend/             # HTML + TailwindCSS + JS
│   ├── index.html
│   ├── favicon.ico
│   ├── styles.css
│   ├── script.js
│   ├── Dockerfile
├── nginx/                # Nginx configuration
│   ├── nginx.conf
├── docker-compose.yml    # Multi-container orchestration
├── README.md              # This file

🚀 How to Run | نحوه اجرای پروژه
✅ Prerequisites | پیش‌نیازها
Docker

Docker Compose

🛠 Steps | مراحل اجرا
```bash
# Clone the repo
git clone https://github.com/amirtahanemati/color-palette-extractor.git
cd color-palette-extractor

# Build and run the project
docker-compose up --build
```

Now open your browser and visit:
http://localhost

اکنون مرورگر را باز کرده و به آدرس زیر بروید:
http://localhost


🧪 API Endpoint
POST /extract-colors/
Payload: Multipart form (file: image)

Response:

```json
{
  "colors": [
    { "rgb": [255, 0, 0], "hex": "#ff0000" },
    { "rgb": [0, 255, 0], "hex": "#00ff00" }
  ]
}
```

## 📦 Technologies Used | تکنولوژی‌های استفاده‌شده

| Tech           | توضیح / Description            |
| -------------- | ------------------------------ |
| **FastAPI**        | Python backend API             |
| **Pillow**         | Image processing               |
| **scikit-learn**   | KMeans color clustering        |
| **Tailwind CSS**   | Frontend styling               |
| **Vanilla JS**     | Image upload & interaction     |
| **Nginx**          | Reverse proxy & static hosting |
| **Docker Compose** | Multi-service deployment       |

## 🧠 Future Ideas | ایده‌های آینده
-Save color palettes to user profiles

-Support image URLs (not just upload)

-Advanced color analysis (saturation, hue sorting)

-Theme generation from image

---
## 📜 License

This project is proprietary and all rights are reserved by the developer. Unauthorized use, modification, or distribution of this project without explicit permission from the developer is prohibited. For any usage requests, please contact [@amirtahanemati](https://github.com/amirtahanemati).

---

## 👨‍💻 Developer

- **Lead Developer**: Amirtaha nemati
- **GitHub**: [@amirtahanemati](https://github.com/amirtahanemati)
- **Email**: amirtahanemati0@gmail.com



