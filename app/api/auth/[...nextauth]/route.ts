import NextAuth from "next-auth";
import Credentials  from "next-auth/providers/credentials";
import { dbConnect } from "../../../../lib/dbConnect";
import { User } from "../../../../models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        Credentials({
            name:"Credentials",
            credentials: {
                email: {label: "Email",type: "text"},
                password : {label: "Password", type:"password"},
            },
            async authorize(credentials){
                console.log("Incoming credentials:", credentials);

                await dbConnect();
                
                const user = await User.findOne({email: credentials?.email})
                if (!user) throw new Error("User not found");

                const isValid =  await bcrypt.compare(
                    credentials!.password,
                    user.password
                )
                if(!isValid) throw new Error("Invalid Password")

                return{
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name
                }
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async session({session, token}){
            if(token){
                (session.user as any)._id = token._id;
            }
            return session;
        },
        async jwt({token, user}) {
            if(user){
                token.id = user.id
            }
            return token
        },
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };
