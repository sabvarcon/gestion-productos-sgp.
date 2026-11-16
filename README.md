# Sistema de Gestión de Productos (SGP)

Aplicación web académica con Node.js, Express, MongoDB/Mongoose, autenticación JWT y CRUD de productos.

## Requisitos
- Node.js 20 o superior y npm.
- Cuenta de MongoDB Atlas o instancia local de MongoDB.
- Git para control de versiones.

## Instalación local
1. Clona el repositorio.
2. Ejecuta `npm install`.
3. Copia `.env.example` a `.env`.
4. Configura `MONGODB_URI` y un `JWT_SECRET` aleatorio y robusto.
5. Ejecuta `npm run dev`.
6. Abre `http://localhost:3000`.

## Pruebas
- `npm test`
- `npm run test:coverage`

Las pruebas utilizan `mongodb-memory-server`; no requieren una base de datos Atlas para ejecutarse. La primera ejecución puede descargar el binario de MongoDB.

## Funcionalidad
- Registro e inicio de sesión.
- Contraseñas con hash bcrypt.
- JWT Bearer para rutas privadas.
- CRUD de productos, asociado al usuario propietario.
- Validación de datos y manejo centralizado de errores.
- Interfaz HTML/CSS adaptable.

## API
| Método | Ruta | Autenticación | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Iniciar sesión |
| GET | `/api/auth/me` | Sí | Consultar usuario autenticado |
| GET | `/api/products` | Sí | Listar productos propios |
| POST | `/api/products` | Sí | Crear producto |
| GET | `/api/products/:id` | Sí | Consultar producto propio |
| PUT | `/api/products/:id` | Sí | Actualizar producto propio |
| DELETE | `/api/products/:id` | Sí | Eliminar producto propio |
| GET | `/api/health` | No | Estado del servicio |

En rutas privadas, enviar `Authorization: Bearer <token>`.

## Despliegue en Vercel
1. Sube el repositorio a GitHub e impórtalo en Vercel.
2. Configura las variables `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN` y `NODE_ENV=production`.
3. Despliega y valida `/api/health`.
4. Configura en MongoDB Atlas la lista de acceso de red para permitir el origen de la aplicación. Evita `0.0.0.0/0` en producción siempre que sea posible.
5. Vercel puede crear despliegues al conectar el repositorio Git; el workflow incluido ejecuta pruebas en cada push a `main` y pull request.

## CI/CD
El workflow `.github/workflows/ci.yml` instala dependencias y ejecuta Jest. Si las pruebas pasan y el evento corresponde a un push a `main`, despliega en Vercel mediante Vercel CLI. Configura los secretos `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` en Settings > Secrets and variables > Actions del repositorio. Las variables de aplicación (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV`) deben estar configuradas en el proyecto de Vercel.

## Seguridad
- No subir `.env` al repositorio.
- No compartir secretos JWT ni credenciales Atlas.
- Usar HTTPS en producción.
- Mantener dependencias actualizadas.
- La aplicación almacena el JWT en `sessionStorage` para este prototipo académico; para producción se recomienda una estrategia de sesión con cookies `HttpOnly`, `Secure` y `SameSite`, junto con protección CSRF.

## Limitaciones y tareas antes de entrega
- Configurar y probar una instancia real de MongoDB Atlas.
- Crear el repositorio GitHub del estudiante y añadir su URL a la documentación.
- Completar el despliegue real en Vercel y registrar su URL.
- Adjuntar evidencia de ejecución de pruebas y despliegue.
- La generación inicial de pruebas debe revisarse y ajustarse manualmente; registrar en la bitácora el uso de Copilot/IA según lo solicite la actividad.
