export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ========================================
    // CORS
    // ========================================

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    // ========================================
    // API : GÉNÉRATION DE CONTENU
    // ========================================

    if (
      url.pathname === "/api/generate" &&
      request.method === "POST"
    ) {
      try {
        const data = await request.json();

        const type = String(
          data.type || "publication"
        ).trim();

        const subject = String(
          data.subject || ""
        ).trim();

        const platform = String(
          data.platform || "Facebook"
        ).trim();

        const tone = String(
          data.tone || "professionnel"
        ).trim();

        const objective = String(
          data.objective || "engager"
        ).trim();

        if (!subject) {
          return json(
            {
              success: false,
              error: "Veuillez entrer un sujet."
            },
            400
          );
        }

        // ====================================
        // WORKERS AI
        // ====================================

        if (env.AI) {
          const systemPrompt = `
Tu es Lompo Creator IA.

Tu es un expert premium francophone en :

- marketing digital
- communication
- copywriting
- publicité
- stratégie de contenu
- réseaux sociaux
- branding
- développement commercial

Tu travailles principalement avec les entrepreneurs,
commerçants, créateurs de contenu, freelances,
professionnels et petites entreprises d'Afrique francophone.

Ta mission est de transformer une idée simple en contenu
professionnel, naturel, convaincant et directement publiable.

Tu dois comprendre l'intention de l'utilisateur avant de rédiger.

Tu adaptes toujours le contenu :
- à la plateforme
- au type de contenu
- au ton
- à l'objectif
- au public visé
- au contexte commercial

Tu privilégies la clarté, l'impact et la valeur réelle.

Tu ne dois jamais expliquer ton raisonnement.

Tu ne dois jamais dire que tu es une IA.

Tu ne dois jamais commencer par une formule comme :
"Voici votre publication"
"Voici le contenu"
"Voici une proposition"
ou toute autre introduction technique.

Tu retournes directement le contenu final.
`;

          const userPrompt = `
MISSION : CRÉER UN CONTENU PREMIUM

TYPE DE CONTENU :
${type}

PLATEFORME :
${platform}

TON :
${tone}

OBJECTIF :
${objective}

SUJET DE L'UTILISATEUR :
${subject}


========================================
RÈGLES DE CRÉATION PREMIUM
========================================

1. COMMENCE PAR UNE ACCROCHE FORTE.

L'accroche doit immédiatement donner envie
de continuer à lire.

Elle peut utiliser :
- une question pertinente
- un problème courant
- une observation forte
- une promesse de valeur réaliste
- une idée surprenante
- une situation dans laquelle l'audience
  peut facilement se reconnaître

Évite les accroches génériques.


2. APPORTE DE LA VALEUR RAPIDEMENT.

Le lecteur doit comprendre rapidement
pourquoi le contenu mérite son attention.

Ne remplis jamais le texte avec des phrases inutiles.


3. UTILISE UN FRANÇAIS NATUREL.

Le français doit être :
- fluide
- moderne
- professionnel
- facile à comprendre
- adapté à l'Afrique francophone

Évite les traductions artificielles,
les formulations robotiques et les phrases trop compliquées.


4. ADAPTE LE CONTENU À LA PLATEFORME.

Facebook :
structure claire, humaine et engageante.

Instagram :
accroche visuelle, paragraphes courts,
lecture rapide et contenu facilement partageable.

WhatsApp :
style direct, humain, conversationnel
et orienté vers l'action.

TikTok :
accroche immédiate, rythme dynamique
et formulation courte.

LinkedIn :
style professionnel, crédible,
expert et orienté valeur.


5. RESPECTE LE TON DEMANDÉ.

Ton professionnel :
crédible, clair et sérieux.

Ton accrocheur :
plus énergique et captivant.

Ton premium :
élégant, précis et haut de gamme.

Ton persuasif :
orienté bénéfices et passage à l'action.

Ton simple :
naturel, accessible et facile à comprendre.


6. RESPECTE L'OBJECTIF.

Engager :
encourage les réactions, commentaires
ou échanges.

Attirer l'attention :
priorise l'accroche et l'intérêt immédiat.

Vendre :
présente clairement la valeur,
les bénéfices et une action naturelle.

Informer :
explique simplement et utilement.

Construire la confiance :
privilégie la crédibilité,
la transparence et la valeur.


7. METS L'ACCENT SUR LES BÉNÉFICES.

Ne te contente pas de décrire un produit,
un service ou une idée.

Explique pourquoi cela peut être utile
pour la personne concernée.


8. RESTE CRÉDIBLE.

N'invente jamais une information
qui n'a pas été fournie.

N'invente jamais :
- prix
- réduction
- promotion
- garantie
- numéro de téléphone
- adresse
- statistiques
- témoignages
- résultats
- dates
- liens
- certifications
- partenaires
- clients
- chiffres commerciaux


9. SI UNE INFORMATION MANQUE.

Travaille avec les informations disponibles.

Ne demande pas automatiquement
des précisions à l'utilisateur.

Ne fabrique jamais les informations manquantes.


10. CONTEXTE AFRIQUE FRANCOPHONE.

Le contenu peut être adapté aux réalités
des entrepreneurs et consommateurs
d'Afrique francophone.

Mais évite absolument les clichés.


11. CONTENU COMMERCIAL.

Si le sujet est commercial :

- montre clairement la valeur
- mets en avant les bénéfices
- rassure sans mentir
- évite les promesses irréalistes
- crée une envie naturelle d'agir

N'utilise pas de pression excessive.


12. STRUCTURE.

Utilise généralement :

Accroche

↓

Problème ou contexte

↓

Valeur / solution

↓

Bénéfices ou éléments importants

↓

Différenciation

↓

Appel à l'action


13. LONGUEUR.

Le contenu doit être suffisamment développé
pour être utile mais jamais inutilement long.

Privilégie l'efficacité.


14. LISIBILITÉ.

Utilise :
- paragraphes courts
- espaces
- listes simples lorsque nécessaire
- emojis avec modération

Évite les gros blocs de texte.


15. FORMAT.

Le contenu doit être directement copiable
et publiable.

N'ajoute aucune explication avant ou après.


16. MARKDOWN.

N'utilise pas de Markdown technique.

N'utilise jamais :

**
#
##
###

pour créer des titres.

N'utilise jamais de texte entouré
d'astérisques.


17. APPEL À L'ACTION.

Termine par un appel à l'action cohérent
avec l'objectif.

L'appel à l'action doit être naturel.

Ne force jamais artificiellement l'utilisateur.


18. RÈGLE ABSOLUE.

Retourne uniquement le contenu final.

Aucune analyse.
Aucun raisonnement.
Aucune explication.
Aucun titre technique.
`;

          const messages = [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ];

          let result;

          try {
            result = await env.AI.run(
              "@cf/meta/llama-3.1-8b-instruct-fast",
              {
                messages,
                max_tokens: 1000,
                temperature: 0.72,
                top_p: 0.9,
                repetition_penalty: 1.06
              }
            );
          } catch (aiError) {
            return json(
              {
                success: false,
                error:
                  "Workers AI n'a pas pu générer le contenu.",
                details:
                  aiError?.message ||
                  String(aiError)
              },
              500
            );
          }

          let content = extractAIResponse(result);

          if (!content) {
            return json(
              {
                success: false,
                error:
                  "Workers AI a répondu sans contenu."
              },
              500
            );
          }

          content = cleanGeneratedText(content);

          return json({
            success: true,
            content,
            mode: "ai"
          });
        }

        // ====================================
        // MODE SECOURS
        // ====================================

        const fallback = createFallbackContent(
          type,
          subject,
          platform,
          tone,
          objective
        );

        return json({
          success: true,
          content: fallback,
          mode: "demo"
        });

      } catch (error) {
        return json(
          {
            success: false,
            error:
              "Erreur lors de la génération.",
            details:
              error?.message ||
              String(error)
          },
          500
        );
      }
    }


    // ========================================
    // API : GÉNÉRATION DE PROMPT IA
    // ========================================

    if (
      url.pathname === "/api/prompt" &&
      request.method === "POST"
    ) {
      try {
        const data = await request.json();

        const subject = String(
          data.subject || ""
        ).trim();

        const style = String(
          data.style || "premium"
        ).trim();

        const format = String(
          data.format ||
          "publicité pour réseaux sociaux"
        ).trim();

        if (!subject) {
          return json(
            {
              success: false,
              error:
                "Veuillez entrer le sujet du prompt."
            },
            400
          );
        }

        if (env.AI) {
          const promptMessages = [
            {
              role: "system",
              content: `
Tu es Lompo Creator IA.

Tu es un directeur artistique expert
en création publicitaire digitale,
direction artistique et génération
de prompts pour images IA.

Tu crées des prompts précis,
détaillés, professionnels et premium.

Tu dois transformer une idée simple
en véritable brief visuel exploitable.

Tu réponds uniquement avec le prompt final.

Aucune introduction.
Aucune explication.
Aucun Markdown.
`
            },

            {
              role: "user",
              content: `
CRÉER UN PROMPT IMAGE PREMIUM

SUJET :
${subject}

STYLE :
${style}

FORMAT :
${format}


Le prompt doit préciser intelligemment :

- sujet principal
- apparence du sujet
- environnement
- contexte
- composition
- position des éléments
- cadrage
- angle de caméra
- perspective
- profondeur de champ
- éclairage
- ambiance
- palette de couleurs
- textures
- détails visuels
- réalisme
- direction artistique
- niveau de qualité
- rendu publicitaire
- adaptation aux réseaux sociaux

Le résultat doit être :
premium,
moderne,
réaliste,
élégant,
visuellement puissant
et professionnel.

Évite les éléments inutiles.

Évite les logos non demandés.

Évite les textes déformés.

Ne crée pas de fausses informations.

Retourne uniquement le prompt final.
`
            }
          ];

          try {
            const result = await env.AI.run(
              "@cf/meta/llama-3.1-8b-instruct-fast",
              {
                messages: promptMessages,
                max_tokens: 900,
                temperature: 0.68,
                top_p: 0.9,
                repetition_penalty: 1.05
              }
            );

            let generatedPrompt =
              extractAIResponse(result);

            if (generatedPrompt) {
              generatedPrompt =
                cleanGeneratedText(
                  generatedPrompt
                );

              return json({
                success: true,
                prompt: generatedPrompt,
                mode: "ai"
              });
            }

          } catch (aiError) {
            // Mode secours.
          }
        }


        // ====================================
        // PROMPT DE SECOURS
        // ====================================

        const fallbackPrompt =
          createFallbackPrompt(
            subject,
            style,
            format
          );

        return json({
          success: true,
          prompt: fallbackPrompt,
          mode: "demo"
        });

      } catch (error) {
        return json(
          {
            success: false,
            error:
              "Erreur lors de la création du prompt.",
            details:
              error?.message ||
              String(error)
          },
          500
        );
      }
    }


    // ========================================
    // PAGE PRINCIPALE
    // ========================================

    if (request.method === "GET") {
      return new Response(
        HTML_PAGE,
        {
          status: 200,
          headers: {
            "content-type":
              "text/html; charset=UTF-8",
            ...corsHeaders()
          }
        }
      );
    }


    // ========================================
    // ROUTE INEXISTANTE
    // ========================================

    return new Response(
      "Not Found",
      {
        status: 404,
        headers: corsHeaders()
      }
    );
  }
};


