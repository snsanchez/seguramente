'''
En este archivo definimos las clases que representan las tablas en la base de datos. Estas clases son modelos ORM (Object-Relational Mapping) que SQLAlchemy utiliza para interactuar con la base de datos.

Propósito:
    - Definir la estructura de la base de datos: Describe cómo se ven las tablas y sus columnas.
    - Mapear clases a tablas: Permite que SQLAlchemy convierta objetos Python en registros de base de datos y viceversa.
'''


from sqlalchemy import Column, Integer, String, ForeignKey, MetaData, LargeBinary
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

metadata = MetaData()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(254), nullable=False)
    email = Column(String(254), unique=True, nullable=False)
    secret_key = Column(LargeBinary, nullable=False)  # Clave secreta para encriptación
    iv = Column(LargeBinary, nullable=False)  # Vector de inicialización (IV)

class Password(Base):
    __tablename__ = 'passwords'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    title = Column(String(100), nullable=False)
    username = Column(String(50), nullable=False)
    password = Column(LargeBinary, nullable=False)
