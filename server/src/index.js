import express from 'express';
import dotenv from 'dotenv';
import db from './db/sqllite.js';
import nodemailer from 'nodemailer';
import { authenticateToken, generateToken } from './middleware/auth.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
dotenv.config();
const saltRounds = 10;
const app = express();
const PORT = process.env.PORT || 3001;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, '..', 'uploads', 'photos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

// CORS middleware
app.use((req, res, next) => {
  // In production, replace '*' with your actual frontend domain
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// Function to clean up old reservations (older than reservation_date)
function cleanupOldReservations() {
  try {
    // Check if the reservations table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='reservations'
    `).get();
    
    if (!tableExists) {
      // Table doesn't exist yet, skip cleanup
      return;
    }
    
    // Use SQLite's datetime('now') to match the stored format (YYYY-MM-DD HH:MM:SS)
    const query = `DELETE FROM reservations WHERE reservation_date < datetime('now')`;
    const result = db.prepare(query).run();
    
    if (result.changes > 0) {
    }
  } catch (error) {
    console.error('Error cleaning up old reservations:', error);
  }
}

// Run cleanup on startup
cleanupOldReservations();

// Run cleanup every 24 hours (86400000 ms)
setInterval(cleanupOldReservations, 86400000);

// Function to send reminder emails 30 minutes before reservation
async function sendReminderEmails() {

  try {
    // Naudoti SQLite datetime funkcijas vietos laiko zonoje
    // SQLite datetime('now', 'localtime') grąžina vietos laiką formatu YYYY-MM-DD HH:MM:SS
    
    // Apskaičiuoti laiko intervalą: nuo 25 minučių iki 35 minučių nuo dabar
    // Tai užtikrina, kad priminimas bus išsiųstas per 30 minučių (+-5 min paklaida)
    const minTimeOffset = 25; // minutės
    const maxTimeOffset = 35; // minutės
    
    // Rasti rezervacijas, kurios prasideda per 25-35 minučių
    // ir dar nebuvo išsiųstas priminimas
    // Naudojame datetime() funkciją abiem pusėms, kad palyginimas būtų teisingas
    const query = 'SELECT id, name, email, phone, reservation_date, service_type ' +
      'FROM reservations ' +
      'WHERE datetime(reservation_date) >= datetime(\'now\', \'localtime\', \'+\' || ' + minTimeOffset + ' || \' minutes\') ' +
      'AND datetime(reservation_date) <= datetime(\'now\', \'localtime\', \'+\' || ' + maxTimeOffset + ' || \' minutes\') ' +
      'AND (reminder_sent IS NULL OR reminder_sent = 0)';
    
    const reservations = db.prepare(query).all();
    
    if (reservations.length === 0) {
      return; // Nėra ką siųsti
    }
    
    for (const reservation of reservations) {
      try {
        // Siųsti priminimą klientui
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: reservation.email,
          subject: `Priminimas: Jūsų paslauga už ${reservation.service_type} prasideda per 30 min`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">Sveiki, ${reservation.name}!</h2>
              <p>Primename, kad jūsų užsakytos paslaugos laikas artėja:</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Paslauga:</strong> ${reservation.service_type}</p>
                <p style="margin: 5px 0;"><strong>Data ir laikas:</strong> ${reservation.reservation_date}</p>
                <p style="margin: 5px 0;"><strong>Telefonas:</strong> ${reservation.phone}</p>
              </div>
              <p>Prašome atvykti laiku!</p>
              <p style="margin-top: 30px;">Su pagarba,<br>Variklio Sala</p>
            </div>
          `,
          text: `
Sveiki, ${reservation.name}!

Primename, kad jūsų užsakytos paslaugos laikas artėja:

Paslauga: ${reservation.service_type}
Data ir laikas: ${reservation.reservation_date}
Telefonas: ${reservation.phone}

Prašome atvykti laiku!

Su pagarba,
Variklio Sala
          `
        });
        
        // Pažymėti, kad priminimas išsiųstas
        db.prepare('UPDATE reservations SET reminder_sent = 1 WHERE id = ?').run(reservation.id);
      } catch (emailError) {
        console.error(`❌ Klaida siunčiant priminimą ${reservation.email} (rezervacija #${reservation.id}):`, emailError.message);
        console.error('Detalės:', emailError);
        // Tęsti su kitomis rezervacijomis net jei viena nepavyko
      }
    }
  } catch (error) {
    console.error('❌ Klaida sendReminderEmails funkcijoje:', error);
    console.error('Klaidos detalės:', error);
  }
}