// ============================================
// EXTRACTION DE LA RÉPONSE IA
// ============================================

function extractAIResponse(result) {
  if (!result) {
    return "";
  }

  if (typeof result === "string") {
    return result;
  }

  if (
    typeof result.response === "string"
  ) {
    return result.response;
  }

  if (
    result.result &&
    typeof result.result.response === "string"
  ) {
    return result.result.response;
  }

  if (
    typeof result.output === "string"
  ) {
    return result.output;
  }

  if (
    result.result &&
    typeof result.result === "string"
  ) {
    return result.result;
  }

  return "";
}


// ============================================
// NETTOYAGE DU TEXTE IA
// ============================================

function cleanGeneratedText(content) {
  return String(content)
    .replace(/\r\n/g, "\n")
    .replace(/\*\*/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(
      /^(Voici votre publication|Voici le contenu|Voici votre texte|Voici une proposition)\s*:?\s*/i,
      ""
    )
    .trim();
}


// ============================================
// RÉPONSE JSON
// ============================================

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "content-type":
          "application/json; charset=UTF-8",
        ...corsHeaders()
      }
    }
  );
}


// ============================================
// CORS
// ============================================

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods":
      "GET, POST, OPTIONS",
    "access-control-allow-headers":
      "Content-Type"
  };
}


