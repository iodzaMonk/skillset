app/lib/session.ts [9:17]:
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



app/lib/session.ts [26:34]:
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



