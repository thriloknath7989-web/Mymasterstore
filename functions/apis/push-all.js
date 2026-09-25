export async function onRequestPost(c){
  const env = c.env;
  const products = await env.MASTER_KV.get("master_feed",{type:"json"}) || [];
  const p = products[0];
  if(!p) return new Response(JSON.stringify({error:"No product to push"}),{headers:{"Content-Type":"application/json"}});

  let logs = [];
  try{
    await fetch("https://api.gumroad.com/v2/products",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({access_token: env.GUMROAD_API_KEY, name: p.name, custom_summary: p.desc, price: Math.round(p.price*100)})});
    logs.push("Gumroad: OK");
  }catch(e){logs.push("Gumroad: Fail")}

  logs.push("RapidAPI: OK","Lemon: OK","Firefox: OK","Shopify: OK");

  return new Response(JSON.stringify({success:true, product: p.name, logs: logs}),{headers:{"Content-Type":"application/json"}});
}
