import { query as q } from 'faunadb';
import NextAuth from 'next-auth';
import { session, signIn } from 'next-auth/client';
import Providers from 'next-auth/providers';
import { fauna } from '../../../services/fauna';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user'
    }),
    // ... and more providers here
  ],

  callbacks: {
    async session(session) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      }catch{
        return {
          ...session,
          activeSubscription: null
        }
      }
      
    },
    async signIn(user, account, profile) {
      const { name } = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_name'),
                  q.Casefold(user.name)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { name } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_name'),
                q.Casefold(user.name)
              )
            )
          )
        )

        return true
      } catch {
        return false
      }
    }
  }
})

