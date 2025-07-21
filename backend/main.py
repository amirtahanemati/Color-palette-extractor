from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import io
from typing import List, Tuple
import logging

app = FastAPI(title="color palette extractor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])


async def extract_colors(image: Image.Image, n_colors: int = 5) -> List[dict]:
    try:
        # تغییر اندازه تصویر برای بهینه‌سازی
        image = image.resize((150, 150))
        image = image.convert('RGB')
        pixels = np.array(image).reshape(-1, 3)

        # بررسی تعداد رنگ‌های منحصربه‌فرد
        unique_colors = len(np.unique(pixels, axis=0))
        effective_n_colors = min(
            n_colors, unique_colors) if unique_colors > 0 else 1

        # اگه تنوع رنگی کم باشه، تعداد خوشه‌ها رو تنظیم کن
        if effective_n_colors < n_colors:
            logger.info(
                f"تنوع رنگی کم است، تعداد خوشه‌ها به {effective_n_colors} کاهش یافت")

        # اجرای الگوریتم KMeans
        kmeans = KMeans(n_clusters=effective_n_colors, random_state=42)
        kmeans.fit(pixels)

        # استخراج رنگ‌های غالب و حذف تکرارها
        colors = kmeans.cluster_centers_.astype(int)
        unique_colors_list = [tuple(color) for color in colors]
        unique_colors_list = list(dict.fromkeys(
            unique_colors_list))  # حذف تکرارها
        return [
            {
                "rgb": [int(c) for c in color],
                "hex": rgb_to_hex(tuple(int(c) for c in color))
            } for color in unique_colors_list
        ]
    except Exception as e:
        logger.error(f"خطا در پردازش تصویر: {str(e)}")
        raise HTTPException(status_code=500, detail="خطا در پردازش تصویر")


@app.post("/extract-colors/")
async def extract_colors_endpoint(file: UploadFile = File(...)):
    try:
        # بررسی نوع فایل
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400, detail="فایل ارسالی باید تصویر باشد")

        # خواندن تصویر
        content = await file.read()
        image = Image.open(io.BytesIO(content))

        # بررسی اندازه فایل (حداکثر 10MB)
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, detail="فایل تصویر بیش از حد بزرگ است")

        # استخراج رنگ‌ها
        colors = await extract_colors(image)
        return {"colors": colors}

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"خطا در آپلود فایل: {str(e)}")
        raise HTTPException(status_code=500, detail="خطای سرور")
