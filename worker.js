export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================================================
    // API : génération de contenu
    // =========================================================
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const data = await request.json();

        const type = data.type || "publication";
        const subject = data.subject || "";
        const platform = data.platform || "Facebook";
        const tone = data.tone || "professionnel";

        if (!subject.trim()) {
          return json({
            success: false,
            error: "Veuillez entrer un sujet."
          }, 400);
        }

        // =====================================================
        // Workers AI
        // =====================================================
        if (env.AI) {
          const prompt = `
Tu es Lompo Creator IA, un assistant expert en création de contenu,
marketing digital et communication pour les entrepreneurs francophones
d'Afrique.

Ta mission est de créer un contenu professionnel, naturel, accrocheur,
convaincant et directement utilisable.

Type : ${type}
Plateforme : ${platform}
Sujet : ${subject}
Ton : ${tone}

RÈGLES OBLIGATOIRES :

- Écris uniquement en français.
- Adapte le contenu à la plateforme choisie.
- Commence par une accroche forte qui attire immédiatement l'attention.
- Apporte rapidement de la valeur.
- Utilise un français simple, naturel, professionnel et puissant.
- Fais des phrases courtes et faciles à lire.
- Évite les introductions inutiles.
- Évite les répétitions.
- Mets l'accent sur les bénéfices concrets pour le lecteur ou le client.
- Utilise un appel à l'action clair à la fin.
- Adapte la longueur au type de contenu demandé.
- Sois persuasif sans exagération ni fausses promesses.
- N'invente jamais de prix, numéro, adresse, offre ou information non fournie.
- Ne dis jamais que tu es une IA.
- Ne donne aucune explication sur ton raisonnement.
- Donne directement le contenu final.

FORMAT :

- N'utilise AUCUN Markdown.
- N'utilise jamais **.
- N'utilise jamais ##.
- N'utilise jamais # pour créer des titres.
- N'utilise jamais de texte entre astérisques.
- N'ajoute pas "Voici votre publication".
- N'ajoute pas "Voici le contenu".
- N'ajoute aucune formule d'introduction inutile.
- Le résultat doit être propre et directement copiable et publiable.
`;

          const messages = [
            {
              role: "system",
              content:
                "Tu es Lompo Creator IA, expert en création de contenu digital, marketing et communication."
            },
            {
              role: "user",
              content: prompt
            }
          ];

          // Appel réel à Workers AI
          const result = await env.AI.run(
            "@cf/meta/llama-3.1-8b-instruct",
            {
              messages,
              max_tokens: 800,
              temperature: 0.7
            }
          );

          let content =
            result?.response ||
            result?.result?.response ||
            "Aucun contenu généré.";

          // Nettoyage du Markdown éventuel
          content = content
            .replace(/\*\*/g, "")
            .replace(/^#{1,6}\s*/gm, "")
            .replace(/\*([^*]+)\*/g, "$1")
            .trim();

          return json({
            success: true,
            content: content,
            mode: "ai"
          });
        }

        // =====================================================
        // Mode de secours si Workers AI n'est pas disponible
        // =====================================================
        const fallback = createFallbackContent(
          type,
          subject,
          platform,
          tone
        );

        return json({
          success: true,
          content: fallback,
          mode: "demo"
        });

      } catch (error) {
        return json({
          success: false,
          error: "Erreur lors de la génération.",
          details: error?.message || "Erreur inconnue."
        }, 500);
      }
    }

    // =========================================================
    // API : génération de prompt
    // =========================================================
    if (url.pathname === "/api/prompt" && request.method === "POST") {
      try {
        const data = await request.json();

        const subject = data.subject || "";
        const style = data.style || "premium";
        const format = data.format || "publicité";

        if (!subject.trim()) {
          return json({
            success: false,
            error: "Veuillez entrer le sujet du prompt."
          }, 400);
        }

        const prompt = `
Créer une image ${format} ${style}, professionnelle et très accrocheuse,
sur le thème : ${subject}.

Direction artistique :
- rendu premium
- composition professionnelle
- sujet principal clairement visible
- éclairage cinématographique
- profondeur et contraste
- détails réalistes
- espace visuel équilibré
- rendu publicitaire haut de gamme
- image adaptée aux réseaux sociaux
- sans texte déformé
- haute qualité
`;

        return json({
          success: true,
          prompt: prompt.trim()
        });

      } catch (error) {
        return json({
          success: false,
          error: "Erreur lors de la création du prompt.",
          details: error?.message || "Erreur inconnue."
        }, 500);
      }
    }

    // =========================================================
    // Page principale
    // =========================================================
    if (request.method === "GET") {
      return new Response(HTML_PAGE, {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};


// =============================================================
// Fonction JSON
// =============================================================
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "access-control-allow-origin": "*"
    }
  });
}