// Paleisti priminimų funkciją kas 2 minutes (120000 ms)
setInterval(sendReminderEmails, 2 * 60 * 1000);

// Paleisti iš karto paleidžiant serverį (patikrinti ar yra artėjančių rezervacijų)
sendReminderEmails();

// health status
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Serveris veikia' }); // leidzia curlinti ir testinti serveri
});


// Login endpoint with bcrypt 
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password required' 
    });
  }

  // Simple authentication (in production, check against database with hashed passwords)
  try {
    const admin = db.prepare('SELECT username, password FROM admin WHERE username = ?').get(username);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const passwordMatches = await bcrypt.compare(password, admin.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(admin.username);
    return res.status(200).json({
      success: true,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error during authentication:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
});

app.post('/create-admin-user', async (req, res) => {// temp endpoint to create admin user for production
  const username = "admin";
  const password = await bcrypt.hash("admin", saltRounds);
  const query = `INSERT INTO admin (username, password) VALUES (?, ?)`;
  db.prepare(query).run(username, password);
  res.status(200).json({ message: 'Admin user created', username: username, password: password });
}); 

// Photo upload endpoints
app.post('/api/photos/before', authenticateToken, (req, res, next) => {
  upload.array('photos', 10)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'Failas per didelis. Maksimalus dydis 10MB.' });
        }
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Nepasirinkta jokių failų' });
    }

    const caption = req.body.caption || '';
    const uploadedPhotos = [];

    for (const file of req.files) {
      const photoUrl = `/uploads/photos/${file.filename}`;
      const query = `INSERT INTO photos (caption, photo_url, photo_type) VALUES (?, ?, ?)`;
      const result = db.prepare(query).run(caption, photoUrl, 'before');
      
      uploadedPhotos.push({
        id: result.lastInsertRowid,
        caption,
        photo_url: photoUrl,
        photo_type: 'before'
      });
    }

    res.status(200).json({ 
      success: true, 
      message: `Įkelta ${uploadedPhotos.length} ${uploadedPhotos.length === 1 ? 'nuotrauka' : 'nuotraukos'}`,
      photos: uploadedPhotos
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Klaida įkeliant nuotraukas', error: error.message });
  }
});

app.post('/api/photos/after', authenticateToken, (req, res, next) => {
  upload.array('photos', 10)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'Failas per didelis. Maksimalus dydis 10MB.' });
        }
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Nepasirinkta jokių failų' });
    }

    const caption = req.body.caption || '';
    const uploadedPhotos = [];

    for (const file of req.files) {
      const photoUrl = `/uploads/photos/${file.filename}`;
      const query = `INSERT INTO photos (caption, photo_url, photo_type) VALUES (?, ?, ?)`;
      const result = db.prepare(query).run(caption, photoUrl, 'after');
      
      uploadedPhotos.push({
        id: result.lastInsertRowid,
        caption,
        photo_url: photoUrl,
        photo_type: 'after'
      }); 
    }

    res.status(200).json({ 
      success: true, 
      message: `Įkelta ${uploadedPhotos.length} ${uploadedPhotos.length === 1 ? 'nuotrauka' : 'nuotraukos'}`,
      photos: uploadedPhotos
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Klaida įkeliant nuotraukas', error: error.message });
  }
});

// ===== PHOTOS CRUD OPERATIONS =====

// CREATE - Already implemented in /api/photos/before and /api/photos/after

// READ - Get all photos
app.get('/api/photos', async (req, res) => {
  try {
    const { type } = req.query; // Optional filter by photo_type
    let query = `SELECT * FROM photos`;
    let params = [];
    
    if (type && (type === 'before' || type === 'after')) {
      query += ` WHERE photo_type = ?`;
      params.push(type);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const photos = db.prepare(query).all(params);
    res.status(200).json({ success: true, photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ success: false, message: 'Klaida gaunant nuotraukas', error: error.message });
  }
});

// READ - Get photo by ID
app.get('/api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id);
    
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Nuotrauka nerasta' });
    }
    
    res.status(200).json({ success: true, photo });
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ success: false, message: 'Klaida gaunant nuotrauką', error: error.message });
  }
});

