Login/Signup/Sessions/Logout (this week)

Components
Input (placeholder)
Type = form? error states on form
Tags (square, rounded, with icon (allow svg))

Bottomline Assets
Success!
Email Template

Unknown

- JWTs
- Sessions and redis
- Invite link
- Reset password or confirm account

Technologies (all unknown)

- Terraform to spin up A server
- Redis for sessions and JWTs
- Microservice and Rabbit MQ for emails

Logistic

- No multi-step form, just one

So, in reality, the right solution is probably: use UUIDs for keys, and don’t ever expose them. The external/internal thing is probably best left to things like friendly-url treatments, and then (as Medium does) with a hashed value tacked on the end. Thanks Chris!
