import os
from sqlalchemy import create_engine, MetaData
from databases import Database
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("POSTGRES_URL")  # La URL original de Vercel
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

engine = create_engine(DATABASE_URL)

"""

DATABASE_URL = os.getenv("POSTGRES_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada en el entorno.")
"""


database = Database(DATABASE_URL)
metadata = MetaData()


engine = create_engine(DATABASE_URL) #creando motor de base de datos

# Crear un SessionLocal para usarlo en las dependencias
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

metadata.create_all(bind=engine)

# MetaData permite definir la estructura de la base de datos, mediante metodos como Table, Column, Index, ForeignKey etc

# Función para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()