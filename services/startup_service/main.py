import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict

DATA_FILE = Path(__file__).parent / "startups_data.json"

app = FastAPI(
    title="NavDU Startups & Leaderboard Service",
    version="1.0.0",
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Founder(BaseModel):
    name: str
    role: str
    avatar: str
    faculty: str
    telegram: Optional[str] = None

class StartupModel(BaseModel):
    id: str
    name: str
    tagline: str
    fullDescription: str
    problem: str
    solution: str
    category: str
    stage: str
    batch: str
    founders: List[Founder]
    upvotes: int
    logo: str
    raisedAmount: Optional[str] = None
    pitchDeckUrl: Optional[str] = None
    metrics: Dict[str, Optional[str]] = {}
    tags: List[str] = []

# Initial In-Memory / Preloaded Dataset
STARTUPS_DB: Dict[str, StartupModel] = {
    "1": StartupModel(
        id="1",
        name="Business Robots AI",
        tagline="Kichik va o‘rta bizneslar uchun avtomatlashtirilgan AI-menejerlar platformasi",
        fullDescription="Savdo, mijozlarga xizmat ko‘rsatish va CRM operatsiyalarini 24/7 avtonom boshqaruvchi sun’iy intellekt agentlari ekotizimi.",
        problem="O‘zbekistondagi 100,000 dan ortiq kichik bizneslar operatorlar yetishmovchiligi sababli tunda va dam olish kunlarida mijozlarning 45% ini yo‘qotadi.",
        solution="Telegram, Instagram va veb-saytga 5 daqiqada ulanuvchi, to‘liq o‘zbek tilida so‘zlashuvchi AI-robotlar.",
        category="AI & EdTech",
        stage="Traction",
        batch="3-Mavsum (2026)",
        founders=[
            Founder(name="Bekzod Shukurov", role="CEO & AI Muhandis", avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300", faculty="Axborot texnologiyalari", telegram="@bekzod_ai")
        ],
        upvotes=0,
        logo="🤖",
        raisedAmount="$0",
        metrics={"users": "0 Korxona", "revenue": "$0 MRR"},
        tags=["AI", "B2B", "SaaS"]
    ),
    "2": StartupModel(
        id="2",
        name="AgroSmart Drip (NavDU)",
        tagline="Navoiy va Qizilqum hududi uchun sun’iy intellektga asoslangan aqlli tomchilatib sug‘orish",
        fullDescription="IoT datchiklari orqali tuproq namligi va havo haroratini real vaqtda o‘lchab, suv sarfini 50% ga qisqartiruvchi apparat-dasturiy majmua.",
        problem="Navoiy viloyatida suv tanqisligi sababli fermer xo‘jaliklarining hosildorligi 30% ga pasaymoqda.",
        solution="Quyosh batareyalarida ishlovchi avtonom klapanlar va sun’iy intellektli suv taqsimlash algoritmi.",
        category="AgroTech & Eco",
        stage="MVP",
        batch="3-Mavsum (2026)",
        founders=[
            Founder(name="Sanjar Qodirov", role="Texnik Asoschi", avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", faculty="Fizika-matematika", telegram="@sanjar_agro")
        ],
        upvotes=0,
        logo="🌱",
        raisedAmount="$0",
        metrics={"users": "0 Fermer xo‘jaligi", "grantWon": "0 UZS"},
        tags=["IoT", "AgroTech", "Eco"]
    ),
    "3": StartupModel(
        id="3",
        name="EduMentor AI (NavDU)",
        tagline="Talabalar uchun shaxsiylashtirilgan interaktiv o‘quv yo‘riqchisi",
        fullDescription="Har bir talabaning o‘zlashtirish tezligi va qiziqishlariga moslashgan sun’iy intellekt repetitori.",
        problem="Katta auditoriyalarda professorlar har bir talabaning individual savollariga vaqt ajrata olmaydi.",
        solution="Darsliklar va ma’ruza matnlarini tahlil qilib, testlar va qadam-baqadam tushuntirishlar beruvchi AI bot.",
        category="AI & EdTech",
        stage="MVP",
        batch="3-Mavsum (2026)",
        founders=[
            Founder(name="Aziza Karimova", role="Product Lead", avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300", faculty="Axborot texnologiyalari", telegram="@aziza_edutech")
        ],
        upvotes=0,
        logo="📚",
        raisedAmount="$0",
        metrics={"users": "0 Talaba"},
        tags=["EdTech", "AI", "Mobile"]
    )
}

def save_data():
    try:
        data = {sid: model.model_dump() for sid, model in STARTUPS_DB.items()}
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Ma'lumotlarni saqlashda xatolik: {e}")

def load_data():
    if DATA_FILE.exists():
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for sid, item in data.items():
                    STARTUPS_DB[sid] = StartupModel(**item)
        except Exception as e:
            print(f"Ma'lumotlarni yuklashda xatolik: {e}")

load_data()

@app.get("/api/v1/startups/", response_model=List[StartupModel])
def get_startups(category: Optional[str] = None):
    results = list(STARTUPS_DB.values())
    if category and category != 'Barchasi':
        results = [s for s in results if s.category == category]
    return results

@app.get("/api/v1/startups/leaderboard/", response_model=List[StartupModel])
def get_leaderboard():
    return sorted(STARTUPS_DB.values(), key=lambda s: s.upvotes, reverse=True)

@app.get("/api/v1/startups/{startup_id}", response_model=StartupModel)
def get_startup(startup_id: str):
    if startup_id not in STARTUPS_DB:
        raise HTTPException(status_code=404, detail="Startap topilmadi")
    return STARTUPS_DB[startup_id]

@app.post("/api/v1/startups/{startup_id}/upvote")
def upvote_startup(startup_id: str):
    if startup_id not in STARTUPS_DB:
        raise HTTPException(status_code=404, detail="Startap topilmadi")
    STARTUPS_DB[startup_id].upvotes += 1
    save_data()
    return {
        "success": True,
        "startup_id": startup_id,
        "new_upvotes": STARTUPS_DB[startup_id].upvotes
    }