// DELETE - Delete photo
app.delete('/api/photos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get photo info before deleting
    const photo = db.prepare('SELECT photo_url FROM photos WHERE id = ?').get(id);
    
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Nuotrauka nerasta' });
    }
    // Delete file from disk FIRST (before deleting from database)
    if (photo.photo_url) {
      // photo_url format: /uploads/photos/filename.jpg
      // We need: server/uploads/photos/filename.jpg
      const relativePath = photo.photo_url.startsWith('/') 
        ? photo.photo_url.substring(1) // Remove leading slash: uploads/photos/filename.jpg
        : photo.photo_url;
      
      const filePath = join(__dirname, '..', relativePath);
      
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (fileError) {
          console.error(`Error deleting file ${filePath}:`, fileError);
          // Continue with database deletion even if file deletion fails
        }
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    }

    // Delete from database
    db.prepare('DELETE FROM photos WHERE id = ?').run(id);

    res.status(200).json({ success: true, message: 'Nuotrauka sėkmingai ištrinta' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ success: false, message: 'Klaida ištrinant nuotrauką', error: error.message });
  }
});

// Get reserved times for a specific date (PUBLIC - needed for booking form)
app.get('/api/reservations/date/:date', async (req, res) => {
  const { date } = req.params;
  const { service_type } = req.query;
  
  try {
    // Get reservations for this date with optional service_type filter
    let query = `
      SELECT reservation_date, service_type
      FROM reservations 
      WHERE DATE(reservation_date) = ?
    `;
    let params = [date];
    
    // If service_type is provided, filter by it
    if (service_type) {
      query += ` AND service_type = ?`;
      params.push(service_type);
    }
    
    query += ` ORDER BY reservation_date`;
    
    const result = db.prepare(query).all(params);
    
    res.status(200).json({ 
      success: true, 
      date: date,
      reservations: result
    });
  } catch (error) {
    console.error('Error fetching reserved times:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching reserved times',
      error: error.message 
    });
  }
});

// Get all reservations with pagination (PROTECTED - admin only)
app.get('/api/reservations', authenticateToken, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM reservations 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const result = db.prepare(query).all([limit, offset]);
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM reservations').get().count;
    
    res.status(200).json({ 
      success: true, 
      data: result,
      total: totalCount, 
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching reservations',
      error: error.message 
    });
  }
});

// Get single reservation by ID (PROTECTED - admin only)
app.get('/api/reservations/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = `
      SELECT * FROM reservations 
      WHERE id = ?
    `;
    const result = db.prepare(query).get(id);
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reservation not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching reservation',
      error: error.message 
    });
  }
});

// Create a new reservation (PUBLIC - users need this for booking)
app.post('/api/reservations', async (req, res) => {
  const { name, email, phone, reservation_date, service_type, additional_info } = req.body;

  // Validation
  if (!name || !email || !phone || !reservation_date || !service_type) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email, phone, reservation_date, and service_type are required' 
    });
  }

  try {
    // Check if a reservation already exists for this time with the same service type
    const checkQuery = `
      SELECT id FROM reservations 
      WHERE reservation_date = ? AND service_type = ?
    `;
    const existing = db.prepare(checkQuery).get(reservation_date, service_type);
    
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: 'This time slot is already reserved for this service' 
      });
    }
    
    const query = `
      INSERT INTO reservations (name, email, phone, reservation_date, service_type, additional_info, created_at, reminder_sent)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), 0)
    `;
    const values = [name, email, phone, reservation_date, service_type, additional_info || null];
    
    const result = db.prepare(query).run(values);
    const inserted = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
    
    // Send response immediately after database insert
    res.status(201).json({ 
      success: true, 
      message: 'Reservation created successfully',
      data: inserted
    });
    
    // Send email notification asynchronously (don't wait for it)
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "noreikafaustas@gmail.com",
      subject: `Nauja rezervacija: ${service_type}`,
      text: `Nauja rezervacija:\n\nVardas: ${name}\nTelefonas: ${phone}\nData ir laikas: ${reservation_date}\nPaslauga: ${service_type}\nPapildoma informacija: ${additional_info || 'Nėra papildomos informacijos'}`
    }).catch(emailError => {
      console.error('Error sending email notification:', emailError);
      // Email failure doesn't affect the reservation
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating reservation',
      error: error.message 
    });
  }
});

// Delete reservation (PROTECTED - admin only)
app.delete('/api/reservations/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get the reservation before deleting
    const existing = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    
    if (!existing) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reservation not found' 
      });
    }
    
    const query = `
      DELETE FROM reservations 
      WHERE id = ?
    `;
    db.prepare(query).run(id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Reservation deleted successfully',
      data: existing
    });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting reservation',
      error: error.message 
    });
  }
});

// Error handler for multer and other errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'Failas per didelis. Maksimalus dydis 10MB.' });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
