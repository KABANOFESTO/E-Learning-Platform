import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { prisma } from '../models/user.model';
import { JWT_SECRET } from '../config/jwt.config';

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWT_SECRET,
};

passport.use(
	new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			const user = await prisma.user.findUnique({ where: { id: jwt_payload.userId } });
			if (user) return done(null, user);
			return done(null, false);
		} catch (err) {
			return done(err, false);
		}
	})
);

export default passport;
