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

const VILNIUS_TIME_ZONE = 'Europe/Vilnius';
process.env.TZ = VILNIUS_TIME_ZONE;

const VILNIUS_DATETIME_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: VILNIUS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

function getVilniusDateParts(date = new Date()) {
  return VILNIUS_DATETIME_FORMATTER.formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
}

function createVilniusDate(date = new Date()) {
  const parts = getVilniusDateParts(date);
  return new Date(Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  ));
}

function formatSQLiteDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

const REMINDER_WINDOW_MINUTES = Object.freeze({ min: 25, max: 35 });

function getReminderWindow(now = new Date(), window = REMINDER_WINDOW_MINUTES) {
  const baseDate = createVilniusDate(now);
  const minDate = addMinutes(baseDate, window.min);
  const maxDate = addMinutes(baseDate, window.max);

  return {
    minTime: formatSQLiteDate(minDate),
    maxTime: formatSQLiteDate(maxDate)
  };
}

function getVilniusTime() {
  return formatSQLiteDate(createVilniusDate());
}


function getVilniusTimeWithOffset(offsetMinutes) {
  const baseDate = createVilniusDate();
  const targetDate = addMinutes(baseDate, offsetMinutes);
  return formatSQLiteDate(targetDate);
}

function logAllReservationsDebug() {
  try {
    const query = `
      SELECT id, name, email, phone, reservation_date, service_type, reminder_sent
      FROM reservations
      ORDER BY reservation_date ASC
    `;
    const reservations = db.prepare(query).all();

    console.log('📋 [DEBUG] Visų rezervacijų sąrašas:');
    if (reservations.length === 0) {
      console.log('📋 [DEBUG]   - Nėra įrašų rezervacijų lentelėje');
      return;
    }

    for (const reservation of reservations) {
      console.log(`📋 [DEBUG]   - #${reservation.id} | ${reservation.reservation_date} | ${reservation.service_type} | ${reservation.name} | reminder_sent=${reservation.reminder_sent}`);
    }
  } catch (error) {
    if (error.message && error.message.includes('no such table')) {
      console.warn('📋 [DEBUG] Lentelė "reservations" nerasta – praleidžiamas rezervacijų logavimas.');
      return;
    }

    console.error('📋 [DEBUG] Klaida bandant išvesti visas rezervacijas:', error.message);
    console.error('📋 [DEBUG] Visos klaidos detalės:', JSON.stringify(error, null, 2));
  }
}


