const authController = require('./controllers/authController');
const router = express.Router();

const appUrl = process.env.APP_URL || 'http://localhost:3005';

router.use(cors({
    origin: appUrl,
}))

router.post('/register', authController.register);

module.exports = router;