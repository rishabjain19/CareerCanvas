
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const getResumeFeedback = async (req, res) => {
  try {
    const { fileData, mimeType, jobDescription } = req.body;

    if (!fileData || !mimeType || !jobDescription) {
      return res
        .status(400)
        .json({
          message:
            "Resume file, file type, and job description are all required",
        });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ message: "AI feature is not configured on the server" });
    }

    const prompt = `You are a resume reviewer. Compare the attached resume against this job description and respond with ONLY a JSON object (no markdown, no extra text) in exactly this shape:
{
  "matchPercent": <number 0-100>,
  "missingSkills": [<array of strings>],
  "suggestions": [<array of strings, 3-5 specific actionable suggestions>]
}

Job Description:
${jobDescription}`;

    const response = await fetch(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: fileData, 
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Gemini API error:", errBody);
      return res.status(502).json({ message: "AI service request failed" });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res
        .status(502)
        .json({ message: "AI service returned an unexpected response" });
    }

    
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response as JSON:", cleaned);
      return res.status(502).json({ message: "Could not parse AI response" });
    }

    res.status(200).json(parsed);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error during AI analysis",
        error: error.message,
      });
  }
};

module.exports = { getResumeFeedback };
