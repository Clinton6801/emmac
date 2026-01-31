import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '../../../../lib/supabase';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
  const { data: user, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', credentials.email)
    .single();

  if (user) {
    // LOG THESE TO YOUR VS CODE TERMINAL (NOT BROWSER)
    console.log('--- SERVER SIDE DEBUG ---');
    console.log('Input Password:', credentials.password);
    console.log('DB Hashed Password:', user.password);
    
   // Add .trim() to both to be 100% safe
const match = await bcrypt.compare(
  credentials.password.trim(), 
  user.password.trim()
);
console.log('--- SERVER SIDE DEBUG ---');
console.log('Input Password (Trimmed):', credentials.password.trim());
console.log('Bcrypt Match Result:', match);

    
  }
  
  // ... rest of your logic
}
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };