import { Express, RequestHandler } from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import Database from "better-sqlite3";
import createSqliteStore from "better-sqlite3-session-store";
import * as path from "path";

const SqliteStore = createSqliteStore(session);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const dbPath = path.join(process.cwd(), "data", "database.sqlite");
  
  return session({
    store: new SqliteStore({
      client: new Database(dbPath),
      expired: {
        clear: true,
        intervalMs: 900000 // 15 minutes
      }
    }),
    secret: process.env.SESSION_SECRET || "development-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Register endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        role: "customer",
      });

      (req.session as any).userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ message: "Error al registrar usuario" });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Email o contraseña incorrectos" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email o contraseña incorrectos" });
      }

      (req.session as any).userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.json({ message: "Sesión cerrada exitosamente" });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      
      if (!userId) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const userId = (req.session as any).userId;

  if (!userId) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ message: "Usuario no encontrado" });
  }

  req.user = user;
  next();
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  const userId = (req.session as any).userId;

  if (!userId) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ message: "Usuario no encontrado" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: Se requiere rol de administrador" });
  }

  req.user = user;
  next();
};
