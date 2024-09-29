from sqlalchemy import insert, select
from .database import database
from .schemas import PasswordCreate, PasswordPatch
from sqlalchemy.orm import Session
from .models import Password, User
from .encrypt_decrypt import encrypt_password, generate_key_iv, decrypt_password
import base64
from fastapi import HTTPException
from jose import jwt, JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os


def create_password(db: Session, user_id: int, title: str, username: str, password: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException("Usuario no encontrado")

    key = user.secret_key
    iv = user.iv
    encrypted_password = encrypt_password(password, key, iv)

    db_password = Password(
        user_id=user_id,
        title=title,
        username=username,
        password=encrypted_password
    )
    db.add(db_password)
    db.commit()
    db.refresh(db_password)
    return db_password

def get_passwords(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException("Usuario no encontrado")

    key = user.secret_key
    iv = user.iv
    if not key or not iv:
        raise HTTPException(status_code=500, detail="Encryption key IV no encontrados")

    passwords = db.query(Password).filter(Password.user_id == user_id).all()

    decrypted_passwords = []
    for pwd in passwords:
        decrypted_password = decrypt_password(pwd.password, key, iv)
        decrypted_passwords.append({
            'id': pwd.id,
            'user_id': pwd.user_id,
            'title': pwd.title,
            'username': pwd.username,
            'password': decrypted_password
        })

    return decrypted_passwords


def delete_password(db: Session, password_id: int):
    # busco la pwrd por su id
    password = db.query(Password).filter(Password.id == password_id).first()
    if password:
        db.delete(password)
        db.commit()
    else:
        raise HTTPException(status_code=500, detail="Registro no encontrado por id")

def update_password_partial(db: Session, password_id: int, patch_data: PasswordPatch):
    try:
        # Buscar la contraseña por ID
        password = db.query(Password).filter(Password.id == password_id).first()

        # Verificar si existe la contraseña
        if password is None:
            raise HTTPException(status_code=404, detail=f"Contraseña con id {password_id} no encontrada")
        
        # Iterar sobre los campos recibidos
        for var, value in vars(patch_data).items():
            if value is not None:
                # Si es el campo 'password', encriptarlo antes de guardarlo
                if var == 'password':
                    user = db.query(User).filter(User.id == password.user_id).first()
                    key = user.secret_key
                    iv = user.iv
                    value = encrypt_password(value, key, iv)
                
                # Actualizar el valor en el objeto de la contraseña
                setattr(password, var, value)
        
        # Guardar los cambios en la base de datos
        db.add(password)
        db.commit()

        return {"message": "Contraseña actualizada con éxito"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY_JWT")
ALGORITHM = os.getenv("ALGORITHM")
TOKEN_EXPIRATION_SECONDS = 3600 

def create_token(data: dict):
    """
    Crea un token JWT con los datos proporcionados y una fecha de expiración.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRATION_SECONDS)
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token
