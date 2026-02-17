#!/usr/bin/env node

const API_BASE = "https://api.cloudflare.com/client/v4";

function usage() {
  console.log(`Cloudflare CLI helper

Usage:
  npm run cf -- <command> [args]

Commands:
  verify-token
      Validate CLOUDFLARE_API_TOKEN and print token identity.

  zones:list
      List zones visible to the token.

  dns:list [zone]
      List DNS records for a zone name (e.g. ivo-tech.com).
      If omitted, uses CLOUDFLARE_ZONE_NAME.

  dns:upsert <zone> <type> <name> <content> [proxied]
      Create or update a DNS record by type+name.
      proxied: true|false (default false)

  dns:delete <zone> <recordId>
      Delete a DNS record by id.

  dns:ensure-vercel [zone]
      Ensure Vercel-ready DNS records:
      - <zone>              -> 76.76.21.21
      - www.<zone>          -> 76.76.21.21
      - staging.<zone>      -> 76.76.21.21
      Both with proxied=false.
      If zone omitted, uses CLOUDFLARE_ZONE_NAME or ivo-tech.com.
`);
}

function requireToken() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) {
    throw new Error("Missing CLOUDFLARE_API_TOKEN in environment.");
  }
  return token;
}

async function api(path, { method = "GET", body } = {}) {
  const token = requireToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let json;
  try {
    json = await res.json();
  } catch {
    const text = await res.text();
    throw new Error(`Cloudflare API parse error (${res.status}): ${text}`);
  }

  if (!res.ok || !json.success) {
    const errors = Array.isArray(json.errors)
      ? json.errors.map((e) => `${e.code ?? "?"}: ${e.message ?? JSON.stringify(e)}`).join("; ")
      : JSON.stringify(json);
    throw new Error(`Cloudflare API error (${res.status}): ${errors}`);
  }

  return json.result;
}

async function resolveZoneId(zoneName) {
  const envZoneId = process.env.CLOUDFLARE_ZONE_ID;
  if (envZoneId) return envZoneId;

  const result = await api(`/zones?name=${encodeURIComponent(zoneName)}&status=active`);
  if (!result.length) {
    throw new Error(`Zone not found: ${zoneName}`);
  }
  return result[0].id;
}

function parseBool(value, fallback = false) {
  if (value === undefined) return fallback;
  const normalized = String(value).toLowerCase().trim();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  throw new Error(`Invalid boolean value: ${value}. Use true or false.`);
}

async function listDns(zoneName) {
  const zoneId = await resolveZoneId(zoneName);
  const records = await api(`/zones/${zoneId}/dns_records?per_page=200`);
  for (const r of records) {
    console.log(`${r.id}\t${r.type}\t${r.name}\t${r.content}\tproxied=${Boolean(r.proxied)}`);
  }
}

async function upsertDns(zoneName, type, name, content, proxiedValue) {
  const zoneId = await resolveZoneId(zoneName);
  const proxied = parseBool(proxiedValue, false);

  const existing = await api(
    `/zones/${zoneId}/dns_records?type=${encodeURIComponent(type)}&name=${encodeURIComponent(name)}&per_page=200`
  );

  const payload = { type, name, content, ttl: 1, proxied };
  if (existing.length > 0) {
    const current = existing[0];
    const updated = await api(`/zones/${zoneId}/dns_records/${current.id}`, {
      method: "PUT",
      body: payload,
    });
    console.log(`updated\t${updated.id}\t${updated.type}\t${updated.name}\t${updated.content}\tproxied=${Boolean(updated.proxied)}`);
    return;
  }

  const created = await api(`/zones/${zoneId}/dns_records`, {
    method: "POST",
    body: payload,
  });
  console.log(`created\t${created.id}\t${created.type}\t${created.name}\t${created.content}\tproxied=${Boolean(created.proxied)}`);
}

async function deleteDns(zoneName, recordId) {
  const zoneId = await resolveZoneId(zoneName);
  await api(`/zones/${zoneId}/dns_records/${recordId}`, { method: "DELETE" });
  console.log(`deleted\t${recordId}`);
}

async function ensureVercel(zoneName) {
  const zone = zoneName || process.env.CLOUDFLARE_ZONE_NAME || "ivo-tech.com";
  const apex = zone;
  const www = `www.${zone}`;
  const staging = `staging.${zone}`;
  await upsertDns(zone, "A", apex, "76.76.21.21", "false");
  await upsertDns(zone, "A", www, "76.76.21.21", "false");
  await upsertDns(zone, "A", staging, "76.76.21.21", "false");
  console.log(`ok\tensured vercel records for ${zone}`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help" || command === "-h") {
    usage();
    return;
  }

  switch (command) {
    case "verify-token": {
      const result = await api("/user/tokens/verify");
      console.log(`status=${result.status}\tid=${result.id}`);
      return;
    }
    case "zones:list": {
      const zones = await api("/zones?per_page=200");
      for (const z of zones) {
        console.log(`${z.id}\t${z.name}\t${z.status}`);
      }
      return;
    }
    case "dns:list": {
      const zone = args[0] || process.env.CLOUDFLARE_ZONE_NAME;
      if (!zone) throw new Error("Usage: dns:list <zone> (or set CLOUDFLARE_ZONE_NAME)");
      await listDns(zone);
      return;
    }
    case "dns:upsert": {
      const [zone, type, name, content, proxied] = args;
      if (!zone || !type || !name || !content) {
        throw new Error("Usage: dns:upsert <zone> <type> <name> <content> [proxied]");
      }
      await upsertDns(zone, type, name, content, proxied);
      return;
    }
    case "dns:delete": {
      const [zone, recordId] = args;
      if (!zone || !recordId) {
        throw new Error("Usage: dns:delete <zone> <recordId>");
      }
      await deleteDns(zone, recordId);
      return;
    }
    case "dns:ensure-vercel": {
      await ensureVercel(args[0]);
      return;
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
