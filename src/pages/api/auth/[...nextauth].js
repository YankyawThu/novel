import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import axiosInstance from "@/services/axios";
import jwtDecode from "jwt-decode";
import Api from "@/services/api";

export const authOptions = {
    providers: [
        // ...provider here
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                try {
                    const { username, password, isMobile, deviceName, deviceOs, deviceId, ipAddress, gaUser } = credentials;
                    if(!username){
                        return Promise.reject(new Error('Username is required!'));
                    }
                    if(!password){
                        return Promise.reject(new Error('Password is required!'));
                    }
                    const res = await axiosInstance.post("/auth/login", {
                        username,
                        password,
                        isMobile,
                        deviceName,
                        deviceOs,
                        deviceId,
                        ipAddress
                    });
                    if(res.data.data){
                        const resData = res.data.data;
                        const user = {
                            id: resData.results.id,
                            name: resData.results.name,
                            username: resData.results.username,
                            phone: resData.results.phone,
                            email: resData.results.email,
                            gender: resData.results.gender,
                            profile: resData.results.profile,
                            lastActiveAt: resData.results.lastActiveAt,
                            refreshToken: resData.refreshToken,
                            accessToken: resData.accessToken
                        };
                        return user;
                    } else if(!res.data.data && res.data.error){
                        // throw new Error(res.data.error)
                        return Promise.reject(new Error(res.data.error));
                    } else {
                        return null
                    }
                } catch (error) {
                    return Promise.reject(new Error(error.message));
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        jwt: true,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            if(user){
                token.user = user
                token.id = user.id;
                token.username = user.username;
                token.name = user.name;
                token.email = user.email;
                token.profile = user.profile;
                token.phone = user.phone;
                token.gender = user.gender;
                token.lastActiveAt = user.lastActiveAt;

                token.refreshToken = user.refreshToken;
                token.accessToken = user.accessToken;
                
                const accessTokenExpiresAt = jwtDecode(user.accessToken).exp;

                if (accessTokenExpiresAt - Date.now() / 1000 < 60) {
                    const { data } = await Api.poster( null,'/user/profile', {
                        id: user.id,
                        refreshToken: user.refreshToken
                    });
                    user.accessToken = data.data.results.accessToken;
                    token.accessToken = data.data.results.accessToken;
                }
            }
            return token;
          },
    
        async session({ session, user, token }) {
            session.accessToken = token.accessToken
            session.user = token.user;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    }
}

export default NextAuth(authOptions)