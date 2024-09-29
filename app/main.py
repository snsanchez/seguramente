from fastapi import FastAPI, Request, HTTPException, APIRouter, Depends, Response
from sqlalchemy.orm import Session
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from starlette.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import database, metadata, engine, SessionLocal, get_db
from .models import User
from app.schemas import PasswordCreate, Password, PasswordPatch, UserCreate, UserLogin, UserResponse
from .crud import create_password, get_passwords, delete_password, update_password_partial, create_token
import os
from dotenv import load_dotenv
import base64
from .encrypt_decrypt import generate_key_iv, encode_password, verify_password, decode_password
from jose import jwt, JWTError
from datetime import datetime, timedelta
# Esto es para obtener el token desde la solicitud de autenticación en el login, y se usará como dependencia para endpoints que requieran el token JWT.
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

load_dotenv()  

TOKEN_EXPIRATION_SECONDS = os.getenv("TOKEN_EXPIRATION_SECONDS")
SECRET_KEY = os.getenv("SECRET_KEY_JWT")
ALGORITHM = os.getenv("ALGORITHM")

app = FastAPI()


#configuracion de CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://seguramente.net.ar", "https://*.seguramente.net.ar"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PATCH"],
    allow_headers=["*"],
)

async def startup_database():
    await database.connect()

async def shutdown_database():
    await database.disconnect()

app.add_event_handler("startup", startup_database)
app.add_event_handler("shutdown", shutdown_database)

@app.get("/")
async def health_check():
    return "Todo funciona bien bro"

# MANEJO DE CONTRASEÑAS CREADAS POR EL USUARIO

# AGREGAR UNA CONTRASEÑA
@app.post("/passwords/", response_model=Password) #, dependencies=[Depends(verify_api_key)]
async def add_password(password: PasswordCreate, db: Session = Depends(get_db)):
    try:
        created_password = create_password(db, password.user_id, password.title, password.username, password.password)
        created_password.password = base64.b64encode(created_password.password).decode('utf-8')
        return created_password
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# OBTENER LAS CONTRASEÑAS POR USER ID
@app.get("/passwords/", response_model=list[Password])  #, dependencies=[Depends(verify_api_key)]
async def read_passwords(user_id: int, db: Session = Depends(get_db)):
    try:
        return get_passwords(db, user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching passwords: {str(e)}")
    
# ACTUALIZAR UNA CONTRASEÑA POR SU ID    
@app.patch("/passwords/{password_id}")
def update_password(password_id: int, patch_data: PasswordPatch, db: Session = Depends(get_db)):
    return update_password_partial(db, password_id, patch_data)

# ELIMINAR UN REGISTRO DE CONTRASEÑA 
@app.delete("/passwords/{password_id}", response_model=dict) # response_model = devuelve un diccionario
def delete_pwd(password_id: int, db: Session = Depends(get_db)):
    try:
        delete_password(db, password_id)
        return {"message": "Contraseña eliminada con éxito"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error eliminando contraseña: {str(e)}")

# -------- MANEJO DE USUARIOS CON JWT --------------

@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario o el email ya existen
    existing_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username o Email ya registrado")

    # Generar clave secreta e IV
    secret_key, iv = generate_key_iv()

    # Codificar la contraseña en base64
    encoded_password = encode_password(user.password)

    # Crear nuevo usuario
    new_user = User(
        username=user.username,
        hashed_password=encoded_password,
        email=user.email,
        secret_key=secret_key,
        iv=iv
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Crear token JWT para el nuevo usuario
    token = create_token({"user_id": new_user.id, "username": new_user.username})
    # pasar el token en la respuesta para que lo reciba y almacene JS
    return JSONResponse(status_code=200, content={"message": "Register successful", "token": token})

@app.post("/login")
def login_user(response: Response, user: UserLogin, db: Session = Depends(get_db)):
    # Buscar el usuario en la base de datos por su nombre de usuario
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar la contraseña
    if not verify_password(db_user.hashed_password, user.password):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    # Crear token JWT si la contraseña es correcta
     # Crear token JWT
    token = create_token({"user_id": db_user.id, "username": db_user.username}) 

    return JSONResponse(status_code=200, content={"message": "Login successful", "access_token": token, "token_type": "bearer"})


#sirve para obtener informacion del usuario mediante su token jwt, en un futuro lo puedo modificar para recibir el token desde una peticion desde el frontend donde me envia en los headers el token, obteniendolo de una cookie (a establecer) y ahi le devuelvo info como el username, el email qsy

@app.get("/users/me")
def get_user_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Endpoint para obtener los detalles del usuario actual a partir de su token JWT.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

    # Buscar al usuario en la base de datos
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return user

# uvicorn app.main:app --reload
