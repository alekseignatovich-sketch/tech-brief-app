import json
import logging
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
import os

# Получаем токен из переменных окружения (Railway)
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEB_APP_URL = os.getenv("WEB_APP_URL", "https://your-mini-app.vercel.app")

if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN не установлен в переменных окружения!")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    kb = InlineKeyboardBuilder()
    kb.button(
        text="❄️ Создать ТехЗадание",
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    await message.answer(
        "Привет! Я — ProjectKitten AI 🐾\n\n"
        "Помогу создать цифровой продукт под тебя:\n"
        "• Шаблоны • Разукрашки • Боты • Курсы\n\n"
        "Нажми ниже 👇",
        reply_markup=kb.as_markup()
    )

@dp.message(lambda msg: msg.web_app_data)
async def handle_webapp_data(message: types.Message):
    try:
        data = json.loads(message.web_app_data.data)
        user_id = message.from_user.id
        username = message.from_user.username or "anonymous"

        # Простая генерация ответа (в реальности — вызов LLM)
        title = f"AI-продукт для {data.get('brand_name', 'тебя')}"
        description = (
            f"Готовый цифровой продукт в стиле '{data.get('design_style', 'нейтральном')}'.\n"
            f"Включает: {', '.join([s['name'] for s in data.get('services', [])][:2] or ['услуги'])}.\n\n"
            "Скоро пришлю демо! 🚀"
        )

        await message.answer(f"✅ Отлично, {username}!\n\n**{title}**\n\n{description}", parse_mode="Markdown")

        # Здесь можно сохранить data в базу или отправить в LLM
        print(f"[LOG] Получено ТЗ от {user_id}: {json.dumps(data, indent=2, ensure_ascii=False)}")

    except Exception as e:
        logging.error(f"Ошибка обработки данных: {e}")
        await message.answer("❌ Не удалось обработать ТЗ. Попробуй ещё раз.")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
