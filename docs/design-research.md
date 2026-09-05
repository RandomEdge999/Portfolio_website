# ASCII portfolio: visual research and build direction

Research updated September 5, 2026. The current direction is dense white character art on black, character-built display lettering, and coordinated motion throughout the page.

## Living ASCII revision — September 5, 2026

The second review identified three concrete weaknesses: movement was confined to a slowly swaying hero, the four project sculptures were static, and conventional display typography separated the text from the art. The lab used a wide metadata column alongside short, width-limited descriptions, producing conspicuous empty areas.

The official [Hermes Agent website](https://hermes-agent.nousresearch.com/) was inspected directly in the browser. The current page has a blue background, large engraved illustrations, serif display headings, character-decoding call-to-action text, and a looping WebM figure in the footer. Its current heading stylesheet identifies a `displayFont` alias rather than a public family name. The page mixes techniques; it is not evidence that every graphic is ASCII. The useful design lesson is continuity: the visual language extends through imagery, typography, interactions, and the lower page.

This portfolio now applies that continuity in monochrome:

- Main identity, section headings, project names, and headline statistics are constructed from printable characters sampled from a letter mask. An animated lighting sweep passes across the glyphs; the real text stays in the DOM for selection and assistive technology.
- Project scenes animate their actual geometry: drifting connected nodes, propagating forecasting waves, turning workflow stages, and an orbiting satellite. Their sampling density adapts to the display scale.
- The botanical hero turns more clearly, its leaves sway independently, the pointer changes its viewing angle, and loose pollen characters make the airflow visible.
- A restrained moving character field continues around the page edges. A radial ASCII study replaces the large experience quote.
- Navigation, project actions, and lab names briefly decode from characters on entry, focus, and hover. Descriptive prose remains readable monospace text.
- Lab metadata now sits with its project description. A compact animated character study and explicit OPEN marker occupy the final column. There is no unused metadata slot.

All decorative motion follows the same saved pause setting and the operating-system reduced-motion preference. Canvas work stops offscreen and in hidden documents. Motion is frame-rate limited; no scroll hijacking or new rendering library is introduced. [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) and [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) remain the implementation references.

## Earlier reference and typography comparison

The supplied [Imagine Enosta Website with ASCII Style](https://dribbble.com/shots/22564682-Imagine-Enosta-Website-with-ASCII-Style) is published by Enosta. Its description explicitly discusses movement in a black-and-white environment and static-noise video effects in the showcase. It does **not** identify the font. Any font selected below is an independent choice; none is claimed to be the reference's exact face.

The user's additional white-on-black numerical and binary references make character density central to the brief. The implementation should produce substantial forms with interior light and shade, assembled from characters. Sparse outlines alone do not satisfy that visual target.

Combine three scales: large simple text, a substantial moving character field, and small precise labels. Short introductions, finite sections, and native scrolling keep the page approachable. The art supplies most of the personality; the copy explains the person and the work clearly.

## Recommended typography

The earlier plain-type recommendation was **Space Grotesk + JetBrains Mono**. The current revision replaces major display text with actual ASCII lettering and uses JetBrains Mono for navigation and descriptive prose. Courier-style letter masks and drawing glyphs give the display text its terminal character. Space Grotesk remains available for secondary headings. The 40-family comparison below records the research behind these decisions; it is not a claim that the final character lettering is a downloaded display font.

[Space Grotesk's author](https://github.com/floriankarsten/space-grotesk) documents its origins in Space Mono and its adaptation to proportional reading. That gives the typography a connection to the character-based artwork while keeping paragraphs and navigation readable. This relationship is the reason to select it; the font name alone will not give the website a distinctive design.

[JetBrains Mono's design documentation](https://www.jetbrains.com/lp/mono/) explains its increased lowercase height, distinguishable symbols, and programming ligatures. These characteristics suit small technical labels and numerical fields. Disable ligatures for the art and measure the actual glyph advance after the font is ready. Each position in the grid must remain an independent cell. Interface text should stay comfortably readable; the art texture can operate at a smaller scale.

The quieter runner-up is **Geist Sans + Geist Mono**. [Vercel describes Geist](https://vercel.com/font) as a type family for developers and designers emphasizing simplicity and clarity. It is an appropriate neutral option, but the layout and art would need to do even more of the identity work.

For a deliberately plain Helvetica-like atmosphere, **Instrument Sans + Fragment Mono** is another credible pairing. Google's primary [Fragment Mono description](https://github.com/google/fonts/tree/main/ofl/fragmentmono) identifies its Helvetica/Nimbus Sans lineage. Arial/Helvetica can remain system fallbacks; bundling an open font offers more consistent character dimensions across devices.

### Forty-family comparison

These forty distinct families were screened using the Google Fonts repository's primary metadata and descriptions, supplemented by author/foundry sources. Every linked directory was verified to exist. These are source-based candidates, not a claim that forty page variants were rendered. The fit notes are design judgments for this brief.

| # | Family and primary source | Character / role | Assessment for this site |
| --- | --- | --- | --- |
| 01 | [Space Grotesk](https://github.com/google/fonts/tree/main/ofl/spacegrotesk) | Proportional sans with monospace ancestry | Recommended: connects plain text and technical art. |
| 02 | [Geist](https://github.com/google/fonts/tree/main/ofl/geist) | Restrained contemporary sans | Strong neutral runner-up for headings and paragraphs. |
| 03 | [IBM Plex Sans](https://github.com/google/fonts/tree/main/ofl/ibmplexsans) | Neutral, friendly grotesque | Credible technical voice; more institutional in this composition. |
| 04 | [Chivo](https://github.com/google/fonts/tree/main/ofl/chivo) | Grotesque with strong headline weights | Useful when the typography needs more weight. |
| 05 | [Barlow](https://github.com/google/fonts/tree/main/ofl/barlow) | Slightly rounded, low-contrast grotesque | Clear compact option; softer industrial character. |
| 06 | [Archivo](https://github.com/google/fonts/tree/main/ofl/archivo) | Headline-oriented grotesque | Good for firm, tightly composed project titles. |
| 07 | [Sora](https://github.com/google/fonts/tree/main/ofl/sora) | Geometric technology-oriented sans | Fits digital work; less restrained than the leading pair. |
| 08 | [Spline Sans](https://github.com/google/fonts/tree/main/ofl/splinesans) | Compact UI grotesque with distinctive details | Strong alternative for narrow layouts and paragraphs. |
| 09 | [Inter](https://github.com/google/fonts/tree/main/ofl/inter) | Screen-focused sans with tall x-height | Reliable reading option; modest identity contribution. |
| 10 | [Work Sans](https://github.com/google/fonts/tree/main/ofl/worksans) | Early-grotesque influence | Flexible and human; slightly less exacting in tone. |
| 11 | [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans) | Low-contrast geometric sans | Easy reading; understated product voice. |
| 12 | [Public Sans](https://github.com/google/fonts/tree/main/ofl/publicsans) | Neutral interface/text family | Functional baseline; little expressive tension. |
| 13 | [Instrument Sans](https://github.com/google/fonts/tree/main/ofl/instrumentsans) | Precise neo-grotesque with playful details | Excellent quiet alternative to Space Grotesk. |
| 14 | [Manrope](https://github.com/google/fonts/tree/main/ofl/manrope) | Modern sans, already used locally | Can serve body copy; changing it alone is not a redesign. |
| 15 | [Hanken Grotesk](https://github.com/google/fonts/tree/main/ofl/hankengrotesk) | Classic-grotesque influence | Balanced alternative for a less overt technical voice. |
| 16 | [Plus Jakarta Sans](https://github.com/google/fonts/tree/main/ofl/plusjakartasans) | Near-monolinear geometric sans | Polished; the brief benefits from plainer letterforms. |
| 17 | [Schibsted Grotesk](https://github.com/google/fonts/tree/main/ofl/schibstedgrotesk) | Digital-first UI family | Good paragraph/navigation candidate. |
| 18 | [Albert Sans](https://github.com/google/fonts/tree/main/ofl/albertsans) | Modern geometric sans | Clean alternative; lower priority than the grotesques. |
| 19 | [Bricolage Grotesque](https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque) | Expressive, historically mixed grotesque | Interesting but may compete with the character field. |
| 20 | [Outfit](https://github.com/google/fonts/tree/main/ofl/outfit) | Geometric brand family | Clear silhouettes; stronger display personality. |
| 21 | [Urbanist](https://github.com/google/fonts/tree/main/ofl/urbanist) | Low-contrast geometric sans | Airy display candidate; not needed for this direction. |
| 22 | [Onest](https://github.com/google/fonts/tree/main/ofl/onest) | Sans-serif family | Additional restrained text candidate; not a finalist. |
| 23 | [Noto Sans](https://github.com/google/fonts/tree/main/ofl/notosans) | Broad multilingual text family | Valuable coverage; unnecessary for identity here. |
| 24 | [Roboto](https://github.com/google/fonts/tree/main/ofl/roboto) | Mechanical structure with open curves | Solid reading baseline; little connection to the art. |
| 25 | [JetBrains Mono](https://github.com/google/fonts/tree/main/ofl/jetbrainsmono) | Developer-focused monospace | Recommended for clear numerals, glyphs, and labels. |
| 26 | [Geist Mono](https://github.com/google/fonts/tree/main/ofl/geistmono) | Restrained developer monospace | Best quiet runner-up; pairs naturally with Geist. |
| 27 | [IBM Plex Mono](https://github.com/google/fonts/tree/main/ofl/ibmplexmono) | Grotesque-related monospace | Proven local option; warmer and less stark. |
| 28 | [Space Mono](https://github.com/google/fonts/tree/main/ofl/spacemono) | Fixed-width source of Space Grotesk | Distinctive, but more characterful than needed here. |
| 29 | [Chivo Mono](https://github.com/google/fonts/tree/main/ofl/chivomono) | Monospaced sibling of Chivo | Useful coordinated family alternative. |
| 30 | [Spline Sans Mono](https://github.com/google/fonts/tree/main/ofl/splinesansmono) | Monospaced grotesque for UI/programming | Strong compact alternative with subtle sharp details. |
| 31 | [Azeret Mono](https://github.com/google/fonts/tree/main/ofl/azeretmono) | Mono informed by OCR and interfaces | Evocative for numerical art; stronger retro statement. |
| 32 | [Roboto Mono](https://github.com/google/fonts/tree/main/ofl/robotomono) | Screen-readable monospaced Roboto relative | Reliable functional choice; low visual surprise. |
| 33 | [Inconsolata](https://github.com/google/fonts/tree/main/ofl/inconsolata) | Monospace made for code listings | Fine texture; compare weight carefully on black. |
| 34 | [Recursive](https://github.com/google/fonts/tree/main/ofl/recursive) | Variable family spanning sans and mono | More expressive variability than this design needs. |
| 35 | [Fira Code](https://github.com/google/fonts/tree/main/ofl/firacode) | Coding monospace emphasizing ligatures | Good clarity; disable ligatures for character art. |
| 36 | [Source Code Pro](https://github.com/google/fonts/tree/main/ofl/sourcecodepro) | Uniform-width companion to Source Sans | Quiet and reliable; useful control candidate. |
| 37 | [Martian Mono](https://github.com/google/fonts/tree/main/ofl/martianmono) | Assertive mono with width variation | Strong numerical voice; may overpower compact labels. |
| 38 | [Red Hat Mono](https://github.com/google/fonts/tree/main/ofl/redhatmono) | Geometric brand monospace | Friendly technical option; less austere than the brief. |
| 39 | [PT Mono](https://github.com/google/fonts/tree/main/ofl/ptmono) | Equal-width face for forms and tables | Useful tabular discipline; less distinctive in display. |
| 40 | [Fragment Mono](https://github.com/google/fonts/tree/main/ofl/fragmentmono) | Helvetica/Nimbus-derived coding monospace | Best plain modern-sans alternative for the ASCII field. |

Recursive's variable sans/mono range is documented by its [creator](https://github.com/arrowtype/recursive). IBM describes the related Sans/Mono family in its [official project](https://github.com/IBM/plex). These sources support family characteristics, not a claim that any face automatically produces a good website.

## Art and layout decisions

- Use black, white, and neutral gray. Suggested working values are near-black `#080808` and white `#f5f5f5`, with intermediate grays for depth and secondary copy. Check actual contrast after implementation.
- Build original dense botanical/organic forms from ASCII or numerical glyphs. Flowers, leaves, and branching forms should have filled volume and coherent lighting. Binary/numerical texture can vary by density and brightness without random full-frame flicker.
- Give the art substantial space. Surround it with calm plain-sans text, a concise identity statement, and a direct route to the work. Avoid specimen cards, serif quotations, paper textures, and ornamental field-note language.
- Keep a finite page: introduction/art, selected work, compact background and lab, then contact. Full narratives stay on dedicated case URLs. Do not stretch every item into a screen-height section.
- Preserve native scrolling. Character animation should read as movement of a form; a constantly scrambling wall of letters would obscure the subject.
- Keep keyboard focus, mobile navigation, readable controls, and tap targets. Decorative ASCII stays separate from document headings and body text.

The [Three.js ASCII example](https://threejs.org/examples/webgl_effects_ascii.html) and its [source](https://github.com/mrdoob/three.js/blob/master/examples/webgl_effects_ascii.html) demonstrate a scene rendered through `AsciiEffect`. The relevant technique is converting shape and luminance into characters. The custom renderer can use that principle without copying the scene or adding Three.js.

[MDN's requestAnimationFrame documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) supports time-based animation progress and repaint scheduling. Keep rendering bounded, pause when hidden or offscreen, cancel work on cleanup, and use a deliberate frame-rate budget. [MDN's reduced-motion reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) establishes how to detect the device preference. A still frame must retain the complete composition. The pause control must stop the actual art.

## Content, routes, and deployment

Keep the curated facts and public destinations in `src/data/site.ts`: Aleem's identity, four flagship projects, eight lab projects, five experience entries, and three recognitions. Preserve each project's maturity. DataFest is a team award; RGAN remains research; FindMyJob remains a Greenhouse-first beta; AgentWarehouse remains a release candidate.

Keep static-hosting-safe full stories at `?case=agentwarehouse`, `?case=rgan-research`, `?case=findmyjob`, and `?case=rhok-sat`. Next-case navigation, home return, browser history, scroll restoration, keyboard focus, filtering, and contact links remain functional contracts. The private profile and ignored PDFs stay outside public assets and the bundle.

GitHub Pages configuration distinguishes repository deployments (`/<repository>/`) from username/organization sites (`/`). Development uses `/`, including CI tests. `VITE_BASE_PATH` supplies an explicit build/preview prefix. Preserve this behavior and refresh favicon/social artwork for the final black-background design.

## Verification

The final implementation's build, browser, accessibility, production-prefix, and screenshot evidence is recorded in the [verification report](verification.md). The research above explains the design choices; the report distinguishes automated behavior checks from the visual review needed to assess composition and character density.
