import json
import logging
import asyncio
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.utils.markdown import hbold, hcode

# === ЖЁСТКО ЗАДАННЫЙ АДМИН ID (твой) ===
YOUR_ADMIN_ID = 1300197924  # Alekseyigna

# === ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ ===
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEB_APP_URL = os.getenv("WEB_APP_URL", "https://your-mini-app.up.railway.app")

if not BOT_TOKEN:
    raise ValueError("❌ BOT_TOKEN не установлен в Railway!")

print(f"[INFO] ✅ Бот запущен. Админ: {YOUR_ADMIN_ID}")

# === ИНИЦИАЛИЗАЦИЯ ===
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    kb = InlineKeyboardBuilder()
    kb.button(
        text="❄️ Создать бриф",
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    await message.answer(
        "Привет! Я — ProjectKitten AI 🐾\n\n"
        "Заполни короткий бриф — и я помогу создать идеальный цифровой продукт под твою аудиторию.",
        reply_markup=kb.as_markup()
    )

@dp.message(lambda msg: msg.web_app_data)
async def handle_webapp_data(message: types.Message):
    try:
        data = json.loads(message.web_app_data.data)
        user = message.from_user

        # === Ответ пользователю ===
        goals = ", ".join(data.get("goal", [])) or "не указано"
        products = ", ".join(data.get("product_type", [])) or "не указано"
        
        await message.answer(
            f"✅ Спасибо, {user.first_name}!\n\n"
            f"Твой бриф принят. Вот краткое резюме:\n\n"
            f"🎯 Цель: {goals}\n"
            f"📦 Формат: {products}\n\n"
            f"Скоро пришлю демо-версию! 🚀"
        )

        # === Уведомление админу ===
        print(f"[DEBUG] Отправляю уведомление админу {YOUR_ADMIN_ID}...")
        brief_text = (
            f"📥 {hbold('Новый бриф')} от @{user.username or '—'} (ID: {user.id})\n\n"
            f"👤 Имя: {user.full_name}\n"
            f"🎯 Цель: {', '.join(data.get('goal', [])) or '—'}\n"
            f"💼 Бизнес: {data.get('business_type', '—')}\n"
            f"📦 Продукт: {', '.join(data.get('product_type', [])) or '—'}\n"
            f"🌍 Аудитория: {data.get('audience_geo', '—')}\n"
            f"🎨 Стиль: {data.get('design_style', '—')}\n"
            f"💬 Тон: {data.get('tone', '—')}\n"
            f"📅 Дедлайн: {data.get('deadline', '—')}\n"
            f"💰 Бюджет: {data.get('budget', '—')}\n\n"
            f"{hbold('Полные данные:')}\n{hcode(json.dumps(data, indent=2, ensure_ascii=False))}"
        )

        await bot.send_message(
            chat_id=YOUR_ADMIN_ID,
            text=brief_text,
            parse_mode="HTML"
        )
        print("[SUCCESS] Уведомление успешно отправлено!")

    except Exception as e:
        error_msg = f"❌ Ошибка: {e}"
        logging.error(error_msg)
        print(error_msg)
        await message.answer("⚠️ Произошла ошибка. Разработчик уже уведомлён.")

# === ФИКТИВНЫЙ HTTP-СЕРВЕР ДЛЯ RAILWAY ===
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler

class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

def run_health_server():
    port = int(os.getenv("PORT", 8080))
    server = HTTPServer(("0.0.0.0", port), HealthHandler)
    server.serve_forever()

# === ЗАПУСК ===
async def main():
    # Запускаем health-сервер
    health_thread = threading.Thread(target=run_health_server, daemon=True)
    health_thread.start()
    
    logging.info("🤖 ProjectKitten AI запущен!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