// ============================================
// CONTENU DE SECOURS
// ============================================

function createFallbackContent(
  type,
  subject,
  platform,
  tone,
  objective
) {
  if (type === "publicite") {
    return `
Votre activité mérite une communication
qui attire immédiatement l'attention.

Vous proposez ${subject}.

Une présentation claire et professionnelle
permet de mieux faire comprendre votre valeur
et de donner envie d'en savoir plus.

Sur ${platform}, l'objectif est simple :
présenter votre activité de manière claire,
crédible et attractive.

Découvrez ce que ${subject} peut apporter
à votre audience et passez à l'action.
`.trim();
  }


  if (type === "accroche") {
    return `
Et si la manière dont vous présentez
${subject} faisait toute la différence ?

Une bonne communication attire l'attention,
suscite l'intérêt et donne envie d'aller plus loin.

Votre prochaine publication peut commencer
par une idée simple mais puissante.
`.trim();
  }


  if (type === "prompt") {
    return createFallbackPrompt(
      subject,
      tone,
      "réseaux sociaux"
    );
  }


  return `
Votre activité mérite une communication
qui attire l'attention.

Vous souhaitez parler de ${subject} ?

Un bon contenu ne se contente pas
de présenter une idée.

Il doit attirer l'attention,
apporter de la valeur
et donner envie d'agir.

Créez un contenu clair,
professionnel et adapté
à votre audience.

Votre prochaine publication
peut commencer aujourd'hui.
`.trim();
}


