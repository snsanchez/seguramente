'''
En este archivo definimos las clases que representan los esquemas de datos utilizados por FastAPI. Estas clases están basadas en Pydantic y se utilizan para la validación y serialización/deserialización de datos.

Propósito:

    Validación de datos: Asegura que los datos enviados por los clientes cumplan con las expectativas de la API.
    Documentación automática: Genera la documentación automática de la API (Swagger/OpenAPI).
    Definir la estructura de las solicitudes y respuestas: Describe cómo se ven los datos que se envían y reciben a través de la API.
'''


from pydantic import BaseModel, Field, EmailStr
from typing import Optional

# esquema de usuarios

# esquema para creacion de usuarios
class UserCreate(BaseModel):
    # user_id: int = Field(..., gt=0)  # Obligatorio, tipo entero, mayor que 0
    username: str = Field(..., min_length=1, max_length=100)  # Obligatorio, longitud entre 1 y 100
    password: str = Field(..., min_length=8, max_length=100)  # Obligatorio, longitud entre 8 y 100
    email: Optional[EmailStr] = None # validador de email
  # Opcional, longitud entre 1 y 100


# Esquema para la Representación del Usuario
class User(BaseModel):
    # user_id: int
    id: int
    username: str
    email: Optional[str]
    #podrian ocultarse estos campos para no exponerlos: 
    secret_key: Optional[bytes]
    iv: Optional[bytes]

    class Config:
        from_attributes = True

# Esquema para la Creación de Contraseña
class PasswordCreate(BaseModel):
    user_id: int = Field(..., gt=0)  # Obligatorio, tipo entero, mayor que 0
    title: str = Field(..., max_length=50)  # Obligatorio
    username: str = Field(..., max_length=50)  # Obligatorio
    password: str = Field(..., max_length=100)  # Obligatorio

class Password(PasswordCreate):
    id: Optional[int]
    password: str

    class Config:
        from_attributes = True

# para editar campos de una contraseña
class PasswordPatch(BaseModel):
    title: str = None
    username: str = None
    password: str = None
    
# Este modelo se utilizará para recibir los datos de inicio de sesión
class UserLogin(BaseModel):
    username: str
    password: str

# Este modelo se utilizará para la respuesta del usuario, sin exponer el hashed_password
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    hashed_password: str
    access_token: str

    class Config:
        from_attributes = True


