# **Seguramente Gestor de Contraseñas OpenSource**

Este proyecto es una **aplicación web de gestión de contraseñas**, diseñada para ayudar a los usuarios a guardar y gestionar sus contraseñas de forma segura y sencilla. El sistema está especialmente enfocado en facilitar el uso para personas mayores, ofreciendo una interfaz clara y accesible, con funcionalidades robustas de encriptación y protección de datos.

- **Seguramente Wiki: https://sites.google.com/view/pgina-web-seguramente/**
- **Sitio Web: https://seguramente.net.ar**
- **API: https://seguramente.vercel.app**

## **Características**

- **Registro de usuarios:** Los usuarios pueden crear una cuenta con su nombre, correo y contraseña.
- **Gestión de contraseñas:** Los usuarios pueden guardar, visualizar, actualizar y eliminar sus contraseñas.
- **Seguridad avanzada:** Todas las contraseñas se almacenan de manera encriptada utilizando AES (Advanced Encryption Standard).
- **Autenticación JWT:** La autenticación se maneja mediante **JSON Web Tokens (JWT)**, asegurando sesiones seguras.
- **Integración con WordPress:** La aplicación está integrada con un frontend desarrollado en WordPress, lo que facilita su uso en plataformas comunes.
- **API RESTful:** La API para manejar todas las operaciones está desarrollada con **FastAPI**, permitiendo una comunicación rápida y segura entre el frontend y el backend.

## **Tecnologías Utilizadas**

- **Lenguajes:**
  - Python (para el backend con FastAPI)
  - JavaScript (para la integración con el frontend)
- **Frameworks y Herramientas:**
  - **FastAPI**: Framework web para crear la API RESTful del backend.
  - **PostgreSQL**: Base de datos relacional para almacenar usuarios y contraseñas.
  - **psycopg2-binary**: Para la conexión entre FastAPI y PostgreSQL.
  - **JWT (JSON Web Tokens)**: Autenticación segura de usuarios.
  - **WordPress**: Gestor de contenido que aloja el frontend.
  - **Vercel**: Plataforma de despliegue del backend.
  - **Hostinger**: Para alojar el frontend basado en WordPress.

## **Requisitos de Instalación**

### **Backend:**

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/tu-usuario/password-manager.git
   cd password-manager
   ```

2. **Crear un entorno virtual**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows usa venv\Scripts\activate
   ```

3. **Instalar dependencias**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar la base de datos**:

   - Asegúrate de tener PostgreSQL instalado y crea una base de datos para la aplicación.
   - Actualiza las credenciales de la base de datos en tu archivo `.env`:
     ```
     DATABASE_URL=postgresql://usuario:password@localhost/nombre_de_tu_base_de_datos
     ```

5. **Correr la aplicación**:

   ```bash
   uvicorn app.main:app --reload
   ```

6. **Acceder a la API**:
   - Abre tu navegador y ve a `http://127.0.0.1:8000/docs` para acceder a la documentación de la API generada por FastAPI.

### **Frontend:**

El frontend está alojado en WordPress, y las interacciones con el backend se hacen mediante **JavaScript** a través de **fetch requests**. Para desplegar el frontend, asegúrate de:

1. **Tener un WordPress funcional** (podes usar Hostinger o cualquier otro servicio).
2. **Insertar los scripts personalizados** de JavaScript en WordPress para que se comuniquen con el backend.

## **Cómo Contribuir**

Si deseas contribuir a este proyecto, puedes seguir estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Agregar nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.
