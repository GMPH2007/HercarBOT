/**
 * SERVIDOR NODE.JS + EXPRESS - HERCARTA v6.5 (APSTI)
 * I.E.S.T.P. "Hermanos Cárcamo" - Paita, Piura, Perú
 * Carrera Profesional Técnica de Arquitectura de Plataformas y Servicios de TI
 *
 * EJECUCIÓN:
 *   1. npm install express cors
 *   2. node server.js
 */

const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares estándar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend (HTML, CSS, JS, Assets)
app.use(express.static(path.join(__dirname)));

// Simulación de Base de Datos en memoria / JSON para demostración rápida
const DB_PATH = path.join(__dirname, "hercar_data.json");

function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [
        {
          id: 1,
          nombre: "Administrador APSTI",
          email: "admin@ieshercar.edu.pe",
          password_hash: crypto.createHash("sha256").update("hercar2026").digest("hex"),
          rol: "admin",
          creado_en: new Date().toISOString()
        }
      ],
      api_keys: [
        {
          id: 1,
          user_id: 1,
          provider: "gemini",
          key: "INSTITUCIONAL_GEMINI_KEY",
          permisos: "admin_full"
        }
      ],
      messages: [
        {
          id: 1,
          user_id: 1,
          pregunta: "¿Qué carreras ofrece el instituto?",
          respuesta: "El IESTP Hermanos Cárcamo ofrece APSTI, Negocios Internacionales, Contabilidad y Desarrollo Pesquero.",
          engine: "neural_local",
          latency_ms: 3.5,
          timestamp: new Date().toLocaleString("es-PE")
        }
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ============================================================================
// ENDPOINTS REST
// ============================================================================

// 1. Endpoint de Consulta Inteligente (/api/ask) - Proxy IA con OpenAI / Gemini
app.post("/api/ask", async (req, res) => {
  const { question, apiKey, provider = "gemini", model = "gemini-1.5-flash" } = req.body;

  if (!question) {
    return res.status(400).json({ status: "error", message: "Falta la pregunta" });
  }

  const tStart = Date.now();
  let answer = "";
  let engineUsed = apiKey ? `cloud_${provider}` : "neural_local";

  if (apiKey && provider === "openai") {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model || "gpt-4o-mini",
          messages: [
            { role: "system", content: "Eres HercarIA, orientadora del IESTP Hermanos Cárcamo en Paita." },
            { role: "user", content: question }
          ]
        })
      });
      const data = await response.json();
      answer = data.choices?.[0]?.message?.content || "Sin respuesta del modelo.";
    } catch (err) {
      engineUsed = "neural_local (fallback)";
      answer = `Error al conectar con OpenAI: ${err.message}`;
    }
  } else if (apiKey && provider === "gemini") {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }]
        })
      });
      const data = await response.json();
      answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta de Gemini.";
    } catch (err) {
      engineUsed = "neural_local (fallback)";
      answer = `Error al conectar con Gemini: ${err.message}`;
    }
  } else {
    answer = "Consulta procesada por la plataforma institucional APSTI en modo local.";
  }

  const latencyMs = Date.now() - tStart;

  // Persistir en base de datos
  const db = loadDb();
  const newMsg = {
    id: db.messages.length + 1,
    user_id: req.body.userId || 1,
    pregunta: question,
    respuesta: answer,
    engine: engineUsed,
    latency_ms: latencyMs,
    timestamp: new Date().toLocaleString("es-PE")
  };
  db.messages.unshift(newMsg);
  saveDb(db);

  res.json({
    status: "success",
    messageId: newMsg.id,
    answer,
    engine: engineUsed,
    latencyMs
  });
});

// 2. Autenticación: Login (/api/auth/login)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Credenciales incompletas" });
  }

  const db = loadDb();
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const user = db.users.find(u => (u.email === email || u.nombre === email) && u.password_hash === hash);

  if (!user) {
    return res.status(401).json({ status: "error", message: "Usuario o clave incorrecta" });
  }

  const token = crypto.createHash("sha256").update(`${user.id}-${Date.now()}`).digest("hex");
  res.json({
    status: "success",
    token,
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
  });
});

// 3. Autenticación: Registro (/api/auth/register)
app.post("/api/auth/register", (req, res) => {
  const { nombre, email, password, rol = "estudiante" } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
  }

  const db = loadDb();
  if (db.users.some(u => u.email === email)) {
    return res.status(409).json({ status: "error", message: "El correo ya está registrado" });
  }

  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const newUser = {
    id: db.users.length + 1,
    nombre,
    email,
    password_hash: hash,
    rol,
    creado_en: new Date().toISOString()
  };
  db.users.push(newUser);
  saveDb(db);

  res.status(201).json({ status: "success", userId: newUser.id });
});

// 4. Estadísticas del Panel de Administración (/api/admin/stats)
app.get("/api/admin/stats", (req, res) => {
  const db = loadDb();
  const total = db.messages.length;
  const cloud = db.messages.filter(m => m.engine.includes("cloud")).length;
  const local = total - cloud;

  res.json({
    status: "success",
    totalQueries: total,
    cloudQueries: cloud,
    localQueries: local,
    totalUsers: db.users.length,
    recentLogs: db.messages.slice(0, 10).map(m => ({
      id: m.id,
      query: m.pregunta,
      engine: m.engine,
      latency: m.latency_ms,
      time: m.timestamp
    }))
  });
});

// 5. Historial de mensajes (/api/messages)
app.get("/api/messages", (req, res) => {
  const db = loadDb();
  res.json({ status: "success", messages: db.messages });
});

app.listen(PORT, () => {
  console.log("==========================================================");
  console.log(`[*] Servidor Express.js iniciado en http://localhost:${PORT}`);
  console.log(`[+] Sirviendo Frontend desde: ${__dirname}`);
  console.log(`[+] Endpoints REST activos: /api/ask, /api/auth/login, /api/admin/stats`);
  console.log("==========================================================");
});
