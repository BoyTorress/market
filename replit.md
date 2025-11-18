# MarketExpress - Sistema de Pedidos para Restaurante de Ramen

## Resumen del Proyecto
MarketExpress es una plataforma web completa de pedidos para un restaurante de ramen, optimizada para iPhone y Windows. El sistema incluye:
- Interfaz de cliente para realizar pedidos (menú, carrito, checkout)
- Panel administrativo completo (pedidos, menú, inventario, reportes)
- Solo pagos en persona (no se procesan pagos en línea)
- Pedidos para recoger y programados (sin servicio de entrega)
- Autenticación con roles (cliente/administrador)
- Seguimiento de pedidos en tiempo real
- Gestión completa de inventario
- Reportes y análisis de ventas

## Stack Tecnológico
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: PostgreSQL (Neon) con Drizzle ORM
- **Frontend**: React + TanStack Query + Wouter (routing)
- **UI**: Shadcn/ui + Tailwind CSS
- **Autenticación**: Replit Auth con sesiones persistentes
- **Diseño**: Minimalista japonés (Inter + Noto Sans JP fonts)

## Estructura de Base de Datos

### Tablas Principales
- **users**: Usuarios del sistema con roles (customer/admin)
- **sessions**: Sesiones persistentes de autenticación
- **menu_categories**: Categorías del menú (Ramen, Entradas, Bebidas, etc.)
- **menu_items**: Platillos del menú con precios, imágenes, stock
- **inventory_items**: Ingredientes y materiales con alertas de stock
- **inventory_adjustments**: Historial de ajustes de inventario (auditoría)
- **orders**: Pedidos con estado, tipo de entrega, total
- **order_items**: Items específicos de cada pedido
- **order_status_events**: Historial de cambios de estado de pedidos

## API Endpoints

### Autenticación
- `GET /api/auth/user` - Obtener usuario actual
- `GET /api/login` - Iniciar sesión con Replit Auth
- `GET /api/logout` - Cerrar sesión
- `GET /api/callback` - Callback de OAuth

### Categorías
- `GET /api/categories` - Listar todas las categorías
- `POST /api/categories` - Crear categoría (admin)

### Menú
- `GET /api/menu` - Listar todos los platillos
- `GET /api/menu/search?q=<query>` - Buscar platillos
- `GET /api/menu/:id` - Obtener platillo específico
- `POST /api/menu` - Crear platillo (admin)
- `PATCH /api/menu/:id` - Actualizar platillo (admin)
- `DELETE /api/menu/:id` - Eliminar platillo (admin)

### Inventario
- `GET /api/inventory` - Listar todos los items de inventario
- `GET /api/inventory/low-stock` - Items con stock bajo
- `POST /api/inventory` - Crear item de inventario (admin)
- `PATCH /api/inventory/:id` - Actualizar item (admin)
- `POST /api/inventory/:id/adjust` - Ajustar stock (admin)

### Pedidos
- `GET /api/orders` - Listar pedidos (filtrado por rol: clientes ven solo los suyos, admins ven todos)
- `GET /api/orders/:id` - Obtener detalles de pedido con items
- `POST /api/orders` - Crear nuevo pedido
- `PATCH /api/orders/:id/status` - Actualizar estado de pedido (admin)

### Reportes
- `GET /api/reports/sales?from=<date>&to=<date>` - Reporte de ventas por fecha (admin)
- `GET /api/reports/top-items?limit=<n>` - Top N productos más vendidos (admin)

## Rutas del Frontend

### Públicas (Landing)
- `/` - Landing page (si no está autenticado)

### Cliente (Autenticado)
- `/` - Home con menú completo y búsqueda
- `/menu` - Alias para home
- `/my-orders` - Mis pedidos con estado actual
- `/checkout` - Finalizar pedido (carrito → orden)

### Admin (Rol admin)
- `/admin` - Dashboard con estadísticas y gráficos
- `/admin/orders` - Gestión de pedidos (filtros, búsqueda, actualizar estado)
- `/admin/menu` - Gestión de menú (CRUD completo)
- `/admin/inventory` - Gestión de inventario (ajustes, alertas)

## Flujos Principales

### Cliente - Crear Pedido
1. Cliente navega al menú (`/`)
2. Busca y agrega items al carrito (localStorage)
3. Click en carrito → sidebar con resumen
4. Click "Proceder al Checkout" → `/checkout`
5. Llena formulario (nombre, teléfono, hora programada, instrucciones)
6. Confirma pedido → se crea en BD
7. Redirige a `/my-orders` para ver estado

### Admin - Gestionar Pedido
1. Admin ve dashboard con pedidos activos
2. Click en "Pedidos" → `/admin/orders`
3. Lista completa con filtros y búsqueda
4. Actualiza estado (pending → preparing → ready → completed)
5. Estado se actualiza en tiempo real

### Admin - Gestionar Inventario
1. Admin navega a `/admin/inventory`
2. Ve lista de ingredientes con indicador de stock
3. Alertas automáticas para items con stock bajo
4. Click "Ajustar Stock" → modal con formulario
5. Agrega/reduce cantidad con notas
6. Ajuste se registra en historial de auditoría

## Características Especiales

### Búsqueda en Tiempo Real
El menú incluye búsqueda instantánea que filtra platillos por nombre y descripción.

### Carrito Persistente
El carrito se guarda en localStorage para que no se pierda al recargar la página.

### Alertas de Stock Bajo
El sistema monitorea automáticamente el inventario y muestra alertas cuando un item alcanza el punto de reorden.

### Reportes Automáticos
- Ventas diarias con gráfico de barras
- Top 5 productos más vendidos
- Estadísticas en tiempo real en dashboard

### Protección de Rutas
- Rutas admin protegidas por middleware `isAdmin`
- Cliente solo ve sus propios pedidos
- Admin ve todos los pedidos

## Notas de Desarrollo

### Comandos Útiles
```bash
npm run dev              # Iniciar servidor de desarrollo
npm run db:push          # Sincronizar esquema con BD
npm run db:push --force  # Forzar sincronización (sin preguntas)
```

### Variables de Entorno
- `DATABASE_URL` - URL de conexión a PostgreSQL
- `SESSION_SECRET` - Secreto para sesiones
- `REPLIT_CLIENT_ID` - ID del cliente de Replit Auth
- `REPLIT_CLIENT_SECRET` - Secreto del cliente de Replit Auth

### Storage Interface
El archivo `server/storage.ts` define la interfaz `IStorage` con todos los métodos CRUD. Actualmente usa `PgStorage` que implementa PostgreSQL con Drizzle ORM.

### Seed Data
El archivo `server/seed.ts` contiene datos iniciales:
- Categorías de menú (Ramen, Entradas, Bebidas, Postres)
- 9 platillos con imágenes generadas
- Items de inventario iniciales

## Cambios Recientes (Nov 18, 2025)

### Backend
- ✅ Agregadas columnas first_name, last_name, profile_image_url a users
- ✅ Creada tabla sessions para persistencia
- ✅ Corregida autenticación con Replit Auth
- ✅ Implementada protección de rutas por rol
- ✅ Agregada lógica de filtrado de pedidos por usuario

### Frontend
- ✅ Conectados todos los componentes con API real
- ✅ Implementado checkout funcional con validación
- ✅ Agregada búsqueda en tiempo real en menú
- ✅ Implementado carrito persistente en localStorage
- ✅ Todos los formularios admin funcionan correctamente
- ✅ Notificaciones toast para feedback del usuario

## Próximos Pasos
- Testing end-to-end de todos los flujos
- Optimizaciones de rendimiento
- Mejoras de UX basadas en feedback del usuario
