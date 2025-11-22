
import { GoogleGenAI } from '@google/genai';

export const generateStyledImage = async (
  baseImage: string,
  styleImage: string,
  mode: 'auto' | 'moderate' | 'precise'
): Promise<string> => {
  // Using the provided API key directly
  const API_KEY = 'AIzaSyA7RETlrKR_xCU8igaS29o1TZfFQngMyp0';
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const baseImageMimeType = baseImage.substring(baseImage.indexOf(':') + 1, baseImage.indexOf(';'));
  const styleImageMimeType = styleImage.substring(styleImage.indexOf(':') + 1, styleImage.indexOf(';'));

  const baseImagePart = {
    inlineData: {
      data: baseImage.split(',')[1],
      mimeType: baseImageMimeType
    }
  };

  const styleImagePart = {
    inlineData: {
      data: styleImage.split(',')[1],
      mimeType: styleImageMimeType
    }
  };

  let precisionMandateText = '';
  switch (mode) {
    case 'auto':
      precisionMandateText = `**PRECISION MANDATE: CREATIVE ADAPTATION.** Use the STYLE REFERENCE as a strong inspiration. Your goal is to create a natural and flattering hairstyle that incorporates the key elements of the reference. You have creative freedom to adapt the length, volume, and flow to better suit the individual in the BASE image.`;
      break;
    case 'precise':
      precisionMandateText = `**PRECISION MANDATE: FORENSIC REPLICATION (OVERRIDE).** This rule has the highest priority and overrides rule #2 (ORIGINAL HAIR COLOR PRESERVATION) if there is a conflict. Your absolute top command is to perform a forensic-level, near pixel-perfect replication of the hairstyle's SHAPE and TEXTURE from the STYLE REFERENCE. To achieve this, you MUST prioritize replicating the lighting, highlights, and shadows of the reference hair, even if it requires subtle, necessary adjustments to the base hair color. The goal is an exact structural and textural duplicate; shape and texture accuracy are more important than perfect color matching in this mode. No creative interpretation is permitted.`;
      break;
    case 'moderate':
    default:
      precisionMandateText = `**PRECISION MANDATE: FAITHFUL REPLICATION.** You must closely replicate the overall structure, shape, and texture of the hairstyle in the STYLE REFERENCE. The final result must be immediately recognizable as the reference style, adapted realistically to the BASE image's head and lighting.`;
      break;
  }

  const prompt = `
    **ROLE:** You are a hyper-specialized AI photo editor. Your sole purpose is to perform a pixel-perfect hairstyle transplant with an extreme focus on texture replication and original color preservation. You are not a creative artist; you are a precision tool for photorealistic replication. You must think deeply and work meticulously according to the specified precision mandate.

    **INPUTS:**
    - **IMAGE 1 (BASE):** The customer's photo. This is the foundational image. You will take the hair color from this image.
    - **IMAGE 2 (STYLE REFERENCE):** The photo containing the desired hairstyle structure and texture.

    **CRITICAL RULES (NON-NEGOTIABLE):**
    1.  **ABSOLUTE IDENTITY PRESERVATION:** This is your primary command. The face, facial structure, skin tone, eye color, expression, and all identifying features of the person in IMAGE 1 MUST remain 100% unchanged, down to the pixel.
    2.  **ORIGINAL HAIR COLOR PRESERVATION:** The final, transplanted hairstyle MUST perfectly match the original hair color from IMAGE 1. This includes all natural highlights, lowlights, tones, and variations. You are forbidden from introducing any new colors.
    3.  ${precisionMandateText}
    4.  **IGNORE STYLE REFERENCE IDENTITY & COLOR:** It is strictly forbidden to use any facial features, skin, identity, or hair color from IMAGE 2. Your only interest is the hairstyle's structure (shape, cut, volume) and texture.
    5.  **HIGH-FIDELITY TEXTURE REPLICATION:** You must replicate the texture of the hair from IMAGE 2 with extreme precision. This includes individual strands, curls, waves, straightness, coarseness, shine, and how light interacts with it. The final texture must feel identical to the reference style.
    6.  **BACKGROUND INTEGRITY:** The background of IMAGE 1 must not be altered in any way.

    **EXECUTION LOGIC (DEEP THINKING PROCESS):**
    1.  **DEEP ANALYSIS & EXTRACTION:**
        -   **From IMAGE 2 (Style):** Perform a deep analysis to digitally extract the hairstyle's complete structural and textural data according to the Precision Mandate: shape, volume, flow, cut, and its high-fidelity texture map. Capture the nuances of individual hair strands, frizz, and layering.
        -   **From IMAGE 1 (Base):** Identify the head, existing hairline, and lighting conditions. Crucially, perform a detailed color analysis of the original hair to extract its complete color palette, including highlights, midtones, and lowlights.
    2.  **METICULOUS TRANSPLANT & MAPPING:**
        -   Perform a meticulous, pixel-perfect transplant of the extracted hairstyle's shape and structure onto the head in IMAGE 1.
        -   Carefully map the high-fidelity texture from the style reference onto the new hairstyle shape. Ensure the texture flows naturally and realistically across the volume of the hair.
    3.  **INTEGRATION, COLORING & REFINEMENT:**
        -   Adjust the transplanted hair to perfectly match the head shape, lighting, shadows, and perspective of IMAGE 1. The light source in IMAGE 1 must dictate the final lighting on the new hair.
        -   Apply the original hair color palette (extracted from IMAGE 1) to the newly styled hair. Ensure the highlights and lowlights of the original color are correctly mapped to the new hairstyle's form under the scene's lighting.
        -   Render a completely natural hairline, seamlessly blended with the forehead. No hard edges.
        -   Ensure the hair does not obscure or alter the original facial features.

    **OUTPUT:**
    - You must output ONLY the final, edited image. Do not include any text, explanation, or apology.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        baseImagePart,
        styleImagePart,
        { text: prompt },
      ],
    },
    config: {
      imageConfig: {
        imageSize: '4K',
        aspectRatio: '1:1',
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error('No image was generated by the API. The model may not have been able to fulfill the request. Please try using different images.');
};
