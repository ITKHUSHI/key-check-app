import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

// Dummy user data (for simplicity, use a database in real scenarios)
let users = [
  { id: 1, userId: 'john_doe', password: 'securePass123', role: 'General-User', name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, userId: 'jane_smith', password: 'adminPass456', role: 'Admin', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 3, userId: 'michael_lee', password: 'passMichael789', role: 'General-User', name: 'Michael Lee', email: 'michael.lee@example.com' },
  { id: 4, userId: 'emma_wilson', password: 'emmaPass999', role: 'Admin', name: 'Emma Wilson', email: 'emma.wilson@example.com' },
  { id: 5, userId: 'sarah_connor', password: 'sarahC098', role: 'General-User', name: 'Sarah Connor', email: 'sarah.connor@example.com' }
];

// Dummy records
let records = [
  { id: 101, userId: 'john_doe', data: 'Purchased a premium subscription', timestamp: '2025-03-25T10:15:30Z' },
  { id: 102, userId: 'jane_smith', data: 'Updated user role settings', timestamp: '2025-03-24T08:45:10Z' },
  { id: 103, userId: 'jane_smith', data: 'Deleted an inactive user account', timestamp: '2025-03-23T14:30:50Z' },
  { id: 104, userId: 'michael_lee', data: 'Requested account verification', timestamp: '2025-03-22T12:10:05Z' },
  { id: 105, userId: 'emma_wilson', data: 'Modified system configuration', timestamp: '2025-03-21T16:05:15Z' },
  { id: 106, userId: 'sarah_connor', data: 'Uploaded profile picture', timestamp: '2025-03-20T09:55:40Z' }
];

/** User Login */
app.post('/api/login', (req: Request, res: Response) => {
  const { userId, password } = req.body;
  const user = users.find((u) => u.userId === userId && u.password === password);

  if (user) {
    res.json({ id: user.id, userId: user.userId, role: user.role, name: user.name, email: user.email });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

/** Fetch records */
app.get('/api/records', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const role = req.query.role as string;
  const delay = parseInt(req.query.delay as string) || 0;
  const mergedRecords = records.map(record => {
    const user = users.find(user => user.userId === record.userId);
    return user ? { ...user, ...record } : record;
  });
  console.log(mergedRecords)
  setTimeout(() => {
    if (role === 'Admin') {
      res.json(mergedRecords);
    } else {
      res.json(mergedRecords.filter((r) => r.userId === userId));
    }
  }, delay);
});

/** Get all users */
app.get('/api/users', (req: Request, res: Response) => {
  const userWithReocrds=users.map((user)=>{
    const userRecords=records.filter(record=>record.userId===user.userId);
    return {...user,records:userRecords};
  })
  res.json(userWithReocrds);
});

/** Add new user */
app.post('/api/users', (req: Request, res: Response) => {
  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);
  res.json(newUser);
});

/** Update user (Only userId and password can be updated) */
app.put('/api/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { userId, password, email, data } = req.body;

  let user = users.find((user) => user.id === id);
  if (user) {
    user.userId = userId || user.userId;
    user.password = password || user.password;
    user.email=email || user.email;
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

/** Delete user */
app.delete('/api/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  users = users.filter(user => user.id !== id);
  records = records.filter(record => record.userId !== users.find(u => u.id === id)?.userId); // Delete associated records
  res.json({ message: "User deleted" });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app;