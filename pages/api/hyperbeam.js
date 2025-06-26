export default async function handler(req, res) {
  const API_KEY = process.env.HYPERBEAM_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing Hyperbeam API key" });
  }

  try {
    const payload = { expires_in: 300 };
    const response = await fetch("https://engine.hyperbeam.com/v0/vm", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error || "Error creating session" });
    }

    if (data.embed_url && data.session_id) {
      // ✅ We only send the safe embed_url + session_id
      return res.status(200).json({ url: data.embed_url, session_id: data.session_id });
    } else {
      return res.status(500).json({ error: "Missing required fields" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
