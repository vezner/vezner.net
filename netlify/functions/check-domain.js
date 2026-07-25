export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  const domain = event.queryStringParameters?.domain;
  if (!domain) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el parámetro domain" }) };
  }

  const clean = domain.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

  try {
    const rdapUrl = `https://rdap.org/domain/${clean}`;
    
    // Fallback manual timeout timeout para asegurar compatibilidad con versiones anteriores de Node.js
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const res = await fetch(rdapUrl, {
      headers: { Accept: "application/rdap+json" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.status === 200) {
      const data = await res.json();
      const status = data?.status || [];
      const registrant = data?.entities?.find(e => e.roles?.includes("registrant"));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          available: false,
          domain: clean,
          status,
          registrant: registrant?.vcardArray?.[1]?.find(f => f[0] === "fn")?.[3] || null,
          expiration: data?.events?.find(e => e.eventAction === "expiration")?.eventDate || null,
        }),
      };
    }

    if (res.status === 404) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ available: true, domain: clean }),
      };
    }

    // Si rdap.org devuelve 429 (Rate Limit) u otro error, lanzamos excepción para forzar el fallback DNS
    throw new Error(`RDAP falló con status ${res.status}`);
  } catch (err) {
    // Fallback: Check DNS if RDAP times out or fails
    try {
      const dnsRes = await fetch(`https://dns.google/resolve?name=${clean}&type=NS`);
      const dnsData = await dnsRes.json();
      if (dnsData.Status === 3) {
        // NXDOMAIN = Dominio no existe = Disponible
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ available: true, domain: clean, fallback: true }),
        };
      }
      
      if (dnsData.Answer && dnsData.Answer.length > 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ available: false, domain: clean, fallback: true }),
        };
      }
    } catch (dnsErr) {
      // Ignore DNS errors and fall through to available: null
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ available: null, domain: clean, error: "Timeout o TLD no soportado por RDAP" }),
    };
  }
};
