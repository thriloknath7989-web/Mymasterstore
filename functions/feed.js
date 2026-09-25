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
    if (Array.isArray(body)) {
      // Full array vasthe direct save (push-all nundi)
      await env.MASTER_KV.put("master_feed", JSON.stringify(body));
      return new Response(JSON.stringify({ok:true, total: body.length}), { 
        headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"} 
      });
    } else {
      // Single product vasthe existing lo add
      const all = await env.MASTER_KV.get("master_feed", {type: "json"}) || [];
      all.unshift(body);
      await env.MASTER_KV.put("master_feed", JSON.stringify(all));
      return new Response(JSON.stringify({ok:true, total: all.length}), { 
        headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"} 
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function onRequest(context){
  if(context.request.method === "POST") return onRequestPost(context);
  if(context.request.method === "OPTIONS") return new Response(null,{headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}});
  return onRequestGet(context);
}
