app/api/user/login/route.ts [62:74]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        status: 200,
        headers: { "x-referer": referer || "" },
      },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Internal server error" },
      {
        status: 500,
        headers: { "x-referer": referer || "" },
      },
    );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/user/register/route.ts [56:68]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        status: 200,
        headers: { "x-referer": referer || "" },
      },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Internal server error" },
      {
        status: 500,
        headers: { "x-referer": referer || "" },
      },
    );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