// ============================================
// PROMPT IMAGE DE SECOURS
// ============================================

function createFallbackPrompt(
  subject,
  style,
  format
) {
  return `
Créer une image ${format},
style ${style},
sur le thème :

${subject}

Direction artistique premium :

sujet principal clairement visible,
composition publicitaire professionnelle,
cadrage équilibré,
perspective naturelle,
éclairage cinématographique,
profondeur de champ réaliste,
contraste maîtrisé,
textures détaillées,
rendu photoréaliste,
ambiance moderne et élégante,
palette de couleurs harmonieuse,
composition adaptée aux réseaux sociaux,
qualité publicitaire haut de gamme,
image nette,
détails précis,
aspect professionnel,
aucun élément inutile,
aucun texte déformé.
`.trim();
}


// ============================================
// INTERFACE
// ============================================

const HTML_PAGE = `
<!DOCTYPE html>
<html lang="fr">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<meta
  name="description"
  content="Lompo Creator IA - création de contenu professionnel avec intelligence artificielle"
>

<meta
  name="theme-color"
  content="#07102a"
>

<title>Lompo Creator IA</title>

<style>
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Arial,
    sans-serif;

  background:
    radial-gradient(
      circle at 50% -10%,
      #183b78 0%,
      #0b1634 38%,
      #050914 75%,
      #03050b 100%
    );

  color: #ffffff;
  min-height: 100vh;
}

button,
textarea,
select {
  font: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

.container {
  width: min(1100px, 94%);
  margin: 0 auto;
}

/* ========================================
   HEADER
======================================== */

header {
  padding: 18px 0;
  border-bottom:
    1px solid rgba(255, 255, 255, .08);

  background:
    rgba(3, 7, 18, .72);

  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.brand-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-mark {
  width: 46px;
  height: 46px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      135deg,
      #0a8cff,
      #6b35ff
    );

  border:
    1px solid rgba(255,255,255,.18);

  box-shadow:
    0 8px 30px rgba(30,120,255,.28);

  font-size: 22px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.logo-main {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: .4px;
}

.logo-main span {
  color: #ffd21c;
}

.logo-sub {
  margin-top: 5px;
  color: #8fa4cc;
  font-size: 11px;
  letter-spacing: .8px;
  text-transform: uppercase;
}

.premium {
  padding: 9px 13px;
  border-radius: 999px;

  border:
    1px solid rgba(255,210,28,.55);

  background:
    rgba(255,210,28,.08);

  color: #ffd21c;
  font-size: 12px;
  font-weight: 800;
}

/* ========================================
   HERO
======================================== */

.hero {
  text-align: center;
  padding: 46px 0 32px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 8px 13px;
  border-radius: 999px;

  background:
    rgba(24,168,255,.09);

  border:
    1px solid rgba(24,168,255,.25);

  color: #7dccff;
  font-size: 12px;
  font-weight: 700;
}

.hero h1 {
  margin: 18px auto 0;
  max-width: 850px;

  font-size:
    clamp(34px, 7vw, 62px);

  line-height: 1.04;
  letter-spacing: -1.8px;
}

.hero h1 span {
  color: #ffd21c;
}

.hero p {
  max-width: 700px;
  margin: 18px auto 0;

  color: #aebbd4;
  line-height: 1.7;
  font-size: 15px;
}

/* ========================================
   GRID
======================================== */

.grid {
  display: grid;

  grid-template-columns:
    minmax(280px, .9fr)
    minmax(320px, 1.1fr);

  gap: 20px;

  padding-bottom: 55px;
}

/* ========================================
   CARDS
======================================== */

.card {
  position: relative;

  background:
    linear-gradient(
      145deg,
      rgba(12, 25, 57, .96),
      rgba(5, 11, 27, .96)
    );

  border:
    1px solid rgba(71, 139, 255, .28);

  border-radius: 24px;
  padding: 22px;

  box-shadow:
    0 22px 70px rgba(0,0,0,.34);
}

.card::before {
  content: "";
  position: absolute;

  top: 0;
  left: 12%;
  right: 12%;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(45,161,255,.65),
      transparent
    );
}

.result-card {
  border-color:
    rgba(255,210,28,.35);
}

.card h2 {
  margin: 0 0 18px;

  font-size: 20px;
  letter-spacing: -.2px;
}

.card-description {
  color: #8f9fbe;
  font-size: 13px;
  line-height: 1.5;
  margin-top: -8px;
  margin-bottom: 17px;
}

/* ========================================
   FORM
======================================== */

label {
  display: block;

  margin:
    17px 0 8px;

  font-size: 13px;
  font-weight: 800;

  color: #dce6fb;
}

textarea,
select {
  width: 100%;

  border:
    1px solid #263b65;

  background:
    rgba(7, 17, 40, .94);

  color: #ffffff;

  border-radius: 14px;

  padding: 14px;

  outline: none;

  transition:
    border-color .2s,
    box-shadow .2s,
    transform .2s;
}

textarea {
  min-height: 145px;
  resize: vertical;
  line-height: 1.55;
}

textarea::placeholder {
  color: #667898;
}

textarea:focus,
select:focus {
  border-color: #168fff;

  box-shadow:
    0 0 0 3px
    rgba(22,143,255,.11);
}

select {
  appearance: auto;
  cursor: pointer;
}

/* ========================================
   GENERATE BUTTON
======================================== */

.generate {
  width: 100%;

  margin-top: 22px;

  padding: 17px;

  border: 0;
  border-radius: 15px;

  background:
    linear-gradient(
      135deg,
      #087dff,
      #6537ff
    );

  color: #ffffff;

  font-size: 15px;
  font-weight: 900;

  letter-spacing: .2px;

  cursor: pointer;

  box-shadow:
    0 12px 35px
    rgba(43, 103, 255, .28);

  transition:
    transform .15s,
    box-shadow .2s,
    opacity .2s;
}

.generate:hover {
  box-shadow:
    0 15px 42px
    rgba(43, 103, 255, .4);
}

.generate:active {
  transform: scale(.98);
}

.generate:disabled {
  opacity: .65;
  cursor: wait;
}

/* ========================================
   RESULT
======================================== */

.result {
  min-height: 300px;

  background:
    rgba(3, 10, 26, .9);

  border:
    1px solid #24385e;

  border-radius: 17px;

  padding: 18px;

  color: #edf4ff;

  line-height: 1.72;

  white-space: pre-wrap;

  overflow-wrap: anywhere;

  font-size: 14px;
}

.result.empty {
  color: #657797;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
}

/* ========================================
   ACTION BUTTONS
======================================== */

.actions {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 8px;

  margin-top: 12px;
}

.action {
  border: 1px solid #26395f;

  padding: 12px 8px;

  border-radius: 12px;

  background:
    #101d39;

  color: #dce7ff;

  font-size: 12px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background .2s,
    transform .15s,
    border-color .2s;
}

.action:hover {
  background: #18294d;
  border-color: #3d5b91;
}

.action:active {
  transform: scale(.97);
}

/* ========================================
   STATUS
======================================== */

.status {
  min-height: 20px;

  margin-top: 10px;

  color: #91a1c0;

  font-size: 12px;

  text-align: center;
}

.status.success {
  color: #6ee7b7;
}

.status.error {
  color: #ff8f8f;
}

/* ========================================
   TIP
======================================== */

.tip {
  margin-top: 15px;

  padding: 14px;

  border-radius: 14px;

  border:
    1px solid
    rgba(255,210,28,.2);

  background:
    rgba(255,210,28,.055);

  color: #e9d47a;

  font-size: 12px;
  line-height: 1.55;
}

/* ========================================
   PROMPT SECTION
======================================== */

.prompt-section {
  margin-bottom: 55px;
}

.prompt-card {
  background:
    linear-gradient(
      145deg,
      rgba(14, 25, 54, .97),
      rgba(5, 10, 24, .97)
    );

  border:
    1px solid rgba(107,53,255,.35);

  border-radius: 24px;

  padding: 23px;

  box-shadow:
    0 22px 70px rgba(0,0,0,.3);
}

.prompt-grid {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 16px;
}

.prompt-result {
  margin-top: 18px;
}

/* ========================================
   FOOTER
======================================== */

footer {
  border-top:
    1px solid rgba(255,255,255,.07);

  padding: 25px 0 35px;

  text-align: center;

  color: #687895;

  font-size: 12px;
}

footer strong {
  color: #ffd21c;
}

/* ========================================
   MOBILE
======================================== */

@media (max-width: 800px) {

  header {
    position: relative;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .prompt-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    padding-top: 32px;
  }

  .hero h1 {
    letter-spacing: -1px;
  }

}

@media (max-width: 520px) {

  .container {
    width: 92%;
  }

  header {
    padding: 14px 0;
  }

  .logo-mark {
    width: 42px;
    height: 42px;
  }

  .logo-main {
    font-size: 15px;
  }

  .logo-sub {
    font-size: 9px;
  }

  .premium {
    padding: 8px 10px;
    font-size: 10px;
  }

  .hero {
    padding:
      28px 0
      25px;
  }

  .hero h1 {
    font-size: 36px;
  }

  .hero p {
    font-size: 14px;
  }

  .card,
  .prompt-card {
    padding: 17px;
    border-radius: 20px;
  }

  .actions {
    grid-template-columns:
      repeat(3, 1fr);
  }

  .action {
    font-size: 11px;
    padding: 11px 5px;
  }

  .result {
    min-height: 250px;
    padding: 15px;
  }
}

</style>

</head>

<body>

<header>

  <div class="container brand">

    <div class="brand-left">

      <div class="logo-mark">
        ✨
      </div>

      <div class="logo-text">

        <div class="logo-main">
          LOMPO <span>CREATOR IA</span>
        </div>

        <div class="logo-sub">
          Création intelligente
        </div>

      </div>

    </div>

    <div class="premium">
      👑 PREMIUM
    </div>

  </div>

</header>


<main class="container">

  <section class="hero">

    <div class="hero-badge">
      🤖 Intelligence artificielle
      pour créateurs
    </div>

    <h1>
      Créez du contenu
      <span>plus puissant.</span>
    </h1>

    <p>
      Transformez vos idées en publications,
      publicités, accroches et prompts
      professionnels avec Lompo Creator IA.
    </p>

  </section>


  <div class="grid">


    <!-- ==================================
         PARAMÈTRES
    =================================== -->

    <div class="card">

      <h2>
        ⚙️ Créer un contenu
      </h2>

      <div class="card-description">
        Donnez votre idée à Lompo Creator IA.
        L'intelligence artificielle s'occupe
        de la transformer en contenu.
      </div>


      <label for="subject">
        Sujet de votre contenu
      </label>

      <textarea
        id="subject"
        maxlength="1500"
        placeholder="Exemple : je veux promouvoir mes services de création de flyers professionnels..."
      ></textarea>


      <label for="type">
        Type de contenu
      </label>

      <select id="type">

        <option value="publication">
          📝 Publication
        </option>

        <option value="publicite">
          📢 Publicité
        </option>

        <option value="accroche">
          🎯 Accroche
        </option>

        <option value="prompt">
          🎨 Prompt IA
        </option>

      </select>


      <label for="platform">
        Plateforme
      </label>

      <select id="platform">

        <option>
          Facebook
        </option>

        <option>
          Instagram
        </option>

        <option>
          WhatsApp
        </option>

        <option>
          TikTok
        </option>

        <option>
          LinkedIn
        </option>

      </select>


      <label for="tone">
        Ton
      </label>

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


      <label for="objective">
        Objectif
      </label>

      <select id="objective">

        <option value="engager">
          💬 Engager
        </option>

        <option value="attirer">
          👀 Attirer l'attention
        </option>

        <option value="vendre">
          💰 Vendre
        </option>

        <option value="informer">
          💡 Informer
        </option>

        <option value="construire la confiance">
          🤝 Construire la confiance
        </option>

      </select>


      <button
        id="generateButton"
        class="generate"
        onclick="generateContent()"
      >
        ✨ GÉNÉRER AVEC LOMPO IA
      </button>

      <div
        id="status"
        class="status"
      ></div>

    </div>


    <!-- ==================================
         RÉSULTAT
    =================================== -->

    <div class="card result-card">

      <h2>
        ✨ Votre résultat
      </h2>

      <div
        id="result"
        class="result empty"
      >
        Votre contenu généré
        apparaîtra ici.
      </div>


      <div class="actions">

        <button
          class="action"
          onclick="copyResult()"
        >
          📋 Copier
        </button>

        <button
          class="action"
          onclick="shareResult()"
        >
          📤 Partager
        </button>

        <button
          class="action"
          onclick="regenerateContent()"
        >
          🔄 Régénérer
        </button>

      </div>


      <div class="tip">
        💡 Conseil Lompo IA :
        plus votre sujet est précis,
        plus le résultat pourra être pertinent.
      </div>

    </div>

  </div>


  <!-- ====================================
       GÉNÉRATEUR DE PROMPTS
  ===================================== -->

  <section class="prompt-section">

    <div class="prompt-card">

      <h2>
        🎨 Générateur de prompts IA
      </h2>

      <div class="card-description">
        Transformez votre idée en prompt
        visuel professionnel pour vos créations.
      </div>


      <div class="prompt-grid">

        <div>

          <label for="promptSubject">
            Sujet de l'image
          </label>

          <textarea
            id="promptSubject"
            maxlength="1200"
            placeholder="Exemple : entrepreneur africain travaillant sur son ordinateur dans un bureau moderne..."
          ></textarea>

        </div>


        <div>

          <label for="promptStyle">
            Style visuel
          </label>

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


          <label for="promptFormat">
            Format
          </label>

          <select id="promptFormat">

            <option value="publication réseaux sociaux">
              Réseaux sociaux
            </option>

            <option value="publicité">
              Publicité
            </option>

            <option value="portrait">
              Portrait
            </option>

            <option value="affiche">
              Affiche
            </option>

            <option value="visuel carré">
              Visuel carré
            </option>

          </select>


          <button
            id="promptButton"
            class="generate"
            onclick="generatePrompt()"
          >
            🎨 CRÉER LE PROMPT
          </button>

        </div>

      </div>


      <div
        id="promptResult"
        class="result prompt-result empty"
      >
        Votre prompt apparaîtra ici.
      </div>


      <div class="actions">

        <button
          class="action"
          onclick="copyPrompt()"
        >
          📋 Copier
        </button>

        <button
          class="action"
          onclick="clearPrompt()"
        >
          🗑️ Effacer
        </button>

        <button
          class="action"
          onclick="generatePrompt()"
        >
          🔄 Régénérer
        </button>

      </div>

    </div>

  </section>

</main>


<footer>

  <div class="container">
    <strong>Lompo Creator IA</strong>
    — Création • Marketing • Business
  </div>

</footer>


<script>

let lastContent = "";
let lastPrompt = "";


/* ======================================
   GÉNÉRATION DE CONTENU
====================================== */

async function generateContent() {

  const subjectElement =
    document.getElementById("subject");

  const resultElement =
    document.getElementById("result");

  const statusElement =
    document.getElementById("status");

  const button =
    document.getElementById("generateButton");


  const subject =
    subjectElement.value.trim();


  if (!subject) {

    statusElement.textContent =
      "⚠️ Entre d'abord ton sujet.";

    statusElement.className =
      "status error";

    subjectElement.focus();

    return;
  }


  resultElement.classList.remove("empty");

  resultElement.textContent =
    "⏳ Lompo Creator IA prépare votre contenu...";

  statusElement.textContent =
    "Génération en cours...";

  statusElement.className =
    "status";


  button.disabled = true;

  button.textContent =
    "⏳ GÉNÉRATION EN COURS...";


  try {

    const response =
      await fetch(
        "/api/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            type:
              document
                .getElementById("type")
                .value,

            platform:
              document
                .getElementById("platform")
                .value,

            tone:
              document
                .getElementById("tone")
                .value,

            objective:
              document
                .getElementById("objective")
                .value,

            subject:
              subject

          })
        }
      );


    const data =
      await response.json();


    if (!data.success) {

      resultElement.textContent =
        "❌ " +
        (
          data.error ||
          "Une erreur est survenue."
        );

      statusElement.textContent =
        "La génération a échoué.";

      statusElement.className =
        "status error";

      return;
    }


    lastContent =
      String(data.content || "")
        .trim();


    resultElement.textContent =
      lastContent ||
      "Aucun contenu généré.";


    statusElement.textContent =
      data.mode === "ai"
        ? "✓ Contenu généré par Lompo IA"
        : "✓ Mode secours actif";

    statusElement.className =
      "status success";


  } catch (error) {

    resultElement.textContent =
      "❌ Impossible de contacter le serveur.";

    statusElement.textContent =
      "Vérifie ta connexion puis réessaie.";

    statusElement.className =
      "status error";

  } finally {

    button.disabled = false;

    button.textContent =
      "✨ GÉNÉRER AVEC LOMPO IA";
  }
}


/* ======================================
   RÉGÉNÉRATION
====================================== */

function regenerateContent() {

  const subject =
    document
      .getElementById("subject")
      .value
      .trim();


  if (!subject) {

    document
      .getElementById("status")
      .textContent =
        "⚠️ Entre d'abord un sujet.";

    return;
  }


  generateContent();
}


/* ======================================
   COPIER LE CONTENU
====================================== */

async function copyResult() {

  const result =
    document
      .getElementById("result")
      .textContent
      .trim();


  if (!result ||
      result === "Votre contenu généré apparaîtra ici.") {

    return;
  }


  try {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      await navigator.clipboard.writeText(
        result
      );

    } else {

      const textarea =
        document.createElement("textarea");

      textarea.value = result;

      textarea.style.position =
        "fixed";


    textarea.style.left =
  "-9999px";

textarea.style.top =
  "0";

textarea.style.opacity =
  "0";

document.body.appendChild(
  textarea
);

textarea.focus();

textarea.select();

document.execCommand(
  "copy"
);

textarea.remove();

showStatus(
  "✅ Contenu copié !",
  "success"
);

return;

} catch (error) {

showStatus(
  "❌ Impossible de copier le contenu.",
  "error"
);

}

}


// ======================================
// PARTAGER
// ======================================

async function shareResult() {

const result =
  document
    .getElementById("result")
    .textContent
    .trim();

if (
  !result ||
  result ===
    "Votre contenu généré apparaîtra ici."
) {

return;
}

try {

if (navigator.share) {

await navigator.share({
title:
  "Lompo Creator IA",
text:
  result
});

return;

}

await copyResult();

} catch (error) {

if (
error &&
error.name === "AbortError"
) {

return;

}

showStatus(
"❌ Le partage n'est pas disponible.",
"error"
);

}

}


// ======================================
// GÉNÉRATION DE PROMPT
// ======================================

async function generatePrompt() {

const subject =
document
.getElementById("promptSubject")
.value
.trim();

const style =
document
.getElementById("promptStyle")
.value;

const format =
document
.getElementById("promptFormat")
.value;

const result =
document
.getElementById("promptResult");

const button =
document
.getElementById("promptButton");

if (!subject) {

result.classList.remove("empty");

result.textContent =
"⚠️ Entre le sujet de ton image.";

return;

}

button.disabled = true;

button.textContent =
"⏳ CRÉATION...";

result.classList.remove("empty");

result.textContent =
"⏳ Lompo IA crée votre prompt...";

try {

const response =
await fetch(
"/api/prompt",
{
method:
"POST",

headers: {
"Content-Type":
"application/json"
},

body:
JSON.stringify({
subject:
subject,

style:
style,

format:
format
})
}
);

const data =
await response.json();

if (
!response.ok ||
!data.success
) {

throw new Error(
data.error ||
"Erreur lors de la création du prompt."
);

}

lastPrompt =
String(
data.prompt || ""
).trim();

result.textContent =
lastPrompt ||
"Aucun prompt généré.";

showStatus(
"✅ Prompt généré !",
"success"
);

} catch (error) {

result.textContent =
"❌ Impossible de créer le prompt.";

showStatus(
error.message ||
"Erreur lors de la création du prompt.",
"error"
);

} finally {

button.disabled = false;

button.textContent =
"🎨 CRÉER LE PROMPT";

}

}


// ======================================
// COPIER LE PROMPT
// ======================================

async function copyPrompt() {

const result =
document
.getElementById("promptResult")
.textContent
.trim();

if (
!result ||
result ===
"Votre prompt apparaîtra ici."
) {

showStatus(
"⚠️ Aucun prompt à copier.",
"error"
);

return;

}

try {

if (
navigator.clipboard &&
window.isSecureContext
) {

await navigator.clipboard.writeText(
result
);

} else {

const textarea =
document.createElement(
"textarea"
);

textarea.value =
result;

textarea.style.position =
"fixed";

textarea.style.left =
"-9999px";

document.body.appendChild(
textarea
);

textarea.focus();

textarea.select();

document.execCommand(
"copy"
);

textarea.remove();

}

showStatus(
"✅ Prompt copié !",
"success"
);

} catch (error) {

showStatus(
"❌ Impossible de copier le prompt.",
"error"
);

}

}


// ======================================
// EFFACER LE PROMPT
// ======================================

function clearPrompt() {

document
.getElementById("promptSubject")
.value = "";

const result =
document
.getElementById("promptResult");

result.className =
"result empty";

result.textContent =
"Votre prompt apparaîtra ici.";

}


// ======================================
// AFFICHAGE DES STATUTS
// ======================================

function showStatus(
message,
type = ""
) {

const status =
document
.getElementById("status");

status.textContent =
message;

status.className =
"status " + type;

setTimeout(
function() {

status.textContent =
"";

status.className =
"status";

},
3500
);

}


// ======================================
// RACCOURCI CLAVIER
// ======================================

document.addEventListener(
"keydown",
function(event) {

if (
(event.ctrlKey ||
event.metaKey) &&
event.key === "Enter"
) {

event.preventDefault();

generateContent();

}

}
);

</script>

</body>

</html>
`;