// =============================================================
// Contenu de secours
// =============================================================
function createFallbackContent(type, subject, platform, tone) {

  if (type === "publicite") {
    return `🔥 ${subject}

Vous cherchez une solution simple, professionnelle et efficace ?

Découvrez une approche pensée pour vous aider à obtenir de meilleurs résultats et à développer votre activité.

✅ Simple
✅ Professionnelle
✅ Adaptée à vos besoins

📲 Passez à l'action dès maintenant.

Contactez-nous pour plus d'informations.`;
  }

  if (type === "prompt") {
    return `Prompt professionnel :

Créer une image premium sur le thème "${subject}",
avec un rendu réaliste, moderne et professionnel,
une composition accrocheuse, un éclairage cinématographique,
des détails précis et une qualité adaptée aux réseaux sociaux.`;
  }

  if (type === "accroche") {
    return `🔥 ${subject}

Et si la meilleure façon d'obtenir des résultats était simplement de commencer ?

Découvrez une nouvelle approche, créez de la valeur et passez à l'action.

👉 ${platform} | Ton : ${tone}`;
  }

  return `🚀 ${subject}

Aujourd'hui, la différence ne se fait pas seulement avec une bonne idée,
mais avec la manière dont elle est présentée.

Apportez de la valeur, soyez constant et construisez une présence
qui inspire confiance.

👉 Commencez dès maintenant.`;
}


// =============================================================
// PAGE HTML
// =============================================================
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="fr">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>Lompo Creator IA</title>

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f5f7fb;
  color: #172033;
}

