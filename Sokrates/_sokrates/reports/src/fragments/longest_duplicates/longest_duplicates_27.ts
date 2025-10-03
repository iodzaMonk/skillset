app/api/user/login/route.ts [34:40]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      return Response.json(
        { message: "Invalid credentials" },
        {
          status: 401,
          headers: { "x-referer": referer || "" },
        },
      );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/user/login/route.ts [49:55]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      return Response.json(
        { message: "Invalid credentials" },
        {
          status: 401,
          headers: { "x-referer": referer || "" },
        },
      );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



