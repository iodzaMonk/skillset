app/api/product/user/route.ts [23:32]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "x-referer": referer || "" },
    });
  } catch (error) {
    console.log(error);
    return new Response("Error", {
      status: 500,
      headers: { "x-referer": referer || "" },
    });
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/user/route.ts [75:84]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "x-referer": referer || "" },
    });
  } catch (error) {
    console.log(error);
    return new Response("Error", {
      status: 500,
      headers: { "x-referer": referer || "" },
    });
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



