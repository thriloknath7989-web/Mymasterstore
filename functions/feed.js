export async function onRequestGet({ env }) {
  try {
    const data = await env.MASTER_KV.get("master_feed", {type: "json"}) || [];
    return new Response(JSON.stringify(data), { 
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const all = await env.MASTER_KV.get("master_feed", {type: "json"}) || [];
    all.unshift(body);
    await env.MASTER_KV.put("master_feed", JSON.stringify(all));
    return new Response(JSON.stringify({ok:true, total: all.length}), { headers: {"Content-Type":"application/json"} });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
      }