const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = join(__dirname, '..', 'uploads', 'photos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));


app.use((req, res, next) => {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  

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



function cleanupOldReservations() {
  try {

    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='reservations'
    `).get();
    
    if (!tableExists) {

      return;
    }
    

    const currentVilniusTime = getVilniusTime();
    const query = `DELETE FROM reservations WHERE reservation_date < ?`;
    const result = db.prepare(query).run(currentVilniusTime);
    
    if (result.changes > 0) {
    }
  } catch (error) {
    console.error('Error cleaning up old reservations:', error);
  }
}


cleanupOldReservations();

setInterval(cleanupOldReservations, 86400000);


async function sendReminderEmails(invocationDate = new Date()) {
  const invocationIso = invocationDate.toISOString();
  console.log(`\n📧 [DEBUG] sendReminderEmails funkcija paleista: ${invocationIso}`);

  logAllReservationsDebug();

  try {
    const { minTime, maxTime } = getReminderWindow(invocationDate);

    console.log(`📧 [DEBUG] Ieškoma rezervacijų, kurios prasideda per ${REMINDER_WINDOW_MINUTES.min}-${REMINDER_WINDOW_MINUTES.max} minučių`);
    console.log(`📧 [DEBUG] Min laikas (Vilnius): ${minTime}`);
    console.log(`📧 [DEBUG] Max laikas (Vilnius): ${maxTime}`);

    const reminderQuery = `
      SELECT id, name, email, phone, reservation_date, service_type
      FROM reservations
      WHERE reservation_date >= ?
        AND reservation_date <= ?
        AND (reminder_sent IS NULL OR reminder_sent = 0)
    `;

    let reservations = [];
    try {
      reservations = db.prepare(reminderQuery).all(minTime, maxTime);
    } catch (dbError) {
      if (dbError.message && dbError.message.includes('no such table')) {
        console.warn('📧 [DEBUG] Lentelė "reservations" dar nesukurta – priminimai praleidžiami.');
        return;
      }
      throw dbError;
    }

    console.log(`📧 [DEBUG] Rasta rezervacijų: ${reservations.length}`);

    if (reservations.length === 0) {
      console.log('📧 [DEBUG] Nėra rezervacijų, kurioms reikia siųsti priminimus');
      return;
    }

    for (const reservation of reservations) {
      await processReservationReminder(reservation);
    }
  } catch (error) {
    console.error('Klaida sendReminderEmails funkcijoje:', error.message);
  }
}

async function processReservationReminder(reservation) {
  try {
    const mailOptions = buildReminderMailOptions(reservation);
    await transporter.sendMail(mailOptions);

    try {
      db.prepare('UPDATE reservations SET reminder_sent = 1 WHERE id = ?').run(reservation.id);
    } catch (updateError) {
        console.error(`Nepavyko pažymėti rezervacijos #${reservation.id} kaip išsiųsto priminimo:`, updateError.message);
    }
  } catch (emailError) {
    console.error(`Klaida siunčiant priminimą ${reservation.email} (rezervacija #${reservation.id}):`, emailError.message);
  }
}

function buildReminderMailOptions(reservation) {
  const { html, text } = buildReminderEmailContent(reservation);
  return {
    from: process.env.EMAIL_USER,
    to: reservation.email,
    subject: `Priminimas: Jūsų paslaugos ${reservation.service_type} vizitas bus po 30 min`,
    html,
    text
  };
}

function buildReminderEmailContent(reservation) {
  const html = `
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
  `.trim();

  const text = [
    `Sveiki, ${reservation.name}!`,
    '',
    'Primename, kad jūsų užsakytos paslaugos laikas artėja:',
    '',
    `Paslauga: ${reservation.service_type}`,
    `Data ir laikas: ${reservation.reservation_date}`,
    `Telefonas: ${reservation.phone}`,
    '',
    'Prašome atvykti laiku!',
    '',
    'Su pagarba,',
    'Variklio Sala'
  ].join('\n');

  return { html, text };
}


setInterval(sendReminderEmails, 2 * 60 * 1000);


sendReminderEmails();


app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password required' 
    });
  }
``
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


app.get('/api/photos', async (req, res) => {
  try {
    const { type } = req.query;
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


app.delete('/api/photos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const photo = db.prepare('SELECT photo_url FROM photos WHERE id = ?').get(id);
    
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Nuotrauka nerasta' });
    }
    if (photo.photo_url) {
      const relativePath = photo.photo_url.startsWith('/') 
        ? photo.photo_url.substring(1)
        : photo.photo_url;
      
      const filePath = join(__dirname, '..', relativePath);
      
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (fileError) {
          console.error(`Error deleting file ${filePath}:`, fileError);
        }
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    }

    db.prepare('DELETE FROM photos WHERE id = ?').run(id);

    res.status(200).json({ success: true, message: 'Nuotrauka sėkmingai ištrinta' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ success: false, message: 'Klaida ištrinant nuotrauką', error: error.message });
  }
});


app.get('/api/reservations/date/:date', async (req, res) => {
  const { date } = req.params;
  const { service_type } = req.query;
  
  try {
    let query = `
      SELECT reservation_date, service_type
      FROM reservations 
      WHERE DATE(reservation_date) = ?
    `;
    let params = [date];
    
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

app.post('/api/reservations', async (req, res) => {
  const { name, email, phone, reservation_date, service_type, additional_info } = req.body;

  if (!name || !email || !phone || !reservation_date || !service_type) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email, phone, reservation_date, and service_type are required' 
    });
  }

  try {
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
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `;
    const currentVilniusTime = getVilniusTime();
    const values = [name, email, phone, reservation_date, service_type, additional_info || null, currentVilniusTime];
    
    const result = db.prepare(query).run(values);
    const inserted = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({ 
      success: true, 
      message: 'Reservation created successfully',
      data: inserted
    });
    
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "noreikafaustas@gmail.com",
      subject: `Nauja rezervacija: ${service_type}`,
      text: `Nauja rezervacija:\n\nVardas: ${name}\nTelefonas: ${phone}\nData ir laikas: ${reservation_date}\nPaslauga: ${service_type}\nPapildoma informacija: ${additional_info || 'Nėra papildomos informacijos'}`
    }).catch(emailError => {
      console.error('Error sending email notification:', emailError);
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

app.delete('/api/reservations/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
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

app.listen(PORT, () => {
  const vilniusTime = getVilniusTime();
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`🕐 Dabartinis Vilniaus laikas: ${vilniusTime}`);
});
