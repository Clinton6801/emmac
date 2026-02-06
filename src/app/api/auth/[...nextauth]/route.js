import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '../../../../lib/supabase';
import bcrypt from 'bcryptjs';

// 1. Force Node.js runtime to avoid Edge Runtime issues with bcrypt
export const runtime = 'nodejs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Basic check
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        const cleanEmail = credentials.email.trim().toLowerCase();
        const cleanPassword = credentials.password.trim();

        // Fetch user from Supabase
        const { data: user, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', cleanEmail)
          .single();

        // Log result to VS Code Terminal
        console.log('--- SERVER SIDE DEBUG ---');
        if (error || !user) {
          console.log('User not found in Database for:', cleanEmail);
          throw new Error('No user found with this email');
        }

        // 2. Perform Bcrypt Comparison
        const isPasswordValid = await bcrypt.compare(cleanPassword, user.password.trim());
        
        console.log('Input Password:', cleanPassword);
        console.log('DB Hashed Password:', user.password.trim());
        console.log('Bcrypt Match Result:', isPasswordValid);

        if (!isPasswordValid) {
          // If this is false, generate a fresh hash to copy into Supabase
          const freshHash = await bcrypt.hash(cleanPassword, 10);
          console.log('--- GENERATE NEW HASH ---');
          console.log('If you want this password to work, paste this into Supabase:');
          console.log(freshHash);
          console.log('-------------------------');
          throw new Error('Invalid password');
        }

        // Success - Return user object
        console.log('Login Successful for:', user.email);
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  // 3. Add Debug mode to see detailed 401 errors in terminal
  debug: true, 
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  // Ensure this matches your .env file
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };