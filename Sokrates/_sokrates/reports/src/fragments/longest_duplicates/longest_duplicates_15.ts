app/lib/session.ts [28:36]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  return session;
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/lib/session.ts [45:53]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  return session;
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



