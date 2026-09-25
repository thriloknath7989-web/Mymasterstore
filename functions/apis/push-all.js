export async function onRequestPost(context) {
  try {
    const kv = context.env.MASTER_KV;
    const body = await context.request.json();
    
    if (Array.isArray(body)) {
      // Admin nundi full feed vasthe direct save
      await kv.put("master_feed", JSON.stringify(body));
      return new Response(JSON.stringify({success: true, total: body.length, product: "All Products Saved"}), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    } else {
      // Single product vasthe
      let existing = await kv.get("master_feed", "json") || [];
      existing.unshift(body);
      await kv.put("master_feed", JSON.stringify(existing));
      return new Response(JSON.stringify({success: true, total: existing.length, product: body.name}), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({error: e.message}), { 
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestGet(context) {
  const kv = context.env.MASTER_KV;
  let feed = await kv.get("master_feed", "json") || [];
  return new Response(JSON.stringify(feed), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
