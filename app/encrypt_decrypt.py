from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from fastapi import HTTPException
import os
import base64
import binascii

def generate_key_iv():
    try:
        """Genera una clave secreta y un IV para encriptación."""
        key = os.urandom(32)  # Clave de 256 bits
        iv = os.urandom(16)   # IV de 128 bits
        return key, iv
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al generar key e iv.")
    
def encrypt_password(password: str, key: bytes, iv: bytes) -> bytes:
    try:
        if len(key) not in [16, 24, 32]:
            raise ValueError("Invalid key size for AES")
        """Encripta la contraseña usando una clave secreta y un IV."""
        cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        encrypted_password = encryptor.update(password.encode()) + encryptor.finalize()
        return encrypted_password
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error en la encriptación.")

def decrypt_password(encrypted_password: bytes, key: bytes, iv: bytes) -> str:
    # Desencripta la contraseña usando una clave secreta y un IV.
    try:
        if len(key) not in [16, 24, 32]:
            raise ValueError("Invalid key size for AES.")
        cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted_password = decryptor.update(encrypted_password) + decryptor.finalize()
        return decrypted_password.decode('utf-8')
    except Exception as e:
            raise HTTPException(status_code=500, detail="Error al desencriptar.")
    
# esto por si da error y necesito realizar conversiones de las cadenas de bytes registradas o consultadas a la db 
def encode_base64(binary_data: bytes) -> str:
    """Convierte datos binarios a una cadena base64."""
    return base64.b64encode(binary_data).decode('utf-8')

def decode_base64(encoded_data: str) -> bytes:
    """Convierte una cadena base64 a datos binarios."""
    return base64.b64decode(encoded_data)

def encode_password(password: str) -> str:
    # Codificar la contraseña en Base64
    return base64.b64encode(password.encode('utf-8')).decode('utf-8')

def decode_password(encoded_password: str) -> str:
    try:
        return base64.b64decode(encoded_password).decode('utf-8')
    except binascii.Error:
        # Si la cadena no es válida, devolverla tal como está
        return encoded_password

def verify_password(stored_password: str, provided_password: str) -> bool:
    # Decodificar la contraseña almacenada en Base64
    decoded_stored_password = base64.b64decode(stored_password).decode('utf-8')
    return decoded_stored_password == provided_password