header {
  background: linear-gradient(135deg, #111827, #4f46e5);
  color: white;
  padding: 28px 20px;
}

header h1 {
  margin: 0;
  font-size: 28px;
}

header p {
  margin: 8px 0 0;
  opacity: .85;
}

.container {
  max-width: 850px;
  margin: auto;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 18px;
  box-shadow: 0 8px 30px rgba(0,0,0,.06);
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

input,
textarea,
select {
  width: 100%;
  padding: 14px;
  border: 1px solid #d8deea;
  border-radius: 12px;
  font-size: 16px;
  margin-bottom: 15px;
}

textarea {
  min-height: 130px;
  resize: vertical;
}

button {
  width: 100%;
  border: 0;
  padding: 15px;
  border-radius: 12px;
  background: #4f46e5;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

button:active {
  transform: scale(.98);
}

.result {
  white-space: pre-wrap;
  background: #f7f8fc;
  border-radius: 12px;
  padding: 16px;
  line-height: 1.6;
  margin-top: 15px;
  min-height: 80px;
}

.hidden {
  display: none;
}

.badge {
  display: inline-block;
  background: rgba(255,255,255,.15);
  padding: 6px 10px;
  border-radius: 20px;
  margin-top: 12px;
  font-size: 13px;
}

</style>

</head>

<body>

<header>

  <div class="container">

    <h1>✨ Lompo Creator IA</h1>

    <p>
      Ton assistant intelligent pour créer du contenu professionnel.
    </p>

    <span class="badge">
      Création • Marketing • Business
    </span>

  </div>

</header>


<main class="container">


  <!-- CRÉATION DE CONTENU -->

  <div class="card">

    <h2>🚀 Créer un contenu</h2>


    <label>Type de contenu</label>

    <select id="type">

      <option value="publication">
        Publication
      </option>

      <option value="publicite">
        Publicité
      </option>

      <option value="accroche">
        Accroche
      </option>

      <option value="prompt">
        Prompt IA
      </option>

    </select>


    <label>Plateforme</label>

    <select id="platform">

      <option>Facebook</option>

      <option>Instagram</option>

      <option>WhatsApp</option>

      <option>TikTok</option>

      <option>LinkedIn</option>

    </select>


    <label>Ton</label>

    <select id="tone">

      <option value="professionnel">
        Professionnel
      </option>

      <option value="accrocheur">
        Accrocheur
      </option>

      <option value="premium">
        Premium
      </option>

      <option value="persuasif">
        Persuasif
      </option>

      <option value="simple">
        Simple
      </option>

    </select>


    <label>Ton sujet</label>

    <textarea
      id="subject"
      placeholder="Exemple : publicité pour vendre mes services de création de flyers..."
    ></textarea>


    <button onclick="generateContent()">
      ✨ Générer avec Lompo Creator IA
    </button>


    <div
      id="contentResult"
      class="result hidden"
    ></div>

  </div>


  <!-- GÉNÉRATEUR DE PROMPTS -->

  <div class="card">

    <h2>🎨 Générateur de prompts</h2>


    <label>Sujet de l'image</label>

    <textarea
      id="promptSubject"
      placeholder="Exemple : entrepreneur africain travaillant sur son ordinateur..."
    ></textarea>


    <label>Style</label>

    <select id="promptStyle">

      <option value="premium">
        Premium
      </option>

      <option value="réaliste">
        Réaliste
      </option>

      <option value="cinématographique">
        Cinématographique
      </option>

      <option value="publicitaire">
        Publicitaire
      </option>

      <option value="3D">
        3D
      </option>

    </select>


    <button onclick="generatePrompt()">
      🎨 Créer le prompt
    </button>


    <div
      id="promptResult"
      class="result hidden"
    ></div>

  </div>


</main>


<script>


// ============================================================
// GÉNÉRATION DE CONTENU
// ============================================================

async function generateContent() {

  const result =
    document.getElementById("contentResult");

  const subject =
    document.getElementById("subject").value.trim();


  if (!subject) {

    alert("Entre d'abord ton sujet.");

    return;
  }


  result.classList.remove("hidden");

  result.textContent =
    "⏳ Lompo Creator IA travaille...";


  try {

    const response = await fetch(
      "/api/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          type:
            document.getElementById("type").value,

          platform:
            document.getElementById("platform").value,

          tone:
            document.getElementById("tone").value,

          subject:
            subject

        })
      }
    );


    const data =
      await response.json();


    if (!data.success) {

      result.textContent =
        "❌ " +
        (
          data.error ||
          "Une erreur est survenue."
        );

      return;
    }


    result.textContent =
      data.content;


  } catch (error) {

    result.textContent =
      "❌ Impossible de contacter le serveur.";

  }

}


// ============================================================
// GÉNÉRATION DE PROMPT
// ============================================================

async function generatePrompt() {

  const result =
    document.getElementById("promptResult");

  const subject =
    document
      .getElementById("promptSubject")
      .value
      .trim();


  if (!subject) {

    alert("Entre le sujet de ton image.");

    return;
  }


  result.classList.remove("hidden");

  result.textContent =
    "⏳ Création du prompt...";


  try {

    const response = await fetch(
      "/api/prompt",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          subject: subject,

          style:
            document
              .getElementById("promptStyle")
              .value

        })
      }
    );


    const data =
      await response.json();


    if (!data.success) {

      result.textContent =
        "❌ " +
        (
          data.error ||
          "Erreur."
        );

      return;
    }


    result.textContent =
      data.prompt;


  } catch (error) {

    result.textContent =
      "❌ Impossible de contacter le serveur.";

  }

}

</script>

</body>

</html>
`;
